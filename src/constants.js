export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

// Mock player data (backend will replace)
export const mockPlayers = [
  {
    id: "player1",
    grid: Array(20).fill().map(() => Array(10).fill(0)),
    score: 150,
    tokens: 25,
  },
  {
    id: "player2", 
    grid: Array(20).fill().map(() => Array(10).fill(0)),
    score: 90,
    tokens: 15,
  },
];