import { useState, useEffect } from 'react';
import { GRID_WIDTH, GRID_HEIGHT } from '../constants';

 const GameBoard = ({ player, onBlockClear }) => {
  const [grid, setGrid] = useState(player.grid);

  // Handle keyboard inputs (backend will replace)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') moveBlock(-1);
      if (e.key === 'ArrowRight') moveBlock(1);
      if (e.key === 'ArrowDown') moveBlock(0, 1);
      if (e.key === ' ') hardDrop();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mock movement (backend will implement)
  const moveBlock = (x, y = 0) => {
    const newGrid = [...grid];
    // TODO: Replace with real logic
    setGrid(newGrid);
  };

  // Mock line clearing (backend will implement)
  const checkLines = () => {
    let linesCleared = 0;
    // TODO: Replace with real logic
    if (linesCleared > 0) onBlockClear(linesCleared);
  };

  return (
    <div className="game-grid">
      {grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`grid-cell ${cell ? 'block-filled' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;