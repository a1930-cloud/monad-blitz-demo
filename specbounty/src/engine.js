export const brief = '清洗订单：按订单编号去重，保留首次出现的记录，统计去重后的订单数和金额。金额单位为分，仅接受非负安全整数。';
export const specs = {
 v1: { version: 1, checks: ['输出包含 orders 和 totalCents','orders 是数组','totalCents 等于输出订单金额之和'] },
 v2: { version: 2, checks: ['订单编号唯一','按输入顺序保留首次出现记录','输出不丢失、不新增订单','金额为非负安全整数','totalCents 等于去重后金额之和'] }
};
export const seed = [ {id:'ORD-101',item:'机械键盘',cents:12900}, {id:'ORD-102',item:'桌面支架',cents:7900}, {id:'ORD-101',item:'机械键盘',cents:12900}, {id:'ORD-103',item:'编织线缆',cents:3900} ];
export function validateInput(rows){if(!Array.isArray(rows)||!rows.length||rows.length>100)throw Error('请输入 1–100 条订单');for(const r of rows)if(!r||typeof r.id!=='string'||!r.id.trim()||!Number.isSafeInteger(r.cents)||r.cents<0)throw Error('每条订单需要非空 id 和非负整数 cents');if(!Number.isSafeInteger(rows.reduce((s,r)=>s+r.cents,0)))throw Error('金额超出安全整数范围');return rows;}
export function execute(rows,dedupe){validateInput(rows);const seen=new Set();const orders=rows.filter(r=>{if(dedupe&&seen.has(r.id))return false;seen.add(r.id);return true;}).map(r=>({...r}));return {orders,totalCents:orders.reduce((s,r)=>s+r.cents,0)};}
export function evaluate(output,rows,version){
 const shape=output&&Array.isArray(output.orders)&&Number.isSafeInteger(output.totalCents)&&output.orders.every(r=>r&&typeof r.id==='string'&&Number.isSafeInteger(r.cents)&&r.cents>=0);
 const sum=shape&&output.totalCents===output.orders.reduce((s,r)=>s+r.cents,0);
 const basic=[{name:'输出结构正确',ok:!!shape},{name:'金额与输出一致',ok:!!sum}];
 if(version===1)return basic;
 const expected=execute(rows,true);
 return [...basic,{name:'订单编号唯一',ok:!!shape&&new Set(output.orders.map(r=>r.id)).size===output.orders.length},{name:'完整保留首次订单及原始金额',ok:!!shape&&JSON.stringify(output.orders)===JSON.stringify(expected.orders)},{name:'总额符合需求',ok:output?.totalCents===expected.totalCents}];
}
// Bounded deterministic probe, not an LLM. Produces a reproducible counterexample from supplied data.
export function probe(rows){validateInput(rows);const copy=rows.map(r=>({...r}));if(new Set(copy.map(r=>r.id)).size===copy.length)copy.splice(1,0,{...copy[0]});const output=execute(copy,false);const old=evaluate(output,copy,1);const repaired=evaluate(output,copy,2);return {input:copy,output,old,repaired,valid:old.every(t=>t.ok)&&repaired.some(t=>!t.ok),strategy:'duplicate-order-id',description:'重复订单仍通过旧规格，违反按订单编号去重的需求'};}
export function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';return JSON.stringify(value);}
