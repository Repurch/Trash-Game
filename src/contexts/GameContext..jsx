// Create src/contexts/GameContext.jsx
import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState("LOBBY");
  const [players, setPlayers] = useState([]);
  
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
  return useContext(GameContext);
}