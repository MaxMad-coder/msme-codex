import assert from 'node:assert/strict';
import { seedDatabase } from '../seed/seedData.js';
import { analyzeFinance } from './financeAgent.js';

const dbPath = '/tmp/msme-finance-agent-test.db';
await seedDatabase(dbPath);
const healthy = await analyzeFinance({ proposedCost: 100, dbPath });
const tight = await analyzeFinance({ proposedCost: 100000, dbPath });
const invalid = await analyzeFinance({ proposedCost: -1, dbPath });
assert.match(healthy.recommendation, /affordable/);
assert.match(tight.recommendation, /exceeds/);
assert.equal(invalid.confidence, 1);
for (const result of [healthy, tight, invalid]) assert.ok(Array.isArray(result.reasoning));
console.log('Finance agent smoke tests passed.');
