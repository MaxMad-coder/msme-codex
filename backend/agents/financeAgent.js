import sqlite3 from 'sqlite3';

function get(db, sql) {
  return new Promise((resolve, reject) => db.get(sql, (error, row) => (error ? reject(error) : resolve(row))));
}

export async function analyzeFinance({ proposedCost = 0, dbPath = process.env.DB_PATH || './data/msme.db' } = {}) {
  if (!Number.isFinite(proposedCost) || proposedCost < 0) {
    return { finding: 'Proposed cost must be a non-negative number.', recommendation: 'Provide the action cost in INR.', confidence: 1, reasoning: ['Invalid proposed cost.'] };
  }
  const db = new sqlite3.Database(dbPath);
  try {
    const revenue = Number((await get(db, 'SELECT COALESCE(SUM(amount), 0) AS total FROM sales')).total);
    const expenses = Number((await get(db, 'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses')).total);
    const dues = Number((await get(db, 'SELECT COALESCE(SUM(balance_due), 0) AS total FROM customers')).total);
    const cashPosition = revenue - expenses;
    const availableBudget = cashPosition - dues;
    const affordable = proposedCost <= availableBudget;
    return {
      finding: `Cash position is ₹${cashPosition.toFixed(2)}; conservative available budget is ₹${availableBudget.toFixed(2)}.`,
      recommendation: affordable ? `The ₹${proposedCost.toFixed(2)} action is affordable now.` : `Delay or reduce the ₹${proposedCost.toFixed(2)} action; it exceeds the available budget.`,
      confidence: 0.85,
      reasoning: [`Recorded sales ₹${revenue.toFixed(2)} minus expenses ₹${expenses.toFixed(2)}.`, `Pending customer dues of ₹${dues.toFixed(2)} are reserved before approving spend.`],
    };
  } finally {
    await new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));
  }
}
