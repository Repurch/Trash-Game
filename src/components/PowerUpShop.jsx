import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Game.css';

const PowerUpShop = ({ tokens = 0, powerUps = [], onPurchase }) => {
  return (
    <div className="power-up-shop">
      <h2>Power-Up Shop</h2>
      <div className="token-balance">
        Tokens: {tokens}
      </div>
      <div className="power-ups-list">
        {powerUps.map((powerUp) => (
          <div key={powerUp.id} className="power-up-item">
            <h3>{powerUp.name}</h3>
            <p>Cost: {powerUp.cost} tokens</p>
            <button 
              onClick={() => onPurchase(powerUp.id)}
              disabled={tokens < powerUp.cost}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

PowerUpShop.propTypes = {
  tokens: PropTypes.number.isRequired,
  powerUps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
    })
  ).isRequired,
  onPurchase: PropTypes.func.isRequired,
};

export default PowerUpShop;