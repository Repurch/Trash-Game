import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import App from './App';

const endpoint = 'https://rpc.gorbagana.wtf';

const wallets = [
  new BackpackWalletAdapter()
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect onError={(error) => {
        console.error('Wallet error:', error);
      }}>
        <WalletProvider wallets={wallets} autoConnect storageKey="walletAutoConnect"></WalletProvider>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>
);

