PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  reorder_threshold INTEGER NOT NULL DEFAULT 10 CHECK (reorder_threshold >= 0),
  unit_cost REAL NOT NULL CHECK (unit_cost >= 0),
  unit_price REAL NOT NULL CHECK (unit_price >= 0),
  supplier_id TEXT,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  date TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount >= 0),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount >= 0),
  date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  lead_time_days INTEGER NOT NULL CHECK (lead_time_days >= 0),
  cost REAL NOT NULL CHECK (cost >= 0),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  balance_due REAL NOT NULL DEFAULT 0 CHECK (balance_due >= 0)
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  agents_invoked TEXT NOT NULL DEFAULT '[]',
  reasoning_chain TEXT NOT NULL DEFAULT '[]',
  final_output TEXT,
  confidence REAL CHECK (confidence >= 0 AND confidence <= 1),
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_product_date ON sales(product_id, date);
CREATE INDEX IF NOT EXISTS idx_suppliers_product_id ON suppliers(product_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_agent_runs_timestamp ON agent_runs(timestamp);
