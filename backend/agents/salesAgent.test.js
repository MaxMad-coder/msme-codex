import assert from 'node:assert/strict';
import { seedDatabase } from '../seed/seedData.js';
import { analyzeSales } from './salesAgent.js';

const dbPath = '/tmp/msme-sales-agent-test.db';
await seedDatabase(dbPath);

const stable = await analyzeSales({ category: 'Spices', dbPath });
const productSpecific = await analyzeSales({ productId: 'product-tea', dbPath });
const noContext = await analyzeSales({ dbPath });

assert.equal(typeof stable.finding, 'string');
assert.equal(typeof stable.recommendation, 'string');
assert.ok(stable.confidence >= 0 && stable.confidence <= 1);
assert.ok(Array.isArray(stable.reasoning));
assert.match(productSpecific.finding, /product product-tea/);
assert.match(noContext.finding, /your store/);
console.log('Sales agent smoke tests passed.');
