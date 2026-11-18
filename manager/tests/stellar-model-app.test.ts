import {test, expect} from 'bun:test';
import {Database} from 'bun:sqlite';
import {createModelApp} from '../src/model-app.ts';
import {createStellarPaymentConfig} from '../src/stellar-payment-config.ts';

test('Stellar manager exposes catalog but refuses purchases until the integration is verified', async () => {
  let providerCalls = 0;
  const config = createStellarPaymentConfig({STELLAR_NETWORK:'stellar:pubnet',
    STELLAR_PAY_TO:'GBX7H2GRCWFPDUGCDGJXUEXE3MYPERWIF5LMFRKYI7Z7CKQH2M56ICOA', STELLAR_FACILITATOR_URL:'https://facilitator.example'});
  const app = createModelApp({db:new Database(':memory:'),apiKey:'fixture',dataKey:'fixture',config,enabled:true,durable:true,
    authenticate:()=> 'owner', fetcher:async()=>{providerCalls++; return Response.json({data:[{id:'lab/text',architecture:{output_modalities:['text']}}]});}});
  const catalog = await (await app.request('/v2/models')).json();
  expect(catalog.paymentsEnabled).toBe(false);
  expect(catalog.paymentMode).toBe('unavailable');
  const callsBefore = providerCalls;
  const response = await app.request('/v2/models/quotes',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  expect(response.status).toBe(503);
  expect(providerCalls).toBe(callsBefore);
  expect((await app.request('/v2/models/mandates',{method:'POST',body:'{}'})).status).toBe(404);
});
