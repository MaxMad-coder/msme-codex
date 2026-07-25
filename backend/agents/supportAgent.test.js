import assert from 'node:assert/strict';
import { draftSupportMessage } from './supportAgent.js';

const paymentMessage = draftSupportMessage({ customerName: 'Anita', situation: 'payment_due' });
const orderReady = draftSupportMessage({ customerName: 'Ramesh', situation: 'order_ready', language: 'hi' });
const thankYou = draftSupportMessage({ customerName: 'Meena', situation: 'thank_you' });

assert.match(paymentMessage.recommendation, /reminder/);
assert.match(orderReady.recommendation, /aapka order tayar hai/);
assert.equal(thankYou.confidence, 0.9);
console.log('Support agent smoke tests passed.');
