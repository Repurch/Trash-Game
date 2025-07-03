import { createContext, useContext, useState } from 'react';
import { mockPlayers } from '../constants';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState("LOBBY");
  const [players, setPlayers] = useState(mockPlayers);
  
  const startGame = (roomCode) => {
    setPlayers(mockPlayers);
    setGameState("GAME");
  };

  return (
    <GameContext.Provider value={{ gameState, players, startGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}