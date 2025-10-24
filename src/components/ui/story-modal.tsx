'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Heart,
  Users,
  Globe
} from 'lucide-react';

interface StorySlide {
  id: number;
  type: 'video' | 'image' | 'text';
  title: string;
  content: string;
  media?: string;
  duration?: number; // for auto-advance
}

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Story content data
const storySlides: StorySlide[] = [
  {
    id: 1,
    type: 'text',
    title: 'The Luxora Story',
    content: 'Born from a passion for luxury fashion and a vision to make authentic designer pieces accessible to fashion enthusiasts worldwide.',
    duration: 5000,
  },
  {
    id: 2,
    type: 'image',
    title: 'Curated by Experts',
    content: 'Our team of luxury fashion connoisseurs carefully selects each piece, ensuring only the finest quality makes it to our collection.',
    media: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 5000,
  },
  {
    id: 3,
    type: 'image',
    title: 'Global Fashion Houses',
    content: 'From the ateliers of Paris to the fashion capitals of Milan and New York - we bring you the world\'s most coveted brands.',
    media: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 5000,
  },
  {
    id: 4,
    type: 'text',
    title: 'Authenticity Promise',
    content: 'Every Luxora piece comes with our 100% authenticity guarantee. Our expert authentication process ensures you only receive genuine luxury items.',
    duration: 5000,
  },
  {
    id: 5,
    type: 'image',
    title: 'Personalized Service',
    content: 'Experience luxury shopping like never before with our personal shopping assistants and white-glove delivery service.',
    media: 'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 5000,
  },
  {
    id: 6,
    type: 'video',
    title: 'Behind the Scenes',
    content: 'Take a peek behind the curtain to see how we curate and deliver luxury fashion experiences.',
    media: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 15000,
  },
  {
    id: 7,
    type: 'text',
    title: 'Join the Luxora Family',
    content: 'Become part of our exclusive community of 50,000+ fashion enthusiasts who trust Luxora for their luxury shopping needs.',
    duration: 5000,
  },
  {
    id: 8,
    type: 'image',
    title: 'Your Fashion Future',
    content: 'Step into a world where luxury meets accessibility, and every purchase tells a story of craftsmanship and elegance.',
    media: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 5000,
  }
];

const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentStory = storySlides[currentSlide];
  const isVideo = currentStory.type === 'video';

  // Auto-advance slides
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const duration = currentStory.duration || 4000;
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = (elapsed / duration) * 100;
      
      setProgress(Math.min(progressPercent, 100));

      if (elapsed >= duration) {
        nextSlide();
      }
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSlide, isOpen, isPlaying]);

  // Handle video events
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        if (isPlaying) video.play().catch(console.error);
      };
      
      const handleEnded = () => {
        nextSlide();
      };

      const handleTimeUpdate = () => {
        if (video.duration) {
          const progressPercent = (video.currentTime / video.duration) * 100;
          setProgress(progressPercent);
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [currentSlide, isVideo]);

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          previousSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storySlides.length);
    setProgress(0);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storySlides.length) % storySlides.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Progress bars */}
      <div className="absolute top-6 left-6 right-6 flex gap-1 z-10">
        {storySlides.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentSlide ? '100%' : 
                       index === currentSlide ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayPause}
          className="text-white hover:bg-white/20 p-2"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        {isVideo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-white hover:bg-white/20 p-2"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 p-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="lg"
        onClick={previousSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3 z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="lg"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3 z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Story Content */}
      <div className="relative w-full max-w-lg mx-auto aspect-[9/16] overflow-hidden rounded-2xl">
        
        {/* Video Content */}
        {isVideo ? (
          <div className="relative w-full h-full bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              playsInline
              preload="metadata"
            >
              <source src={currentStory.media} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video overlay content */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentStory.title}
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                {currentStory.content}
              </p>
            </div>
          </div>
        ) : (
          /* Image/Text Content */
          <div className="relative w-full h-full">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
            
            {/* Background Image */}
            {currentStory.media && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${currentStory.media})` }}
              />
            )}
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                backgroundSize: '60px 60px'
              }} />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
              
              {/* Icon based on slide content */}
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
                {currentSlide === 0 && <Heart className="h-10 w-10 text-white" />}
                {currentSlide === 1 && <Award className="h-10 w-10 text-white" />}
                {currentSlide === 2 && <Globe className="h-10 w-10 text-white" />}
                {currentSlide === 3 && <Star className="h-10 w-10 text-white" />}
                {currentSlide === 4 && <Users className="h-10 w-10 text-white" />}
                {currentSlide === 6 && <Users className="h-10 w-10 text-white" />}
                {currentSlide === 7 && <Heart className="h-10 w-10 text-white" />}
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                {currentStory.title}
              </h2>
              
              <p className="text-white/90 text-xl leading-relaxed max-w-md">
                {currentStory.content}
              </p>

              {/* Stats for specific slides */}
              {currentSlide === 6 && (
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">50K+</div>
                    <div className="text-white/70">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">500+</div>
                    <div className="text-white/70">Luxury Brands</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slide indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {currentSlide + 1} / {storySlides.length}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/50 text-xs text-center">
        <p>Tap sides to navigate • Space to pause • ESC to close</p>
      </div>
    </div>
  );
};

export default StoryModal;