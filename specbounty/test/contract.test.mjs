import {test} from 'node:test';import assert from 'node:assert/strict';import ganache from 'ganache';import {createPublicClient,createWalletClient,custom,keccak256,toHex,parseEther} from 'viem';import {compile} from '../scripts/compile.mjs';
test('escrow: authorization, spec binding, single payouts, rejection and expiry',async()=>{
 const provider=ganache.provider({logging:{quiet:true},chain:{hardfork:'shanghai'}});const addresses=await provider.request({method:'eth_accounts',params:[]});const publicClient=createPublicClient({transport:custom(provider)});const clients=addresses.slice(0,3).map(account=>createWalletClient({account,transport:custom(provider)}));const c=compile();const hash=await clients[0].deployContract({abi:c.abi,bytecode:c.bytecode,chain:null,gas:6000000n});const receipt=await publicClient.waitForTransactionReceipt({hash});const address=receipt.contractAddress;
 const h=s=>keccak256(toHex(s));const id=h('task1'),v1=h('v1'),v2=h('v2');const bounty=parseEther('0.01'),reward=parseEther('0.02');
 async function tx(i,functionName,args,value){const hash=await clients[i].writeContract({address,abi:c.abi,functionName,args,value,chain:null,gas:1000000n});const r=await publicClient.waitForTransactionReceipt({hash});assert.equal(r.status,'success');}
 async function fails(i,functionName,args,value){await assert.rejects(()=>publicClient.simulateContract({address,abi:c.abi,functionName,args,value,account:addresses[i]}));}
 const read=(functionName,args)=>publicClient.readContract({address,abi:c.abi,functionName,args});const now=Number((await publicClient.getBlock()).timestamp);
 await fails(0,'create',[id,v1,bounty,reward,now+3600],1n);
 await tx(0,'create',[id,v1,bounty,reward,now+3600],bounty+reward);
 await fails(0,'create',[id,v1,bounty,reward,now+3600],bounty+reward);
 await fails(0,'submitCounterexample',[id,h('e')]);await fails(0,'freeze',[id,v2]);
 await tx(1,'submitCounterexample',[id,h('bad')]);await fails(2,'approveCounterexample',[id]);await tx(0,'rejectCounterexample',[id]);
 await tx(1,'submitCounterexample',[id,h('e')]);await tx(0,'approveCounterexample',[id]);assert.equal(await read('credit',[addresses[1]]),bounty);
 await fails(0,'approveCounterexample',[id]);await fails(0,'freeze',[id,v1]);await tx(0,'freeze',[id,v2]);await fails(2,'submitDelivery',[id,v1,h('d')]);
 await tx(2,'submitDelivery',[id,v2,h('bad-delivery')]);await tx(0,'rejectDelivery',[id]);await tx(2,'submitDelivery',[id,v2,h('d')]);await tx(0,'approveDelivery',[id]);assert.equal(await read('credit',[addresses[2]]),reward);await fails(0,'approveDelivery',[id]);
 await tx(1,'withdraw',[]);await tx(2,'withdraw',[]);assert.equal(await read('credit',[addresses[1]]),0n);await fails(1,'withdraw',[]);
 const id2=h('expiry');await tx(0,'create',[id2,v1,bounty,reward,now+60],bounty+reward);await fails(1,'expire',[id2]);await provider.request({method:'evm_increaseTime',params:[4000]});await provider.request({method:'evm_mine',params:[]});await fails(1,'submitCounterexample',[id2,h('e')]);await tx(1,'expire',[id2]);assert.equal(await read('credit',[addresses[0]]),bounty+reward);await tx(0,'withdraw',[]);
 assert.equal(await publicClient.getBalance({address}),0n);await provider.disconnect();
});
