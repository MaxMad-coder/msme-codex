import sqlite3 from 'sqlite3';

function all(db, sql, parameters = []) {
  return new Promise((resolve, reject) => db.all(sql, parameters, (error, rows) => (error ? reject(error) : resolve(rows))));
}

function close(db) {
  return new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));
}

export async function analyzeSales({ productId, category, dbPath = process.env.DB_PATH || './data/msme.db' } = {}) {
  const db = new sqlite3.Database(dbPath);
  try {
    const filter = productId ? 'AND s.product_id = ?' : category ? 'AND lower(p.category) = ?' : '';
    const params = productId ? [productId] : category ? [category.toLowerCase()] : [];

    const [last30] = await all(db, `
      SELECT COALESCE(SUM(s.qty), 0) AS units, COUNT(DISTINCT s.date) AS selling_days
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      WHERE s.date >= date('now', '-30 days') ${filter}
    `, params);

    const [last7] = await all(db, `
      SELECT COALESCE(SUM(s.qty), 0) AS units, COUNT(DISTINCT s.date) AS selling_days
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      WHERE s.date >= date('now', '-7 days') ${filter}
    `, params);

    const [prev7] = await all(db, `
      SELECT COALESCE(SUM(s.qty), 0) AS units, COUNT(DISTINCT s.date) AS selling_days
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      WHERE s.date BETWEEN date('now', '-14 days') AND date('now', '-8 days') ${filter}
    `, params);

    const avg30 = last30.selling_days ? Number(last30.units) / 30 : 0;
    const avg7 = last7.selling_days ? Number(last7.units) / 7 : 0;
    const avgPrev7 = prev7.selling_days ? Number(prev7.units) / 7 : 0;
    const trendPercent = avgPrev7 ? ((avg7 - avgPrev7) / avgPrev7) * 100 : 0;
    const forecastQty = Math.max(0, avg7 * 7 * (1 + trendPercent / 100));

    const contextLabel = productId ? `product ${productId}` : category ? `category ${category}` : 'your store';
    const trendText = trendPercent >= 0
      ? `Sales are up ${trendPercent.toFixed(1)}% week-over-week.`
      : `Sales are down ${Math.abs(trendPercent).toFixed(1)}% week-over-week.`;
    const forecastLabel = forecastQty > 0 ? `~${Math.ceil(forecastQty)} units next week` : 'no forecast available yet';

    return {
      finding: `Sales trend for ${contextLabel}: ${avg7.toFixed(1)} units/day over the last 7 days.`,
      recommendation: `Forecast for next 7 days is ${forecastLabel}. ${trendText}`,
      confidence: last30.selling_days >= 10 ? 0.9 : last30.selling_days >= 3 ? 0.7 : 0.45,
      reasoning: [
        `Last 30 days sold ${last30.units} units across ${last30.selling_days} selling days (${avg30.toFixed(2)} units/day avg).`,
        `Recent 7-day pace is ${avg7.toFixed(2)} units/day, compared with ${avgPrev7.toFixed(2)} units/day in the prior week.`,
      ],
    };
  } finally {
    await close(db);
  }
}
