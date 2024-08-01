import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const FuturisticConfetti = ({ trigger }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <Confetti
      active={isActive}
      numberOfPieces={200}
      colors={['#00ff00', '#0000ff', '#ff00ff', '#00ffff']}
      shapes={['square']}
      gravity={0.3}
      wind={0.05}
      opacity={0.7}
      recycle={false}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }}
    />
  );
};

export default FuturisticConfetti;
