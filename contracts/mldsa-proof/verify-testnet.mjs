import { generateKeyPairSync, sign, verify } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const [contractId, sourceAddress] = process.argv.slice(2);
if (!/^C[A-Z2-7]{55}$/.test(contractId ?? '') || !/^G[A-Z2-7]{55}$/.test(sourceAddress ?? '')) {
  throw new Error('Usage: node verify-testnet.mjs <testnet-contract-id> <testnet-source-address>');
}

const cli = fileURLToPath(new URL('../../.local-tools/stellar/stellar.exe', import.meta.url));
const { publicKey, privateKey } = generateKeyPairSync('ml-dsa-44');
const message = Buffer.from('HelixBox ML-DSA testnet feasibility proof');
const context = Buffer.from('helixbox');
const signature = sign(null, message, { key: privateKey, context });
if (!verify(null, message, { key: publicKey, context }, signature)) throw new Error('Local signature verification failed');
const key = publicKey.export({ format: 'raw-public' });
const run = (body) => spawnSync(cli, [
  'contract', 'invoke', '--contract-id', contractId, '--source-account', sourceAddress,
  '--network', 'testnet', '--send', 'no', '--cost', '--', 'verify',
  '--public_key', key.toString('hex'), '--message', body.toString('hex'),
  '--signature', signature.toString('hex'), '--context', context.toString('hex'),
], { encoding: 'utf8', timeout: 120000 });

const valid = run(message);
if (valid.error || valid.status !== 0 || valid.stdout.trim() !== 'true') {
  throw new Error(`Valid signature failed: ${valid.error ?? valid.stderr}`);
}
console.log('Valid signature accepted on testnet.');
const require = createRequire(new URL('../../manager/package.json', import.meta.url));
const { BASE_FEE, Contract, Networks, rpc, TransactionBuilder, xdr } = require('@stellar/stellar-sdk');
const server = new rpc.Server('https://soroban-testnet.stellar.org');
const account = await server.getAccount(sourceAddress);
const bytes = (value) => xdr.ScVal.scvBytes(value);
const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
  .addOperation(new Contract(contractId).call('verify', bytes(key), bytes(message), bytes(signature), bytes(context)))
  .setTimeout(60).build();
const simulation = await server.simulateTransaction(tx);
if (rpc.Api.isSimulationError(simulation)) throw new Error(`Resource simulation failed: ${simulation.error}`);
const resources = simulation.transactionData.build().resources();
console.log(`Simulated CPU instructions: ${resources.instructions()}`);
console.log(`Simulated disk read bytes: ${resources.diskReadBytes()}`);
console.log(`Simulated write bytes: ${resources.writeBytes()}`);
console.log(`Simulated minimum resource fee: ${simulation.minResourceFee} stroops`);

const invalid = run(Buffer.from('Modified message'));
if (invalid.error || invalid.status === 0 || !/crypto|invalid.?input/i.test(invalid.stderr)) {
  throw new Error(`Altered-message rejection was not confirmed: ${invalid.error ?? invalid.stderr}`);
}
console.log('Altered message rejected by the testnet verifier.');
