import React, { useEffect, useState } from 'react';

export const SpotlightCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on devices that support hover
    const isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isHoverCapable) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        className="cursor-spotlight"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        className="cursor-dot hidden md:block"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
};
