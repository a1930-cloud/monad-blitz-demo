import solc from 'solc';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
export function compile(){
 const input={language:'Solidity',sources:{'SpecBounty.sol':{content:readFileSync(new URL('../contracts/SpecBounty.sol',import.meta.url),'utf8')}},settings:{optimizer:{enabled:true,runs:200},evmVersion:'paris',outputSelection:{'*':{'*':['abi','evm.bytecode','metadata']}}}};
 const result=JSON.parse(solc.compile(JSON.stringify(input)));
 const errors=result.errors?.filter(e=>e.severity==='error');if(errors?.length)throw Error(errors.map(e=>e.formattedMessage).join('\n'));
 const c=result.contracts['SpecBounty.sol'].SpecBounty;
 return {abi:c.abi,bytecode:'0x'+c.evm.bytecode.object,metadata:JSON.parse(c.metadata),input};
}
if(process.argv[1]===new URL(import.meta.url).pathname){const c=compile();mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/SpecBounty.json',JSON.stringify(c,null,2));writeFileSync('src/abi.json',JSON.stringify(c.abi));console.log('Compiled SpecBounty:',(c.bytecode.length-2)/2,'bytes');}
