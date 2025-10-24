'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedTextProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export const TypewriterText: React.FC<AnimatedTextProps> = ({
  words,
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Word complete, wait then start deleting
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Deletion complete, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = "",
  delay = 0,
  staggerDelay = 50,
}) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, staggerDelay);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text.length, delay, staggerDelay]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-300 ${
            index < visibleChars 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

interface GradientTextProps {
  text: string;
  className?: string;
  gradient?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  className = "",
  gradient = "from-white via-yellow-200 to-white",
}) => {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {text}
    </span>
  );
};

interface FloatingWordsProps {
  words: string[];
  className?: string;
}

export const FloatingWords: React.FC<FloatingWordsProps> = ({
  words,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-default hover:scale-105"
          style={{
            animationDelay: `${index * 200}ms`,
            animation: `fadeInUp 0.8s ease-out forwards`
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};