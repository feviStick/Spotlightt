import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Mic2, ChevronDown, Sparkles, Flame, Music, Feather, Laugh } from 'lucide-react';

interface HeroCarouselProps {
  onExplore: () => void;
  onPerform: () => void;
}

interface SlideTheme {
  title: string;
  subtitle: string;
  tagline: string;
  genre: string;
  color: string;
  glowColor: string;
  img: string;
  badgeIcon: React.ReactNode;
  quote: string;
}

const HERO_SLIDES: SlideTheme[] = [
  {
    title: 'Become The Spotlight.',
    subtitle: 'Stand-up Comedy Nights',
    tagline: 'Laugh Together. Unfiltered Punchlines & Pure Joy.',
    genre: 'COMEDY',
    color: '#F5C518',
    glowColor: 'rgba(245, 197, 24, 0.28)',
    img: 'https://images.unsplash.com/photo-1512830414785-9928e23475dc?crop=entropy&cs=srgb&fm=jpg&q=85',
    badgeIcon: <Laugh className="w-4 h-4 text-[#F5C518]" />,
    quote: '"The sharpest comedic minds in North India, under one roof."',
  },
  {
    title: 'Every Story Deserves A Stage.',
    subtitle: 'Poetry & Spoken Word',
    tagline: 'Words That Echo In Your Soul Under Electric Blue Haze.',
    genre: 'POETRY',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.28)',
    img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=srgb&fm=jpg&q=85',
    badgeIcon: <Feather className="w-4 h-4 text-[#38BDF8]" />,
    quote: '"Haunting verses, raw emotion, and an audience that listens with their heart."',
  },
  {
    title: 'Feel The Music.',
    subtitle: 'Purple Indie Sessions',
    tagline: 'Intimate Acoustic Sets & Hypnotic Concert Energy.',
    genre: 'MUSIC',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.28)',
    img: 'https://images.unsplash.com/photo-1611956425642-d5a8169abd63?crop=entropy&cs=srgb&fm=jpg&q=85',
    badgeIcon: <Music className="w-4 h-4 text-[#A855F7]" />,
    quote: '"Lush acoustics and indie rhythms designed for true audiophiles."',
  },
  {
    title: 'Claim Your Voice.',
    subtitle: 'Open Mic & Rap Cyphers',
    tagline: '5 Minutes On Stage That Can Change Your Trajectory.',
    genre: 'OPEN MIC & RAP',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.28)',
    img: 'https://images.unsplash.com/photo-1618861297248-3438b3d9aae9?crop=entropy&cs=srgb&fm=jpg&q=85',
    badgeIcon: <Flame className="w-4 h-4 text-[#F97316]" />,
    quote: '"From first-timers to future icons. The stage is completely yours."',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExplore, onPerform }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentIdx];

  return (
    <section
      id="top"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[92vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Background with cross-fade & motion zoom */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.genre}
          initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.img}
            alt={slide.subtitle}
            className="w-full h-full object-cover object-center transform scale-105"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/75 to-[#090909]/45" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${slide.glowColor} 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating ambient stage particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="particle absolute w-1 h-1 rounded-full opacity-60"
            style={{
              background: slide.color,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDuration: `${7 + (i % 9)}s`,
              animationDelay: `${(i % 4) * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center">
        {/* Dynamic Category Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 border border-white/15 backdrop-blur-xl shadow-lg"
        >
          {slide.badgeIcon}
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/90">
            CHANDIGARH · {slide.subtitle}
          </span>
        </motion.div>

        {/* Animated Main Headline */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={slide.title}
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] sm:leading-[1.0]"
          >
            {slide.title}
          </motion.h1>
        </AnimatePresence>

        {/* Tagline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={slide.tagline}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-light leading-relaxed"
          >
            {slide.tagline}
          </motion.p>
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onExplore}
            className="w-full sm:w-auto btn-glow bg-[#F5C518] text-black hover:bg-[#FFE58C] font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_0_25px_rgba(245,197,24,0.35)] flex items-center justify-center gap-2.5 transition-all"
          >
            <Ticket className="w-4 h-4 text-black" />
            <span>Explore Events</span>
          </button>
          <button
            onClick={onPerform}
            className="w-full sm:w-auto glass border border-white/30 hover:border-[#F5C518] text-white hover:text-[#F5C518] font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded-full flex items-center justify-center gap-2.5 transition-all backdrop-blur-xl"
          >
            <Mic2 className="w-4 h-4 text-[#F5C518]" />
            <span>Perform With Us</span>
          </button>
        </motion.div>

        {/* Slide Selector Badges / Progress Indicators */}
        <div className="mt-14 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {HERO_SLIDES.map((s, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={s.genre}
                onClick={() => setCurrentIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'glass-strong text-white border shadow-lg scale-105'
                    : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white/80'
                }`}
                style={{
                  borderColor: isActive ? s.color : 'rgba(255,255,255,0.08)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full transition-transform"
                  style={{
                    backgroundColor: s.color,
                    boxShadow: isActive ? `0 0 8px ${s.color}` : 'none',
                  }}
                />
                <span>{s.genre}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 flex flex-col items-center gap-1 text-white/40">
          <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Scroll To Discover</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-[#F5C518]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
