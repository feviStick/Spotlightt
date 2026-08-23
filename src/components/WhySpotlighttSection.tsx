import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, QrCode, Video, Award, HeartHandshake, Mic2, Music4, ShieldCheck } from 'lucide-react';

export const WhySpotlighttSection: React.FC = () => {
  const cards = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#F5C518]" />,
      title: 'Cinematic Production Standard',
      description:
        'Every single show is produced with studio-grade lighting trusses, Shure audio microphones, and atmospheric haze, creating a world-class theater experience.',
      accent: 'border-[#F5C518]/30',
      badge: 'PREMIUM QUALITY',
    },
    {
      icon: <QrCode className="w-6 h-6 text-[#38BDF8]" />,
      title: 'Instant QR Digital Tickets',
      description:
        'Zero waiting in queues. Purchase your ticket in seconds, receive an encrypted QR pass directly on your device, and walk in seamlessly.',
      accent: 'border-[#38BDF8]/30',
      badge: 'FAST & SECURE',
    },
    {
      icon: <Video className="w-6 h-6 text-[#A855F7]" />,
      title: '4K Multi-Cam Reel Footage',
      description:
        'All registered performers receive professionally edited high-definition video clips of their live sets for their social media and portfolios.',
      accent: 'border-[#A855F7]/30',
      badge: 'ARTIST GROWTH',
    },
    {
      icon: <Award className="w-6 h-6 text-[#10B981]" />,
      title: 'Certified Stage Credits',
      description:
        'Performers receive verified digital certificates signed by The Spotlightt Co. organizers, recognizing their official live appearance.',
      accent: 'border-[#10B981]/30',
      badge: 'CREDENTIALS',
    },
  ];

  return (
    <section id="why-section" className="relative py-24 sm:py-32 bg-[#0b0b0b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Spotlightt Distinction</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Why <span className="gold-text">Spotlightt</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/60 font-light leading-relaxed">
            We are not just selling tickets. We are building India’s highest-standard live entertainment ecosystem for artists and audiences alike.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className={`glass p-6 sm:p-8 rounded-3xl border ${card.accent} flex flex-col justify-between transition-all duration-300 hover:shadow-2xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    {card.icon}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 font-bold">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white leading-snug">
                  {card.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-white/65 font-light leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Verified Spotlightt Guarantee</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
