import React, { useEffect, useState } from 'react';
import './BalanceDisplay.css';

const BalanceDisplay = ({ balance }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Stop animation after 5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className={`balance-display ${isAnimating ? 'animating' : ''}`}>
      <div className="balance-content">
        <div className="balance-label">Your balance is:</div>
        <div className="balance-amount">{formatBalance(balance)}</div>
      </div>
      
      {isAnimating && (
        <>
          <div className="confetti">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][Math.floor(Math.random() * 7)]
                }}
              />
            ))}
          </div>
          <div className="party-popper">
            <div className="popper popper-1">🎉</div>
            <div className="popper popper-2">🎊</div>
            <div className="popper popper-3">✨</div>
            <div className="popper popper-4">🎈</div>
            <div className="popper popper-5">🎁</div>
          </div>
        </>
      )}
    </div>
  );
};

export default BalanceDisplay;
