import sqlite3 from 'sqlite3';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../data/msme.db');

function openDb() {
  return new sqlite3.Database(DB_PATH);
}

function query(db, sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))));
}

function normalizeText(text = '') {
  return String(text).toLowerCase();
}

function buildSqlForQuery(queryText) {
  const normalized = normalizeText(queryText);
  if (normalized.includes('who owes') || normalized.includes('owes me money') || normalized.includes('debtors')) {
    return {
      label: 'debtors',
      sql: 'SELECT name, balance_due FROM customers WHERE balance_due > 0',
      description: 'Customers with outstanding balances',
    };
  }

  if (normalized.includes('profit last month') || normalized.includes('profit') || normalized.includes('income - expenses')) {
    return {
      label: 'profit',
      sql: 'SELECT SUM(amount) as total_sales FROM sales WHERE date >= date("now", "-30 days")',
      description: 'Profit for the last 30 days',
    };
  }

  if (normalized.includes('cheapest') && normalized.includes('supplier')) {
    return {
      label: 'cheapest_supplier',
      sql: 'SELECT suppliers.name, suppliers.cost, products.name as product_name FROM suppliers JOIN products ON suppliers.product_id = products.id ORDER BY suppliers.cost ASC LIMIT 1',
      description: 'Cheapest supplier for any product',
    };
  }

  if (normalized.includes('low stock') || normalized.includes('running out') || normalized.includes('out of stock')) {
    return {
      label: 'low_stock',
      sql: 'SELECT name, stock_qty, reorder_threshold FROM products WHERE stock_qty <= reorder_threshold',
      description: 'Products that are running low on stock',
    };
  }

  return null;
}

export async function answerNaturalLanguageQuery({ queryText = '' } = {}) {
  const route = buildSqlForQuery(queryText);
  if (!route) {
    return {
      finding: 'Unable to map this natural language query to a supported business report.',
      recommendation: 'Try asking about debtors, profit, cheapest supplier, or low stock items.',
      confidence: 0.45,
      reasoning: ['Supported queries are limited to debtors, profit, cheapest suppliers, and low-stock alerts.'],
      results: [],
    };
  }

  const db = openDb();
  try {
    const rows = await query(db, route.sql);
    let finding = '';
    let recommendation = '';

    if (route.label === 'debtors') {
      finding = `Found ${rows.length} customer(s) with outstanding balances.`;
      recommendation = rows.length
        ? 'Collect dues from these customers to improve cash flow.'
        : 'No outstanding customer balances were found.';
    } else if (route.label === 'profit') {
      const totalSales = rows[0]?.total_sales || 0;
      const totalExpensesRow = await query(db, 'SELECT SUM(amount) as total_expenses FROM expenses WHERE date >= date("now", "-30 days")');
      const totalExpenses = totalExpensesRow[0]?.total_expenses || 0;
      const profit = totalSales - totalExpenses;
      finding = `Revenue for the last 30 days is ₹${Number(totalSales).toFixed(2)}, expenses are ₹${Number(totalExpenses).toFixed(2)}.`;
      recommendation = profit >= 0
        ? `Estimated profit is ₹${Number(profit).toFixed(2)}; continue monitoring high-margin items.`
        : `Estimated loss is ₹${Number(-profit).toFixed(2)}; review expenses and pricing.`;
    } else if (route.label === 'cheapest_supplier') {
      const best = rows[0];
      if (best) {
        finding = `Cheapest supplier is ${best.name} for ${best.product_name} at ₹${Number(best.cost).toFixed(2)}.`;
        recommendation = 'Consider ordering from this supplier for cost savings.';
      } else {
        finding = 'No supplier data available to determine the cheapest supplier.';
        recommendation = 'Add supplier pricing data and try again.';
      }
    } else if (route.label === 'low_stock') {
      finding = `Found ${rows.length} product(s) at or below reorder threshold.`;
      recommendation = rows.length
        ? 'Reorder these items to avoid an out-of-stock situation.'
        : 'Inventory levels are healthy for all monitored products.';
    }

    return {
      finding,
      recommendation,
      confidence: 0.8,
      reasoning: [route.description],
      results: rows,
    };
  } finally {
    db.close();
  }
}
