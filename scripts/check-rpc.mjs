const rpc = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
async function call(method) {
  const response = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: [] }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  if (typeof data.result !== 'string' || !/^0x[0-9a-f]+$/i.test(data.result)) throw new Error(`Invalid ${method} result`);
  return data.result;
}
try {
  const chainId = Number(BigInt(await call('eth_chainId')));
  if (chainId !== 10143) throw new Error(`Expected Monad Testnet (10143), received ${chainId}`);
  const block = BigInt(await call('eth_blockNumber'));
  console.log(`Monad Testnet confirmed | chainId=${chainId} | latestBlock=${block}`);
} catch (error) {
  console.error(`RPC check failed: ${error.message}`);
  process.exitCode = 1;
}
