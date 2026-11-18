const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');

test('workspace and proxy default to the isolated Stellar backend', () => {
  const context = readFileSync(resolve(__dirname, '../contexts/ConnectionContext.tsx'),'utf8');
  const proxy = readFileSync(resolve(__dirname, '../lib/proxyServer.ts'),'utf8');
  assert.match(context, /EXPO_PUBLIC_MANAGER_URL\s*\|\|\s*'https:\/\/helixbox-stellar-manager-43f4\.onrender\.com'/);
  assert.match(context, /EXPO_PUBLIC_GATEWAY_URL\s*\|\|\s*'wss:\/\/helixbox-stellar-proxy-43f4\.onrender\.com'/);
  assert.match(proxy, /EXPO_PUBLIC_GATEWAY_URL\s*\|\|\s*'wss:\/\/helixbox-stellar-proxy-43f4\.onrender\.com'/);
  assert.doesNotMatch(context, /https:\/\/helixbox-manager\.onrender\.com|wss:\/\/helixbox-proxy\.onrender\.com/);
});

test('Stellar app does not mount the legacy automatic mandate runner', () => {
  const layout = readFileSync(resolve(__dirname, '../app/_layout.tsx'),'utf8');
  assert.doesNotMatch(layout, /ModelMandateRunner/);
});
