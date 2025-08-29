import React, { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

// Create board cell configuration
const BOARD_SIZE = 15;
const SAFE_CELLS = [[1,6], [6,1], [8,13], [13,8]];
const HOME_BASES = {
  'r': [1,1],
  'g': [1,13],
  'b': [13,1],
  'y': [13,13]
};

function buildBoard() {
  const cells = Array(BOARD_SIZE).fill().map(() => 
    Array(BOARD_SIZE).fill().map(() => ({ type: 'square' }))
  );
  
  // Add safe squares
  SAFE_CELLS.forEach(([r,c]) => cells[r][c].type = 'safe');
  
  // Add home bases
  Object.entries(HOME_BASES).forEach(([color, [r,c]]) => {
    cells[r][c].type = `home-${color}`;
  });
  
  return cells;
}

export default function LudoBoard() {
  const { players, togglePlayer } = useContext(PlayerContext);
  const [board] = useState(buildBoard);
  const [diceValues, setDiceValues] = useState(players.map(() => 1));

  const rollDice = (playerIndex) => {
    if (!players[playerIndex].active) return;
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValues(prev => {
      const next = [...prev];
      next[playerIndex] = newValue;
      return next;
    });
  };

  return (
    <div className="game-container">
      <div className="controls-area">
        <h2 className="card-title">LudoMaster</h2>
        <div className="player-controls">
          {players.map((player, i) => (
            <button 
              key={player.id}
              className={`btn player-toggle ${player.active ? '' : 'secondary'}`}
              onClick={() => togglePlayer(player.id)}
            >
              {player.name} {player.active ? '(Active)' : '(Join)'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="board-container">
        <div className="board-with-dice">
          <div className="board" role="grid" aria-label="Ludo board">
            {board.map((row, ri) => row.map((cell, ci) => (
              <div 
                key={`${ri}-${ci}`} 
                className={`cell ${cell.type}`}
                role="gridcell"
                aria-label={`${cell.type} at row ${ri + 1}, column ${ci + 1}`}
              />
            )))}
          </div>
          
          <div className="dice-areas">
            {players.map((player, i) => (
              player.active && (
                <div key={player.id} className={`dice-area dice-${player.color}`}>
                  <button 
                    className="dice" 
                    onClick={() => rollDice(i)}
                    aria-label={`Roll dice for ${player.name}`}
                  >
                    {diceValues[i]}
                  </button>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
