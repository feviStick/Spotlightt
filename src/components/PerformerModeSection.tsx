import React from 'react';
import { motion } from 'motion/react';
import { useSpotlight } from '../context/SpotlightContext';
import { Category } from '../types';
import { Mic2, ArrowRight, Sparkles, Video, Award, Radio } from 'lucide-react';

interface PerformerModeSectionProps {
  onSelectCategory: (category: Category) => void;
}

export const PerformerModeSection: React.FC<PerformerModeSectionProps> = ({ onSelectCategory }) => {
  const { categories, events, selectedCity } = useSpotlight();

  return (
    <section id="perform-section" className="relative py-24 sm:py-32 bg-[#0b0b0b] overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#F5C518]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em] mb-4">
            <Mic2 className="w-3.5 h-3.5" />
            <span>Artist Registration & Stages</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Pick Your <span className="gold-text">Category</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Every artist receives professional Shure SM58 audio engineering, 4K multi-cam footage, and verified stage certificates. Select your art form to register for upcoming shows.
          </p>
        </div>

        {/* Performer Perks Mini-Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="glass p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F5C518]/10 text-[#F5C518]">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">4K Raw & Edited Video</div>
              <div className="text-[11px] text-white/50">Multi-cam reel footage included</div>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Studio Audio Mix</div>
              <div className="text-[11px] text-white/50">Direct soundboard master tracks</div>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#A855F7]/10 text-[#A855F7]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Certified Stage Credit</div>
              <div className="text-[11px] text-white/50">Signed portfolio verification</div>
            </div>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const openEvents = events.filter(e => e.categoryId === cat.id && e.cityId === selectedCity.id);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                whileHover={{ y: -8 }}
                onClick={() => onSelectCategory(cat)}
                className="group relative rounded-3xl overflow-hidden glass border cursor-pointer p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl"
                style={{
                  borderColor: `${cat.themeColor}33`,
                }}
              >
                {/* Glow Overlay on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${cat.themeColor}25 0%, transparent 70%)`,
                  }}
                />

                {/* Top Row: Icon & Slot indicator */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl transform transition-transform duration-500 group-hover:scale-120 group-hover:rotate-6">
                      {cat.icon}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        backgroundColor: `${cat.themeColor}20`,
                        color: cat.themeColor,
                        border: `1px solid ${cat.themeColor}40`,
                      }}
                    >
                      {openEvents.length} Active Shows
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white group-hover:text-white leading-tight">
                    {cat.name}
                  </h3>

                  <p className="mt-2.5 text-xs text-white/60 font-light leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Row: Registration Fee + Register CTA */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/40">Stage Fee</div>
                    <div
                      className="font-display text-lg font-bold"
                      style={{ color: cat.themeColor }}
                    >
                      ₹{cat.registrationFee}
                    </div>
                  </div>

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                    style={{
                      backgroundColor: `${cat.themeColor}25`,
                      color: cat.themeColor,
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 inset-x-0 h-1"
                  style={{ backgroundColor: cat.themeColor }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
