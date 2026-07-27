import { Router } from 'express';
import PDFDocument from 'pdfkit';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../data/msme.db');

function openDb() {
  return new sqlite3.Database(dbPath);
}

function all(db, sql, parameters = []) {
  return new Promise((resolve, reject) => db.all(sql, parameters, (error, rows) => (error ? reject(error) : resolve(rows))));
}

async function generateWeeklyReport(db) {
  const [sales, expenses, lowStock, topProducts] = await Promise.all([
    all(db, 'SELECT SUM(amount) as total_sales FROM sales WHERE date >= date("now", "-7 days")'),
    all(db, 'SELECT category, SUM(amount) as total_expense FROM expenses WHERE date >= date("now", "-7 days") GROUP BY category'),
    all(db, 'SELECT name, stock_qty, reorder_threshold FROM products WHERE stock_qty <= reorder_threshold'),
    all(db, 'SELECT p.name, SUM(s.qty) as total_qty FROM sales s JOIN products p ON s.product_id = p.id WHERE s.date >= date("now", "-7 days") GROUP BY p.name ORDER BY total_qty DESC LIMIT 5'),
  ]);

  const totalSales = sales[0]?.total_sales || 0;
  const totalExpenses = expenses.reduce((sum, row) => sum + Number(row.total_expense), 0);
  const profit = totalSales - totalExpenses;

  return {
    summary: {
      total_sales: Number(totalSales.toFixed(2)),
      total_expenses: Number(totalExpenses.toFixed(2)),
      profit: Number(profit.toFixed(2)),
    },
    expenses: expenses.map((row) => ({ category: row.category, total: Number(row.total_expense.toFixed(2)) })),
    low_stock: lowStock.map((row) => ({ name: row.name, stock_qty: row.stock_qty, reorder_threshold: row.reorder_threshold })),
    top_products: topProducts.map((row) => ({ name: row.name, quantity_sold: row.total_qty })),
    recommendations: [
      'Review low-stock items and reorder from suppliers.',
      'Check expense categories for any large spending spikes.',
    ],
  };
}

router.get('/report/weekly', async (_req, res) => {
  const db = openDb();
  try {
    const report = await generateWeeklyReport(db);
    res.json({ report });
  } catch (error) {
    console.error('Failed to generate weekly report:', error);
    res.status(500).json({ error: 'Unable to generate weekly report.' });
  } finally {
    db.close();
  }
});

router.get('/report/weekly/pdf', async (_req, res) => {
  const db = openDb();
  try {
    const report = await generateWeeklyReport(db);
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="weekly_report.pdf"');
    doc.pipe(res);

    doc.fontSize(20).text('Weekly Business Report', { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Total Sales: ₹${report.summary.total_sales}`);
    doc.text(`Total Expenses: ₹${report.summary.total_expenses}`);
    doc.text(`Estimated Profit: ₹${report.summary.profit}`);
    doc.moveDown();

    doc.fontSize(14).text('Top Products', { underline: true });
    report.top_products.forEach((item) => {
      doc.text(`• ${item.name}: ${item.quantity_sold} units`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Low Stock Alerts', { underline: true });
    report.low_stock.forEach((item) => {
      doc.text(`• ${item.name}: ${item.stock_qty} units, threshold ${item.reorder_threshold}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Expense Breakdown', { underline: true });
    report.expenses.forEach((item) => {
      doc.text(`• ${item.category}: ₹${item.total}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Recommendations', { underline: true });
    report.recommendations.forEach((item) => {
      doc.text(`• ${item}`);
    });

    doc.end();
  } catch (error) {
    console.error('Failed to generate report PDF:', error);
    res.status(500).json({ error: 'Unable to generate report PDF.' });
  } finally {
    db.close();
  }
});

export default router;
