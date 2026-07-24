import assert from 'node:assert/strict';
import sqlite3 from 'sqlite3';
import { seedDatabase } from '../seed/seedData.js';
import { analyzeInventory } from './inventoryAgent.js';

const dbPath = '/tmp/msme-inventory-agent-test.db';
await seedDatabase(dbPath);
const db = new sqlite3.Database(dbPath);
const run = (sql, values = []) => new Promise((resolve, reject) => db.run(sql, values, (error) => (error ? reject(error) : resolve())));
await run("INSERT OR IGNORE INTO products (id, name, category, stock_qty, reorder_threshold, unit_cost, unit_price) VALUES ('product-new', 'New Item', 'Test', 2, 10, 10, 15)");
await run("UPDATE sales SET qty = 30, amount = 1950 WHERE product_id = 'product-red-chilli'");
await new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));

for (const productId of ['product-toor-dal', 'product-new', 'product-red-chilli']) {
  const result = await analyzeInventory({ productId, dbPath });
  assert.equal(typeof result.finding, 'string');
  assert.equal(typeof result.recommendation, 'string');
  assert.ok(result.confidence >= 0 && result.confidence <= 1);
  assert.ok(Array.isArray(result.reasoning));
}
assert.match((await analyzeInventory({ productId: 'product-new', dbPath })).finding, /no sales history/);
console.log('Inventory agent smoke tests passed.');
