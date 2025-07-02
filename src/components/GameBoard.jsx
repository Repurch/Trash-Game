import { useState, useEffect } from 'react';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants';
import { useWallet } from '@solana/wallet-adapter-react';

const GameBoard = ({ player, onBlockClear }) => {
  const { publicKey } = useWallet();
  const [grid, setGrid] = useState(player.grid);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial game state from backend
  useEffect(() => {
    const fetchGameState = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(
          'https://b8c5-105-112-76-82.ngrok-free.app/api/game-state',
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        setGrid(data.grid);
      } catch (error) {
        console.error('Failed to fetch game state:', error);
      }
    };
    fetchGameState();
  }, []);

  // Handle player moves (send to backend)
  const sendMove = async (moveType) => {
    if (!publicKey || isLoading) return;
    setIsLoading(true);

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(
        'https://b8c5-105-112-76-82.ngrok-free.app/api/move',
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerId: publicKey.toBase58(),
            move: moveType, // 'left', 'right', 'drop', 'rotate'
          }),
        }
      );
      const { grid: updatedGrid, linesCleared } = await response.json();
      setGrid(updatedGrid);
      if (linesCleared > 0) onBlockClear(linesCleared);
    } catch (error) {
      console.error('Move failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading) return;
      switch (e.key) {
        case 'ArrowLeft':  sendMove('left'); break;
        case 'ArrowRight': sendMove('right'); break;
        case 'ArrowDown':  sendMove('drop'); break;
        case ' ':          sendMove('hardDrop'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]);

  return (
    <div className="game-grid">
      {grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <div 
              key={`${x}-${y}`}
              className={`grid-cell ${cell ? 'block-filled' : ''}`}
              style={{ backgroundColor: cell ? `hsl(${cell * 60}, 100%, 50%)` : '' }}
            />
          ))}
        </div>
      ))}
      {isLoading && <div className="loading-overlay">Processing...</div>}
    </div>
  );
};

export default GameBoard;