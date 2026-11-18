import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('legacy paid routes remain disabled until Stellar payments are implemented', () => {
  const manager = readFileSync(new URL('../manager/src/index.ts', import.meta.url), 'utf8');
  assert.match(manager, /enabled:\s*false/);
  assert.doesNotMatch(manager, /x402App\s*=\s*createX402App\(/);
  const models = readFileSync(new URL('../app/lib/model-tools.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(models, /https:\/\/helixbox-manager\.onrender\.com/);
  assert.match(models, /Stellar payments are not available yet/);
  const wallet = readFileSync(new URL('../app/app/settings/wallet.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(wallet, /connectSolanaWallet/);
  const signer = readFileSync(new URL('../app/lib/solana-wallet.ts', import.meta.url), 'utf8');
  assert.match(signer, /Legacy Solana signing is disabled/);
  const modelApp = readFileSync(new URL('../manager/src/model-app.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(modelApp, /ExactSvmScheme|createModelMandateApp/);
  assert.match(modelApp, /ExactStellarScheme/);
});

test('workspace services do not default to the Solana deployment', () => {
  for (const path of ['../cli/src/index.ts', '../cli/src/ai/model-mcp.ts', '../proxy/src/index.ts', '../app/lib/proxyServer.ts']) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /https?:\/\/helixbox-(?:manager|proxy)\.onrender\.com|wss:\/\/helixbox-proxy\.onrender\.com/, path);
  }
  const manager = readFileSync(new URL('../manager/src/index.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(manager, /process\.env\.(?:PROXIES|PROXY_URL)\s*\|\|\s*["']https:\/\/helixbox-proxy\.onrender\.com/);
  const cli = readFileSync(new URL('../cli/src/index.ts', import.meta.url), 'utf8');
  assert.match(cli, /helixbox-stellar["'], ["']config\.json/);
});
