import React from 'react';
import '../styles/Scoreboard.css'; // Optional styling

const Scoreboard = ({ players }) => {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="scoreboard">
      <h3>Leaderboard</h3>
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