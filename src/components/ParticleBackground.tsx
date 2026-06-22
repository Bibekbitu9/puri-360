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
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      animDuration: `${6 + Math.random() * 10}s`,
      animDelay: `${Math.random() * 8}s`,
      opacity: 0.15 + Math.random() * 0.4,
    }));
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
