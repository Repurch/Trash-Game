import { useState } from 'react';
import {WalletConnector} from './components/WalletConnector';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import PowerUpShop from './components/PowerUpShop';
import { mockPlayers } from './constants';

export default function App() {
  // State declarations
  const [gameState, setGameState] = useState("LOBBY");
  const [players, setPlayers] = useState([]);

  const startGame = (roomCode) => {
    setPlayers(mockPlayers);
    setGameState("GAME");
  };

  return (
    <div className="app">
      <WalletConnector />
      {gameState === "LOBBY" ? (
        <Lobby onJoinRoom={startGame} />
      ) : (
        <div className="game-container">
          <Scoreboard players={players} />
          <GameBoard 
            player={players[0]} 
            onBlockClear={(lines) => {
              // TODO: Backend will update score/tokens
            }} 
          />
          <PowerUpShop 
            player={players[0]} 
            onPowerUp={(type) => {
              // TODO: Backend will handle token spending
            }}
          />
        </div>
      )}
    </div>
  );
}