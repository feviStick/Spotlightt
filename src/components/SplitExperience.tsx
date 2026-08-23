import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mic2, Ticket, Sparkles } from 'lucide-react';

interface SplitExperienceProps {
  onPerformClick: () => void;
  onBookClick: () => void;
}

export const SplitExperience: React.FC<SplitExperienceProps> = ({
  onPerformClick,
  onBookClick,
}) => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#090909] via-[#0d0d0d] to-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em] mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual Experience</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white"
          >
            Choose Your <span className="gold-text">Spotlight</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-white/60 font-light"
          >
            Are you stepping under the lights to share your craft, or joining the crowd to experience raw magic?
          </motion.p>
        </div>

        {/* Dual Split Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Performer Mode */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            onClick={onPerformClick}
            className="group relative h-[440px] sm:h-[500px] lg:h-[540px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#F5C518]/50 shadow-2xl transition-all duration-500"
          >
            {/* Background Image with Zoom */}
            <img
              src="https://images.unsplash.com/photo-1615754890634-69ac8bca7189?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Performer on Stage"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-108"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(245,197,24,0.3) 0%, rgba(245,197,24,0.05) 50%, transparent 75%)',
              }}
            />

            {/* Inner Content */}
            <div className="relative z-10 h-full p-8 sm:p-10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-[#F5C518]/20 border border-[#F5C518]/40 text-[#F5C518] text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
                  For Artists & Emcees
                </span>
                <div className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center group-hover:border-[#F5C518] group-hover:bg-[#F5C518] group-hover:text-black transition-all">
                  <Mic2 className="w-5 h-5 text-white group-hover:text-black" />
                </div>
              </div>

              <div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  I Want To Perform
                </h3>
                <p className="mt-3 text-sm sm:text-base text-white/75 font-light leading-relaxed max-w-md">
                  Register for our curated comedy, poetry, music, storytelling, and rap open mic stages. Get professional audio, multi-cam video, and certified stage credits.
                </p>

                <div className="mt-6 inline-flex items-center gap-2.5 text-[#F5C518] font-semibold text-sm uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>Enter Performer Mode</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Audience Mode */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            onClick={onBookClick}
            className="group relative h-[440px] sm:h-[500px] lg:h-[540px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#A855F7]/50 shadow-2xl transition-all duration-500"
          >
            {/* Background Image with Zoom */}
            <img
              src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Audience Cheering"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-108"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.05) 50%, transparent 75%)',
              }}
            />

            {/* Inner Content */}
            <div className="relative z-10 h-full p-8 sm:p-10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#C084FC] text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
                  For Audience & Fans
                </span>
                <div className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center group-hover:border-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-black transition-all">
                  <Ticket className="w-5 h-5 text-white group-hover:text-black" />
                </div>
              </div>

              <div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Book Live Tickets
                </h3>
                <p className="mt-3 text-sm sm:text-base text-white/75 font-light leading-relaxed max-w-md">
                  Discover Chandigarh’s most cinematic live entertainment experiences. Instant encrypted QR tickets, reserved front-row seating, and VIP green-room passes.
                </p>

                <div className="mt-6 inline-flex items-center gap-2.5 text-[#C084FC] font-semibold text-sm uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>Enter Audience Mode</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
