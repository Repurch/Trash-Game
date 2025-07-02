import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnector = () => {
  const { connected, publicKey, signMessage } = useWallet();

  const authenticateWithBackend = async () => {
    if (!publicKey || !signMessage) return;

    try {
      // 1. Get a nonce from backend
      const nonceResponse = await fetch(
        'https://b8c5-105-112-76-82.ngrok-free.app/api/auth/nonce',
        { method: 'POST', body: JSON.stringify({ address: publicKey.toBase58() }) }
      );
      const { nonce } = await nonceResponse.json();

      // 2. Sign the nonce
      const message = new TextEncoder().encode(`Auth nonce: ${nonce}`);
      const signature = await signMessage(message);

      // 3. Verify with backend
      const authResponse = await fetch(
        'https://b8c5-105-112-76-82.ngrok-free.app/api/auth/verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: publicKey.toBase58(),
            signature: Array.from(signature), // Convert Uint8Array to array
            nonce,
          }),
        }
      );
      const { token } = await authResponse.json();
      localStorage.setItem('authToken', token); // Store for future requests
    } catch (error) {
      console.error('Auth failed:', error);
    }
  };

  useEffect(() => {
    if (connected) authenticateWithBackend();
  }, [connected]);

  return (
    <div className="wallet-connector">
      <WalletMultiButton />
    </div>
  );
};