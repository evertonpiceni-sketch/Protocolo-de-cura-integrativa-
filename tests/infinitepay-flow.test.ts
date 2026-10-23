import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import { paymentQuote, PAYMENT_PLANS } from '../src/lib/paymentCatalog';
import { INFINITEPAY_API, normalizeInfiniteTag } from '../src/lib/infinitePayConfig';

test('approved protocol prices, coupons and InfiniteTag normalization', () => {
  assert.equal(paymentQuote('jornada_7d').cents,5990); assert.equal(paymentQuote('jornada_21d').cents,9990);
  for (const [plan, data] of Object.entries(PAYMENT_PLANS)) for (const [coupon, discount] of [['PROMO15',.85],['PROMO20',.8]] as const) assert.equal(paymentQuote(plan,coupon).cents,Math.round(data.cents*discount));
  assert.equal(normalizeInfiniteTag(' $evertonterapeutareiki '),'evertonterapeutareiki'); assert.throws(()=>normalizeInfiniteTag('https://other.example')); assert.throws(()=>paymentQuote('__proto__')); assert.throws(()=>paymentQuote('mensal','VIP7'));
});
test('real login, both API entries, authoritative prices, server verification and access release', async () => {
  const cwd=process.cwd(), folder=fs.mkdtempSync(path.join(os.tmpdir(),'protocol-payments-')); process.chdir(folder);
  process.env.NODE_ENV='test';process.env.VERCEL='1';process.env.JWT_SECRET='fixture-secret-with-at-least-32-characters';
  process.env.INFINITEPAY_HANDLE=' $evertonterapeutareiki ';process.env.INFINITEPAY_API_KEY='unused-fixture-key';
  for(const name of Object.keys(process.env))if(/UPSTASH|KV_REST/.test(name))delete process.env[name];
  const nativeFetch=globalThis.fetch;const calls:any[]=[];let paid=false,amount=4792,providerError=false;
  globalThis.fetch=(async (input:any, options:any)=>{
    if(String(input).startsWith(INFINITEPAY_API)){
      const body=JSON.parse(options.body);calls.push({url:String(input),body,headers:options.headers});
      if(providerError)return Response.json({message:'Conta não cadastrada'},{status:400});
      return Response.json(String(input).endsWith('/links')?{url:'https://checkout.infinitepay.io/evertonterapeutareiki?fixture=1'}:{success:true,paid,amount,capture_method:'pix'});
    }
    return nativeFetch(input,options);
  }) as typeof fetch;
  const {initializeDb,getDb,saveDb}=await import('../src/db');await initializeDb();
  const {createApp}=await import('../server'); const app=createApp();const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
  const a=server.address() as any;const base=`http://127.0.0.1:${a.port}`;
  async function call(route:string,body?:any,cookie?:string,method=body?'POST':'GET') {return nativeFetch(base+route,{method,headers:{'content-type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});}
  const account=async(login:string)=>{const r=await call('/api/auth/register',{login,password:'fixture-password',email:`${login}@example.test`});assert.equal(r.status,200);return r.headers.get('set-cookie')!.split(';')[0];};
  try{
    assert.equal((await call('/api/payment/create-checkout',{})).status,401);
    const owner=await account('owner-test'),other=await account('other-test');
    const logged=await call('/api/auth/login',{login:'owner-test',password:'fixture-password'});assert.equal(logged.status,200);const cookie=logged.headers.get('set-cookie')!.split(';')[0];assert.equal((await call('/api/auth/me',undefined,cookie)).status,200);
    const checkout=await call('/api/payment/create-checkout',{productType:'subscription',planId:'jornada_7d',couponCode:'PROMO20',price:.01},cookie);assert.equal(checkout.status,200);const order=await checkout.json();
    assert.equal(calls[0].url,INFINITEPAY_API+'/links');assert.equal(calls[0].body.handle,'evertonterapeutareiki');assert.equal(calls[0].body.items[0].price,4792);assert.equal(calls[0].headers['X-Api-Key'],undefined);
    assert.equal(getDb().users[0].plan,'free');
    const confirmation={order_nsu:order.orderId,transaction_nsu:'txn-one',slug:'invoice-one'};
    assert.equal((await call('/api/payment/confirm',confirmation,other)).status,404);
    assert.equal((await call('/api/payment/confirm',confirmation,cookie)).status,202);paid=true;amount=1;
    assert.equal((await call('/api/webhooks/infinitepay',confirmation)).status,400);assert.equal(getDb().users[0].plan,'free');amount=4792;
    assert.equal((await call('/api/webhooks/infinitepay',confirmation)).status,200);assert.equal(getDb().users[0].profile.subscriptionPlan,'jornada_7d');
    const expires=getDb().users[0].profile.subscriptionExpiresAt;assert.equal((await call('/api/payment/confirm',confirmation,cookie)).status,200);assert.equal(getDb().users[0].profile.subscriptionExpiresAt,expires);
    const individual=await call('/api/payment/create-checkout',{productType:'specific_treatment',durationDays:21,category:'outro',patientDescription:'Conteúdo privado sintético.',urgentPains:[],couponCode:'PROMO15',price:0},cookie);assert.equal(individual.status,200);const practice=await individual.json();assert.equal(calls.at(-1).body.items[0].price,8492);assert.equal(JSON.stringify(calls.at(-1).body).includes('Conteúdo privado'),false);
    amount=8492;const practiceConfirm={order_nsu:practice.orderId,transaction_nsu:'txn-practice',invoice_slug:'practice'};assert.equal((await call('/api/webhooks/payment',practiceConfirm)).status,200);assert.equal(getDb().users[0].profile.specificTreatments.length,1);assert.equal(getDb().users[0].profile.specificTreatments[0].paymentMethod,'pix');
    assert.equal((await call('/api/webhooks/payment',practiceConfirm)).status,200);assert.equal(getDb().users[0].profile.specificTreatments.length,1);
    assert.equal((await call('/api/payment/create-checkout',{productType:'specific_treatment',durationDays:7,category:'outro',patientDescription:'Teste',urgentPains:[],customAmount:1},cookie)).status,400);
    assert.equal((await call('/api/user/sync',{profile:{plan:'free',subscriptionPrice:0,subscriptionPaymentMethod:'trial',paymentOrders:[{status:'paid'}]}},cookie)).status,200);assert.equal(getDb().users[0].plan,'pro');assert.equal(getDb().users[0].profile.paymentOrders,undefined);assert.equal(getDb().users[0].profile.subscriptionPrice,47.92);assert.equal(getDb().users[0].profile.subscriptionPaymentMethod,'pix');
    const trial={planId:'teste_vip_7d',paymentMethod:'trial',price:0,couponCode:'VIP7'};const before=calls.length;assert.equal((await call('/api/user/upgrade',trial,other)).status,200);assert.equal(calls.length,before);assert.equal((await call('/api/user/upgrade',trial,other)).status,409);
    getDb().users[1].profile.subscriptionExpiresAt='2020-01-01T00:00:00.000Z';await saveDb();const expired=await (await call('/api/auth/me',undefined,other)).json();assert.equal(expired.user.plan,'free');
    providerError=true;const rejected=await call('/api/payment/create-checkout',{productType:'subscription',planId:'mensal'},owner);assert.equal(rejected.status,503);assert.equal((await rejected.json()).code,'INFINITEPAY_ACCOUNT_NOT_FOUND');providerError=false;
    const retryBody={productType:'subscription',planId:'mensal'};
    const retry=await call('/api/payment/create-checkout',retryBody,owner);assert.equal(retry.status,200);const retryOrder=await retry.json();const upstreamCount=calls.length;
    const reused=await call('/api/payment/create-checkout',retryBody,owner);assert.equal((await reused.json()).orderId,retryOrder.orderId);assert.equal(calls.length,upstreamCount);
    getDb().paymentOrders!.find(o=>o.id===retryOrder.orderId)!.expiresAt='2020-01-01T00:00:00.000Z';await saveDb();
    const expiredOrder=await (await call('/api/payment/orders/'+retryOrder.orderId,undefined,owner)).json();assert.equal(expiredOrder.status,'expired');
    const renewed=await (await call('/api/payment/create-checkout',retryBody,owner)).json();assert.notEqual(renewed.orderId,retryOrder.orderId);
    let limited:Response;for(let i=0;i<8;i++)limited=await call('/api/payment/create-checkout',retryBody,owner);assert.equal(limited!.status,429);
    const {default:handler}=await import('../api/[...path]'); const express=(await import('express')).default;const edge=express();edge.use(express.json());edge.use(handler);const edgeServer=edge.listen(0,'127.0.0.1');await new Promise<void>(r=>edgeServer.once('listening',r));
    try{const ea=edgeServer.address() as any;const r=await nativeFetch(`http://127.0.0.1:${ea.port}/api/payment/create-checkout`,{method:'POST',headers:{'content-type':'application/json',cookie},body:JSON.stringify({productType:'subscription',planId:'jornada_21d'})});assert.equal(r.status,200);assert.equal(calls.at(-1).body.items[0].price,9990);}finally{await new Promise<void>(r=>edgeServer.close(()=>r()));}
  }finally{await new Promise<void>(r=>server.close(()=>r()));globalThis.fetch=nativeFetch;process.chdir(cwd);fs.rmSync(folder,{recursive:true,force:true});}
});
