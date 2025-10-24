'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // Negative for reverse direction
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.5,
  className = "",
}) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        setOffset(scrollY * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
};

interface MouseParallaxProps {
  children: React.ReactNode;
  strength?: number; // 0-1, with 1 being the strongest effect
  className?: string;
}

export const MouseParallax: React.FC<MouseParallaxProps> = ({
  children,
  strength = 0.1,
  className = "",
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      // Calculate mouse position relative to the center of the element
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate normalized offset (-1 to 1)
      const offsetX = (e.clientX - centerX) / (window.innerWidth / 2);
      const offsetY = (e.clientY - centerY) / (window.innerHeight / 2);
      
      // Apply strength and set position
      setPosition({
        x: offsetX * strength * 40, // Multiply by desired pixel movement
        y: offsetY * strength * 40,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  return (
    <div 
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
};

// Container that creates a parallax effect with multiple children at different speeds
export const ParallaxContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {React.Children.map(children, (child, index) => {
        // Convert index to a parallax speed between -0.5 and 0.5
        const speed = (index / React.Children.count(children)) - 0.5;
        
        if (React.isValidElement(child)) {
          return (
            <ParallaxLayer 
              key={index} 
              speed={speed}
              className="absolute inset-0"
            >
              {child}
            </ParallaxLayer>
          );
        }
        return child;
      })}
    </div>
  );
};