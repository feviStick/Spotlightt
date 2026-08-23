import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => {
      setStage(3);
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-[#070707] flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* Sweeping stage spotlight */}
          <div
            className="absolute inset-0 loader-spotlight w-[240%] h-[320%] -top-1/2 origin-center pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 45% 100% at center, rgba(245,197,24,0.3) 0%, rgba(245,197,24,0.08) 35%, transparent 65%)',
            }}
          />

          <div className="relative z-10 text-center px-6 max-w-lg">
            {/* Top subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 15 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5C518] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.35em] text-white/70 font-medium">
                Est. 2025 · Chandigarh, India
              </span>
            </motion.div>

            {/* Main Brand Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
              animate={{
                opacity: stage >= 1 ? 1 : 0,
                scale: stage >= 1 ? 1 : 0.94,
                filter: stage >= 1 ? 'blur(0px)' : 'blur(8px)',
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight gold-text"
            >
              The Spotlightt Co.
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 10 }}
              transition={{ duration: 0.6 }}
              className="mt-3 text-sm md:text-base text-white/60 tracking-[0.2em] uppercase font-cinzel"
            >
              Become The Spotlight
            </motion.p>

            {/* Glowing horizontal laser reveal */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: stage >= 2 ? 1 : 0, opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] w-48 mx-auto mt-6 bg-gradient-to-r from-transparent via-[#F5C518] to-transparent shadow-[0_0_12px_#F5C518]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
