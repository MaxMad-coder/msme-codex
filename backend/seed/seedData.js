import { readFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sqlite3 from 'sqlite3';

const schemaPath = new URL('../db/schema.sql', import.meta.url);
const defaultDatabasePath = process.env.DB_PATH || './data/msme.db';

const products = [
  ['product-basmati-rice', 'Basmati Rice 5 kg', 'Rice & Grains', 12, 15, 310, 380],
  ['product-toor-dal', 'Toor Dal 1 kg', 'Pulses', 8, 12, 118, 145],
  ['product-sugar', 'Sugar 1 kg', 'Staples', 30, 20, 42, 50],
  ['product-milk', 'Full Cream Milk 1 L', 'Dairy', 18, 24, 58, 66],
  ['product-sunflower-oil', 'Sunflower Oil 1 L', 'Cooking Oil', 10, 14, 132, 155],
  ['product-salt', 'Iodised Salt 1 kg', 'Staples', 40, 20, 16, 22],
  ['product-turmeric', 'Turmeric Powder 200 g', 'Spices', 14, 10, 32, 45],
  ['product-red-chilli', 'Red Chilli Powder 200 g', 'Spices', 9, 10, 48, 65],
  ['product-atta', 'Whole Wheat Atta 5 kg', 'Flour', 22, 18, 210, 260],
  ['product-tea', 'CTC Tea 500 g', 'Beverages', 16, 12, 145, 185],
];

const suppliers = [
  ['supplier-grain', 'Sharma Grain Traders', 'product-basmati-rice', 2, 310],
  ['supplier-pulse', 'Rajasthan Pulses Depot', 'product-toor-dal', 3, 118],
  ['supplier-sugar', 'Gupta Wholesale Mart', 'product-sugar', 1, 42],
  ['supplier-dairy', 'Fresh Dairy Distributors', 'product-milk', 1, 58],
  ['supplier-oil', 'Khandelwal Oil Agency', 'product-sunflower-oil', 2, 132],
  ['supplier-salt', 'Gupta Wholesale Mart', 'product-salt', 1, 16],
  ['supplier-turmeric', 'National Spice House', 'product-turmeric', 3, 32],
  ['supplier-chilli', 'National Spice House', 'product-red-chilli', 3, 48],
  ['supplier-atta', 'Sharma Grain Traders', 'product-atta', 2, 210],
  ['supplier-tea', 'Tata Tea Distributors', 'product-tea', 4, 145],
];

const customers = [
  ['customer-anita', 'Anita Sharma', 640],
  ['customer-ramesh', 'Ramesh Kumar', 0],
  ['customer-fatima', 'Fatima Begum', 320],
  ['customer-sunil', 'Sunil Verma', 875],
  ['customer-meena', 'Meena Devi', 150],
];

function openDatabase(databasePath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(databasePath, (error) => {
      if (error) reject(error);
      else resolve(db);
    });
  });
}

function run(db, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, parameters, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function exec(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (error) => (error ? reject(error) : resolve()));
  });
}

function close(db) {
  return new Promise((resolve, reject) => {
    db.close((error) => (error ? reject(error) : resolve()));
  });
}

function isoDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

async function insertSeedData(db) {
  for (const product of products) {
    await run(
      db,
      `INSERT OR IGNORE INTO products
        (id, name, category, stock_qty, reorder_threshold, unit_cost, unit_price)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      product,
    );
  }

  for (const supplier of suppliers) {
    const [id, name, productId, leadTimeDays, cost] = supplier;
    await run(
      db,
      `INSERT OR IGNORE INTO suppliers (id, name, product_id, lead_time_days, cost)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, productId, leadTimeDays, cost],
    );
    await run(
      db,
      'UPDATE products SET supplier_id = ? WHERE id = ? AND supplier_id IS NULL',
      [id, productId],
    );
  }

  for (const customer of customers) {
    await run(
      db,
      'INSERT OR IGNORE INTO customers (id, name, balance_due) VALUES (?, ?, ?)',
      customer,
    );
  }

  const expenseRows = [
    ['expense-rent', 'Shop rent', 12000, isoDateDaysAgo(25)],
    ['expense-electricity', 'Electricity', 2850, isoDateDaysAgo(18)],
    ['expense-transport', 'Supplier transport', 1450, isoDateDaysAgo(13)],
    ['expense-mobile', 'Mobile and internet', 599, isoDateDaysAgo(8)],
    ['expense-packaging', 'Carry bags and packaging', 760, isoDateDaysAgo(4)],
  ];
  for (const expense of expenseRows) {
    await run(
      db,
      'INSERT OR IGNORE INTO expenses (id, category, amount, date) VALUES (?, ?, ?, ?)',
      expense,
    );
  }

  for (let daysAgo = 28; daysAgo >= 1; daysAgo -= 1) {
    for (let index = 0; index < products.length; index += 1) {
      const [productId, , , , , , unitPrice] = products[index];
      const weekdayBoost = daysAgo % 7 === 0 ? 2 : 0;
      const quantity = 1 + ((index + daysAgo) % 4) + weekdayBoost;
      await run(
        db,
        `INSERT OR IGNORE INTO sales (id, product_id, qty, date, amount)
         VALUES (?, ?, ?, ?, ?)`,
        [
          `sale-${daysAgo}-${productId}`,
          productId,
          quantity,
          isoDateDaysAgo(daysAgo),
          Number((quantity * unitPrice).toFixed(2)),
        ],
      );
    }
  }
}

export async function seedDatabase(databasePath = defaultDatabasePath) {
  await mkdir(path.dirname(path.resolve(databasePath)), { recursive: true });
  const db = await openDatabase(databasePath);

  try {
    await exec(db, await readFile(schemaPath, 'utf8'));
    await exec(db, 'BEGIN TRANSACTION');
    await insertSeedData(db);
    await exec(db, 'COMMIT');
  } catch (error) {
    await exec(db, 'ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await close(db);
  }
}

const isDirectRun = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
  seedDatabase()
    .then(() => console.log(`Seed completed: ${defaultDatabasePath}`))
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exitCode = 1;
    });
}
