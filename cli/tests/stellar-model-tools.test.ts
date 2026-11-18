import test from 'node:test';
import assert from 'node:assert/strict';
import {createModelToolClient, MODEL_TOOL_DEFINITIONS} from '../src/ai/model-tools.ts';

test('does not expose or execute legacy delegated purchase tools during the Stellar migration', async () => {
  assert.deepEqual(MODEL_TOOL_DEFINITIONS.map(tool => tool.name), ['helixbox_model_catalog']);
  let calls = 0;
  const client = createModelToolClient(() => ({managerUrl:'https://example.test',password:'paired'}), async () => {
    calls++; return Response.json({});
  });
  await assert.rejects(client.call('helixbox_model_purchase', {purchaseId:'anything'}), /unknown|unavailable/i);
  assert.equal(calls,0);
});
