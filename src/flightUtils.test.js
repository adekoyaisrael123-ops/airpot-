import test from 'node:test';
import assert from 'node:assert/strict';
import { detectFlightDirection } from './flightUtils.js';

test('detects arriving flights to Lagos', () => {
  const result = detectFlightDirection({
    from: 'London',
    to: 'Lagos',
    lat: 7.0,
    lng: 3.4,
  });

  assert.equal(result, 'coming');
});

test('detects departing flights from Lagos', () => {
  const result = detectFlightDirection({
    from: 'Lagos',
    to: 'London',
    lat: 7.0,
    lng: 3.4,
  });

  assert.equal(result, 'going');
});
