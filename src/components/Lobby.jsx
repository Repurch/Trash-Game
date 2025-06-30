import { useState } from 'react';
import '../styles/Lobby.css'; // Now correctly pointing to styles folder

 const Lobby = ({ onJoinRoom }) => {
  const [roomCode, setRoomCode] = useState('');

  const handleCreateGame = () => {
    const newRoomCode = Math.floor(1000 + Math.random() * 9000).toString();
    onJoinRoom(newRoomCode);
  };

  const handleJoinGame = () => {
    if (roomCode.length === 4) {
      onJoinRoom(roomCode);
    } else {
      alert('Please enter a 4-digit room code');
    }
  };

  return (
    <div className="lobby-container">
      <h2>Trash Clash Lobby</h2>
      
      <div className="lobby-actions">
        <button onClick={handleCreateGame} className="lobby-button">
          Create New Game
        </button>
        
        <div className="join-section">
          <input
            type="text"
            placeholder="Enter Room Code"
            maxLength="4"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, ''))}
          />
          <button onClick={handleJoinGame} className="lobby-button">
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;