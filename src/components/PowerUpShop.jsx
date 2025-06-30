 const PowerUpShop = ({ player, onPowerUp }) => {
  const powerUps = [
    { name: "Clear Row", cost: 5, action: "clear" },
    { name: "Send Garbage", cost: 10, action: "sabotage" },
    { name: "Speed Boost", cost: 3, action: "speed" },
  ];

  return (
    <div className="power-up-shop">
      <h3>Power-Ups ($TRASH: {player.tokens})</h3>
      {powerUps.map((p) => (
        <button 
          key={p.action}
          disabled={player.tokens < p.cost}
          onClick={() => onPowerUp(p.action)}
        >
          {p.name} ({p.cost} $TRASH)
        </button>
      ))}
    </div>
  );
};

export default PowerUpShop;