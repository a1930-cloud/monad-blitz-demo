import {execFile} from 'node:child_process';import{promisify}from'node:util';import{readFileSync,writeFileSync}from'node:fs';import{createPublicClient,http,encodeFunctionData,keccak256,toHex,parseEther,formatEther}from'viem';import{brief,specs,seed,probe,execute,canonical}from'../src/engine.js';
const run=promisify(execFile),client=createPublicClient({transport:http('https://testnet-rpc.monad.xyz',{timeout:20000,retryCount:2})}),deployment=JSON.parse(readFileSync('public/deployment.json')),abi=JSON.parse(readFileSync('src/abi.json'));const address=deployment.address;
const hash=x=>keccak256(toHex(canonical(x)));const id=keccak256(toHex('SpecBounty-Guangzhou-2026-11-21-first-e2e'));let record={chainId:10143,address,taskId:id,controller:deployment.controller,roleModel:'Customer is the Alchemy session EOA. Hunter and worker share a test recipient contract controlled by that same EOA. This is a real onchain integration test, not independent autonomous agents.',transactions:[]};
try{const old=JSON.parse(readFileSync('public/evidence.json'));if(old.taskId===id)record=old;}catch{}
function save(){writeFileSync('public/evidence.json',JSON.stringify(record,null,2));}
async function tx(label,target,signature,args,value){const existing=record.transactions.find(t=>t.label===label);if(existing){console.log('Already recorded:',label);return existing;}
 const argv=['evm','contract','call',target,signature,'--args',JSON.stringify(args),'-n','monad-testnet'];if(value)argv.push('--value',value);
 const {stdout,stderr}=await run('alchemy',argv,{maxBuffer:1024*1024,timeout:90000});let data;try{data=JSON.parse(stdout)}catch{throw Error(stderr||stdout)}if(data.error||!data.txHash)throw Error(JSON.stringify(data));
 const receipt=await client.waitForTransactionReceipt({hash:data.txHash,confirmations:3,timeout:90000});if(receipt.status!=='success')throw Error('Reverted '+data.txHash);
 const r={label,hash:data.txHash,blockNumber:String(receipt.blockNumber),status:receipt.status};record.transactions.push(r);save();console.log(label,data.txHash);return r;
}
if(!record.recipient){const recipientResult=JSON.parse(readFileSync('/tmp/specbounty-recipient-result.json'));const receipt=await client.waitForTransactionReceipt({hash:recipientResult.txHash,confirmations:3});const log=receipt.logs.find(x=>x.address.toLowerCase()==='0xba5ed099633d3b313e4d5f7bdc1305d3c28ba5ed');record.recipient='0x'+log.topics[1].slice(-40);save();}const recipient=record.recipient;console.log('Recipient test harness',recipient);
const read=()=>client.readContract({address,abi,functionName:'tasks',args:[id]});
const counterexample=probe(seed),v1=hash({brief,spec:specs.v1,input:seed}),v2=hash({brief,spec:specs.v2,input:seed}),evidence=hash(counterexample),delivery=hash(execute(seed,true));record.materials={v1,v2,evidence,delivery};save();
let t=await read();if(t[0]==='0x0000000000000000000000000000000000000000')await tx('create',address,'create(bytes32,bytes32,uint256,uint256,uint64)',[id,v1,String(parseEther('0.001')),String(parseEther('0.003')),Number((await client.getBlock()).timestamp)+86400],'0.004');
async function relay(label,functionName,args){const data=encodeFunctionData({abi,functionName,args});return tx(label,recipient,'relay(address,bytes)',[address,data]);}
t=await read();if(Number(t[9])===0&&t[1]==='0x0000000000000000000000000000000000000000')await relay('submitCounterexample','submitCounterexample',[id,evidence]);
t=await read();if(Number(t[9])===0)await tx('approveCounterexample',address,'approveCounterexample(bytes32)',[id]);
t=await read();if(Number(t[9])===1)await tx('freeze',address,'freeze(bytes32,bytes32)',[id,v2]);
t=await read();if(Number(t[9])===2)await relay('submitDelivery','submitDelivery',[id,v2,delivery]);
t=await read();if(Number(t[9])===3)await tx('approveDelivery',address,'approveDelivery(bytes32)',[id]);
const credit=await client.readContract({address,abi,functionName:'credit',args:[recipient]});if(credit>0n)await relay('withdraw','withdraw',[]);
t=await read();const recipientBalance=await client.getBalance({address:recipient});const remainingCredit=await client.readContract({address,abi,functionName:'credit',args:[recipient]});if(Number(t[9])!==4||recipientBalance!==parseEther('0.004')||remainingCredit!==0n)throw Error('Settlement invariant failed');record.result={phase:'Complete',recipientReceivedMON:formatEther(recipientBalance),remainingCredit:String(remainingCredit),verifiedAt:new Date().toISOString()};save();console.log('PASS',JSON.stringify(record.result));
