import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

const PowerUpShop = ({ player, onPowerUp }) => {
  const { publicKey } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const powerUps = [
    { name: "Clear Row", cost: 5, action: "clear" },
    { name: "Send Garbage", cost: 10, action: "sabotage" },
    { name: "Speed Boost", cost: 3, action: "speed" },
  ];

  const handlePowerUp = async (action) => {
    if (!publicKey || isProcessing) return;
    setIsProcessing(true);

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(
        'https://b8c5-105-112-76-82.ngrok-free.app/api/use-powerup',
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerId: publicKey.toBase58(),
            powerUp: action,
          }),
        }
      );
      const { success, newTokens } = await response.json();
      if (success) {
        onPowerUp(action, newTokens); // Update UI
      }
    } catch (error) {
      console.error('Power-up failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="power-up-shop">
      <h3>Power-Ups ($TRASH: {player.tokens})</h3>
      {powerUps.map((p) => (
        <button
          key={p.action}
          disabled={player.tokens < p.cost || isProcessing}
          onClick={() => handlePowerUp(p.action)}
          className={isProcessing ? 'processing' : ''}
        >
          {p.name} ({p.cost} $TRASH)
          {isProcessing && <span className="spinner"></span>}
        </button>
      ))}
    </div>
  );
};

export default PowerUpShop;