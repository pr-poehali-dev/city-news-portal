import { useRef, useState, MouseEvent } from 'react';

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MagneticCard = ({ children, className = '', onClick }: MagneticCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`transition-all duration-300 ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${-position.y}deg) rotateY(${position.x}deg) scale(${isHovered ? 1.02 : 1})`,
      }}
    >
      {children}
    </div>
  );
};
