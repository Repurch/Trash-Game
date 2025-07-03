import { useState, useEffect, useCallback } from 'react';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants';
import { useWallet } from '@solana/wallet-adapter-react';

const createEmptyGrid = () => 
  Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));

const GameBoard = ({ player = { grid: createEmptyGrid() }, onBlockClear }) => {
  const { publicKey } = useWallet();
  const [grid, setGrid] = useState(player.grid);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset grid when player prop changes (e.g., new game)
  useEffect(() => {
    setGrid(player?.grid || createEmptyGrid());
  }, [player?.grid]);

  // Fetch game state from backend
  const fetchGameState = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://b8c5-105-112-76-82.ngrok-free.app/api/game-state', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log("API Data:", data); // Debug log
      setGrid(data?.grid || createEmptyGrid());
    } catch (err) {
      setError("Failed to load game state");
      setGrid(createEmptyGrid());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle "New Game" click
  const handleNewGame = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://b8c5-105-112-76-82.ngrok-free.app/api/new-game', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: publicKey?.toBase58() }),
      });
      const data = await response.json();
      setGrid(data?.grid || createEmptyGrid());
    } catch (err) {
      setError("Failed to start new game");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  return (
    <div className="game-grid">
      {grid.map((row, y) => (
        <div key={`row-${y}`} className="grid-row">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`grid-cell ${cell ? 'block-filled' : ''}`}
              style={{ backgroundColor: cell ? `hsl(${cell * 60}, 100%, 50%)` : '' }}
            />
          ))}
        </div>
      ))}
      {isLoading && <div className="loading-overlay">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleNewGame} disabled={isLoading}>
        New Game
      </button>
    </div>
  );
};

export default GameBoard;