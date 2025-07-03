import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Lobby.css';

const Lobby = ({ onJoinRoom = () => console.warn('onJoinRoom callback not provided') }) => {
  const [roomCode, setRoomCode] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateGame = () => {
    const newRoomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCreatedRoomCode(newRoomCode);
    console.log("Generated Room Code:", newRoomCode);
    
    try {
      if (typeof onJoinRoom === 'function') {
        onJoinRoom(newRoomCode);
      } else {
        console.error('onJoinRoom is not a function');
      }
    } catch (error) {
      console.error('Error in handleCreateGame:', error);
      alert('Failed to create game room');
    }
  };

  const handleJoinGame = () => {
    if (roomCode.length !== 4) {
      alert('Please enter a valid 4-digit code');
      return;
    }

    setIsJoining(true);
    try {
      if (typeof onJoinRoom === 'function') {
        onJoinRoom(roomCode);
      } else {
        console.error('onJoinRoom is not a function');
      }
    } catch (error) {
      console.error('Error in handleJoinGame:', error);
      alert('Failed to join game room');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="lobby-container">
      <h2>Trash Clash Lobby</h2>

      {createdRoomCode && (
        <div className="room-code-display">
          <h3>Your Room Code:</h3>
          <div className="code" data-testid="room-code">{createdRoomCode}</div>
          <p>Share this with other players!</p>
        </div>
      )}

      <div className="lobby-actions">
        <button 
          onClick={handleCreateGame} 
          className="lobby-button"
          disabled={isJoining}
        >
          Create New Game
        </button>

        <div className="join-section">
          <input
            type="text"
            placeholder="Enter 4-digit code"
            maxLength="4"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, ''))}
            disabled={isJoining}
          />
          <button 
            onClick={handleJoinGame} 
            className="lobby-button"
            disabled={isJoining || roomCode.length !== 4}
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </button>
        </div>
      </div>
    </div>
  );
};

Lobby.propTypes = {
  onJoinRoom: PropTypes.func
};

export default Lobby;