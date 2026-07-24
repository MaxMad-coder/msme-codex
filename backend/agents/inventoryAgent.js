import sqlite3 from 'sqlite3';

function all(db, sql, parameters = []) {
  return new Promise((resolve, reject) => db.all(sql, parameters, (error, rows) => (error ? reject(error) : resolve(rows))));
}

function close(db) {
  return new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));
}

export async function analyzeInventory({ productId, dbPath = process.env.DB_PATH || './data/msme.db' } = {}) {
  if (!productId) {
    return { finding: 'A product ID is required.', recommendation: 'Choose a product to check inventory.', confidence: 1, reasoning: ['No product ID was provided.'] };
  }

  const db = new sqlite3.Database(dbPath);
  try {
    const [product] = await all(db, `SELECT p.*, s.name AS supplier_name, s.lead_time_days
      FROM products p LEFT JOIN suppliers s ON s.id = p.supplier_id WHERE p.id = ?`, [productId]);
    if (!product) {
      return { finding: 'Product not found.', recommendation: 'Check the product ID and try again.', confidence: 1, reasoning: [`No product matched ${productId}.`] };
    }
    const [sales] = await all(db, `SELECT COALESCE(SUM(qty), 0) AS units, COUNT(DISTINCT date) AS active_days
      FROM sales WHERE product_id = ? AND date >= date('now', '-30 days')`, [productId]);
    const activeDays = Number(sales.active_days);
    const dailyVelocity = activeDays ? Number(sales.units) / 30 : 0;
    const daysToDepletion = dailyVelocity ? Number(product.stock_qty) / dailyVelocity : null;
    const leadTime = Number(product.lead_time_days || 3);
    const targetStock = Math.max(Number(product.reorder_threshold), dailyVelocity * (leadTime + 7));
    const reorderQty = Math.max(0, Math.ceil(targetStock - Number(product.stock_qty)));
    const needsReorder = Number(product.stock_qty) <= Number(product.reorder_threshold) || reorderQty > 0;
    const depletionText = daysToDepletion === null ? 'no sales history' : `${daysToDepletion.toFixed(1)} days to depletion`;

    return {
      finding: `${product.name}: ${product.stock_qty} units in stock; ${depletionText}.`,
      recommendation: needsReorder
        ? `Reorder ${reorderQty || product.reorder_threshold} units from ${product.supplier_name || 'a supplier'}.`
        : 'Stock is sufficient; continue monitoring daily sales.',
      confidence: activeDays >= 14 ? 0.9 : activeDays ? 0.7 : 0.45,
      reasoning: [
        `Last 30 days: ${sales.units} units sold across ${activeDays} selling days (${dailyVelocity.toFixed(2)} units/day).`,
        `Target stock covers ${leadTime} supplier lead-time days plus a 7-day buffer; threshold is ${product.reorder_threshold} units.`,
      ],
    };
  } finally {
    await close(db);
  }
}
