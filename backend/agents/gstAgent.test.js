import assert from 'node:assert/strict';
import { analyzeGST } from './gstAgent.js';

const basic = analyzeGST({ amount: 1000, category: 'Rice & Grains' });
const luxury = analyzeGST({ amount: 1000, category: 'Leather Goods' });
const invalid = analyzeGST({ amount: -10, category: 'Staples' });

assert.match(basic.recommendation, /₹/);
assert.equal(basic.confidence, 0.8);
assert.match(luxury.recommendation, /₹/);
assert.match(invalid.finding, /Invalid transaction amount/);
console.log('GST agent smoke tests passed.');
