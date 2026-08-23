import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpotlight } from '../context/SpotlightContext';
import { Sparkles, ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs } = useSpotlight();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'audience' | 'performer' | 'booking'>('all');

  const filteredFaqs = faqs.filter(f => {
    if (activeCategory === 'all') return true;
    return f.category === activeCategory;
  });

  return (
    <section id="faq-section" className="relative py-24 sm:py-32 bg-[#090909]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Frequently <span className="gold-text">Asked</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/60 font-light">
            Everything you need to know about booking passes, performing on stage, and entry protocols.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {[
              { label: 'All Questions', id: 'all' },
              { label: 'For Audience', id: 'audience' },
              { label: 'For Performers', id: 'performer' },
              { label: 'Ticket & Refund', id: 'booking' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as 'all' | 'audience' | 'performer' | 'booking')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#F5C518] text-black shadow-lg'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {filteredFaqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl border border-white/10 overflow-hidden transition-colors hover:border-white/20"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#F5C518] text-black border-[#F5C518]' : 'text-white/60'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-xs sm:text-sm text-white/70 font-light leading-relaxed border-t border-white/5"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
