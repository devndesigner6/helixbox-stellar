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

test('Stellar app uses an independent Expo project slug and Android identifier', () => {
  const config = JSON.parse(readFileSync(resolve(__dirname, '../app.json'),'utf8'));
  assert.equal(config.expo.slug, 'helixbox-stellar');
  assert.equal(config.expo.android.package, 'xyz.helixbox.stellar');
  assert.notEqual(config.expo.extra.eas?.projectId, '40572439-3902-43f8-bfff-b7e98b33c18a');
});
