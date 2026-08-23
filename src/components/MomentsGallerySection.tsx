import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpotlight } from '../context/SpotlightContext';
import { GalleryItem } from '../types';
import { Sparkles, X, MapPin, Calendar, ZoomIn } from 'lucide-react';

export const MomentsGallerySection: React.FC = () => {
  const { gallery, selectedCity } = useSpotlight();
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Performance', 'Comedy', 'Poetry', 'Music', 'Rap'];

  const filteredGallery = gallery.filter(item => {
    if (activeFilter === 'All') return true;
    return item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section id="gallery-section" className="relative py-24 sm:py-32 bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase Archive</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Nights <span className="gold-text">Remembered</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/60 font-light leading-relaxed">
            A visual chronicle of the energy, tears, laughs, and standing ovations across our live stages in Chandigarh.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-[#F5C518] text-black shadow-lg scale-105'
                    : 'glass text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-Style Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer glass border border-white/10 hover:border-[#F5C518]/40 shadow-xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-4 right-4 p-2 rounded-full glass border border-white/20 text-white/70 group-hover:text-[#F5C518] group-hover:border-[#F5C518] opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ZoomIn className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="px-2 py-0.5 rounded-md bg-[#F5C518]/20 text-[#F5C518] text-[10px] font-bold uppercase tracking-wider mb-1.5 inline-block">
                    {item.category}
                  </span>
                  <h4 className="font-medium text-sm text-white line-clamp-1 leading-snug">
                    {item.caption}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-white/50 mt-1">
                    <MapPin className="w-3 h-3 text-[#F5C518]" />
                    <span>{item.city}</span>
                    <span>·</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full glass-strong rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full glass border border-white/20 text-white hover:text-[#F5C518]"
                aria-label="Close image"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.caption}
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              </div>

              <div className="p-6 bg-[#0e0e0e] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#F5C518] font-bold block mb-1">
                    {lightboxItem.category} · {lightboxItem.city}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">
                    {lightboxItem.caption}
                  </h3>
                </div>
                <div className="text-xs text-white/50 font-medium whitespace-nowrap">
                  Captured {lightboxItem.date}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
