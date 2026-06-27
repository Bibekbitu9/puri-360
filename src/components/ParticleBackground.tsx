import React, { useMemo } from 'react';

interface Particle {
  id: number;
  left: string;
  size: number;
  animDuration: string;
  animDelay: string;
  opacity: number;
}

export const ParticleBackground: React.FC = () => {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      // Use deterministic math to keep the render function pure
      const leftVal = (i * 17) % 100;
      const sizeVal = 2 + ((i * 7) % 5);
      const durationVal = 6 + ((i * 13) % 11);
      const delayVal = (i * 3) % 9;
      const opacityVal = 0.15 + ((i * 9) % 41) / 100;
      return {
        id: i,
        left: `${leftVal}%`,
        size: sizeVal,
        animDuration: `${durationVal}s`,
        animDelay: `${delayVal}s`,
        opacity: opacityVal,
      };
    });
  }, []);

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="golden-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.animDuration,
            animationDelay: p.animDelay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};
