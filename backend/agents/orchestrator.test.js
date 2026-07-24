import assert from 'node:assert/strict';
import { orchestrateQuery } from './orchestrator.js';

const scenarios = [
  ['I am low on rice and need a reorder', ['inventory']],
  ['Can I afford to buy more oil with this cash?', ['inventory', 'finance']],
  ['What is the demand forecast for tea sales?', ['sales']],
  ['What GST will I pay on a reorder?', ['inventory', 'gst']],
  ['Send a WhatsApp payment reminder to this customer', ['finance', 'support']],
];

for (const [query, expectedAgents] of scenarios) {
  const result = orchestrateQuery({ query });
  assert.deepEqual(result.agents_to_call, expectedAgents, query);
  assert.equal(typeof result.finding, 'string');
  assert.equal(typeof result.recommendation, 'string');
  assert.ok(result.confidence >= 0 && result.confidence <= 1);
  assert.ok(Array.isArray(result.reasoning));
}

assert.deepEqual(orchestrateQuery({ query: 'Hello' }).agents_to_call, ['sales', 'inventory']);
assert.deepEqual(orchestrateQuery({ query: '  ' }).agents_to_call, []);

console.log('Orchestrator smoke tests passed.');
