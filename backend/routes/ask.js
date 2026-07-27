import { Router } from 'express';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { orchestrateQuery } from '../agents/orchestrator.js';
import { analyzeInventory } from '../agents/inventoryAgent.js';
import { analyzeFinance } from '../agents/financeAgent.js';
import { analyzeSales } from '../agents/salesAgent.js';
import { analyzeGST } from '../agents/gstAgent.js';
import { draftSupportMessage } from '../agents/supportAgent.js';
import { synthesizeRecommendations } from '../agents/synthesizer.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../data/msme.db');

function openDb() {
  return new sqlite3.Database(dbPath);
}

function get(db, sql, parameters = []) {
  return new Promise((resolve, reject) => db.get(sql, parameters, (error, row) => (error ? reject(error) : resolve(row))));
}

function all(db, sql, parameters = []) {
  return new Promise((resolve, reject) => db.all(sql, parameters, (error, rows) => (error ? reject(error) : resolve(rows))));
}

function run(db, sql, parameters = []) {
  return new Promise((resolve, reject) => db.run(sql, parameters, function onRun(error) {
    if (error) reject(error);
    else resolve(this);
  }));
}

function close(db) {
  return new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));
}

function extractTokens(text) {
  return Array.from(new Set(String(text).toLowerCase().match(/[a-z0-9]+/g) || []));
}

async function findProductId(query) {
  const db = openDb();
  try {
    const tokens = extractTokens(query);
    for (const token of tokens) {
      const row = await get(db, `
        SELECT id FROM products
        WHERE lower(name) LIKE ? OR lower(category) LIKE ?
        LIMIT 1
      `, [`%${token}%`, `%${token}%`]);
      if (row) return row.id;
    }
    return null;
  } finally {
    await close(db);
  }
}

async function findCategory(query) {
  const db = openDb();
  try {
    const tokens = extractTokens(query);
    for (const token of tokens) {
      const row = await get(db, `
        SELECT category FROM products
        WHERE lower(category) LIKE ?
        LIMIT 1
      `, [`%${token}%`]);
      if (row) return row.category;
    }
    return null;
  } finally {
    await close(db);
  }
}

async function findCustomerName(query) {
  const db = openDb();
  try {
    const tokens = extractTokens(query);
    for (const token of tokens) {
      const row = await get(db, `
        SELECT name FROM customers
        WHERE lower(name) LIKE ?
        LIMIT 1
      `, [`%${token}%`]);
      if (row) return row.name;
    }
    return null;
  } finally {
    await close(db);
  }
}

function inferSupportSituation(query) {
  const normalized = String(query).toLowerCase();
  if (normalized.includes('due') || normalized.includes('reminder') || normalized.includes('payment')) {
    return 'payment_due';
  }
  if (normalized.includes('order ready') || normalized.includes('ready for pickup') || normalized.includes('ready')) {
    return 'order_ready';
  }
  if (normalized.includes('thank')) {
    return 'thank_you';
  }
  return 'general';
}

async function estimateProposedCost(query, productId) {
  const explicitAmount = String(query).match(/₹\s*([0-9]+(?:\.[0-9]+)?)/);
  if (explicitAmount) {
    return Number(explicitAmount[1]);
  }

  const db = openDb();
  try {
    if (productId) {
      const product = await get(db, `
        SELECT stock_qty, reorder_threshold, unit_cost
        FROM products
        WHERE id = ?
      `, [productId]);
      if (product) {
        const reorderQty = Math.max(0, Number(product.reorder_threshold) - Number(product.stock_qty));
        return Number((reorderQty * Number(product.unit_cost)).toFixed(2)) || 5000;
      }
    }
  } finally {
    await close(db);
  }

  return 5000;
}

router.post('/ask', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required and must be a string.' });
  }

  try {
    const orchestration = orchestrateQuery({ query });
    const agentOutputs = [];
    const productId = await findProductId(query);
    const category = await findCategory(query) || 'General';
    const customerName = await findCustomerName(query) || 'Customer';
    const proposedCost = await estimateProposedCost(query, productId);
    const situation = inferSupportSituation(query);

    for (const agentName of orchestration.agents_to_call) {
      let output;
      switch (agentName) {
        case 'inventory':
          output = await analyzeInventory({ productId, dbPath });
          break;
        case 'finance':
          output = await analyzeFinance({ proposedCost, dbPath });
          break;
        case 'sales':
          output = await analyzeSales({ productId, category, dbPath });
          break;
        case 'gst':
          output = analyzeGST({ amount: proposedCost, category });
          break;
        case 'support':
          output = draftSupportMessage({ customerName, situation });
          break;
        default:
          output = {
            finding: `Agent ${agentName} is not available.`, 
            recommendation: 'No output available from this agent.',
            confidence: 0,
            reasoning: ['Unknown agent selected by orchestrator.'],
          };
      }
      agentOutputs.push({ agent: agentName, ...output });
    }

    const synthesized = synthesizeRecommendations({ agents_outputs: agentOutputs });
    const agentRunId = uuidv4();
    const db = openDb();
    try {
      const runResult = await run(db, `
        INSERT INTO agent_runs
          (id, query, agents_invoked, reasoning_chain, final_output, confidence, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        agentRunId,
        query,
        JSON.stringify(orchestration.agents_to_call),
        JSON.stringify(agentOutputs),
        synthesized.final_answer,
        synthesized.confidence,
        new Date().toISOString(),
      ]);
      if (!runResult) {
        throw new Error('Failed to persist agent run.');
      }
    } finally {
      await close(db);
    }

    return res.json({
      reasoning_chain: synthesized.reasoning_chain,
      final_answer: synthesized.final_answer,
      confidence: synthesized.confidence,
      agent_runs_id: agentRunId,
    });
  } catch (error) {
    console.error('Error in /api/ask:', error);
    return res.status(500).json({ error: 'Failed to process the query. Please try again.' });
  }
});

export default router;
