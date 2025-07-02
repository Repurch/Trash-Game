import { useState, useEffect } from 'react';

const GameBoard = ({ player, onBlockClear }) => {
  const [grid, setGrid] = useState(player.grid);

  // Mock movement controls
  const moveBlock = (xDir, yDir = 0) => {
    const newGrid = [...grid];
    // Simple mock movement - finds first empty cell
    for (let y = 0; y < newGrid.length; y++) {
      for (let x = 0; x < newGrid[y].length; x++) {
        if (newGrid[y][x] === 0) {
          newGrid[y][x] = 1; // Place mock block
          setGrid(newGrid);
          return;
        }
      }
    }
  };

  // Mock line clearing
  const checkLines = () => {
    let linesCleared = 0;
    const newGrid = [...grid];
    
    // Check bottom row only for demo purposes
    if (newGrid[newGrid.length-1].every(cell => cell === 1)) {
      newGrid[newGrid.length-1] = Array(10).fill(0);
      linesCleared = 1;
    }
    
    setGrid(newGrid);
    if (linesCleared > 0) onBlockClear(linesCleared);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') moveBlock(-1);
      if (e.key === 'ArrowRight') moveBlock(1);
      if (e.key === 'ArrowDown') moveBlock(0, 1);
      if (e.key === ' ') checkLines(); // Space to "clear" bottom row
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="game-grid">
      {grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <div 
              key={`${x}-${y}`}
              className={`grid-cell ${cell ? 'block-filled' : ''}`}
              style={{ 
                backgroundColor: cell ? `hsl(${y * 36}, 100%, 50%)` : 'transparent' 
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;