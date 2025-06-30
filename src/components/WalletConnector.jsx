import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';


export const WalletConnector = () => {  // Add 'export' here
  const { connected, publicKey } = useWallet();

  return (
    <div className="wallet-connector">
      <WalletMultiButton className="wallet-button">
        {connected 
          ? `Connected: ${publicKey.toBase58().slice(0,4)}...${publicKey.toBase58().slice(-4)}`
          : 'Connect Wallet'}
      </WalletMultiButton>
    </div>
  );
};
