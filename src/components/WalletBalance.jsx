import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export default function WalletBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(balance => {
        setBalance(balance / 1000000000); // Convert lamports to SOL
      });
    }
  }, [publicKey, connection]);

  return (
    <div className="balance">
      {balance !== null && (
        <p>Balance: {balance.toFixed(2)} SOL</p>
      )}
    </div>
  );
}