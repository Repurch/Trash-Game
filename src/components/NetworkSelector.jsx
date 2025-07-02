import { useConnectionConfig } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';

function NetworkSelector() {
  const { endpoint, setEndpoint } = useConnectionConfig();
  
  return (
    <select 
      value={endpoint} 
      onChange={(e) => setEndpoint(e.target.value)}
    >
      <option value={clusterApiUrl('mainnet-beta')}>Mainnet</option>
      <option value={clusterApiUrl('devnet')}>Devnet</option>
      <option value={clusterApiUrl('testnet')}>Testnet</option>
    </select>
  );
}