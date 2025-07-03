import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletConnector } from './components/WalletConnector';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import PowerUpShop from './components/PowerUpShop';
import { mockPlayers } from './constants';
import { GameProvider } from './contexts/GameContext.';
import './styles/Game.css';
import './styles/Lobby.css';
import './styles/Scoreboard.css';

export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <WalletConnector />
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/game" element={<GameScreen />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

function GameScreen() {
  return (
    <div className="game-container">
      <Scoreboard players={mockPlayers} />
      <GameBoard 
        player={mockPlayers[0]} 
        onBlockClear={(lines) => console.log('Lines cleared:', lines)} 
      />
      <PowerUpShop 
        tokens={mockPlayers[0].tokens}
        powerUps={[
          { id: 'clear-row', name: 'Clear Row', cost: 10 },
          { id: 'clear-col', name: 'Clear Column', cost: 15 },
        ]}
        onPurchase={(id) => console.log('Purchased:', id)}
      />
    </div>
  );
}