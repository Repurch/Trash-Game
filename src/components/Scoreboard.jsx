import React from 'react';
import '../styles/Scoreboard.css';
import { useNavigate } from 'react-router-dom'; // If using React Router


const Scoreboard = ({ players }) => {
  // Option 1: For React Router
  const navigate = useNavigate();
  const goHome = () => navigate('/');
  
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h3>Leaderboard</h3>
        <button 
          onClick={goHome}
          className="home-button"
        >
          🏠 Return to Lobby
        </button>
      </div>

      <div className="player-list">
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="player-row">
            <span className="player-rank">{index + 1}.</span>
            <span className="player-id">{player.id}</span>
            <span className="player-score">{player.score} pts</span>
            <span className="player-tokens">{player.tokens} $TRASH</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;