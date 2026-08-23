import React from 'react';
import { Sparkles, Instagram, Youtube, Linkedin, Mail, MapPin, Heart } from 'lucide-react';
import { useSpotlight } from '../context/SpotlightContext';

export const Footer: React.FC<{ onScrollTo: (id: string) => void }> = ({ onScrollTo }) => {
  const { cities } = useSpotlight();

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 pt-16 pb-12 overflow-hidden text-xs text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFE58C] to-[#C8960E] flex items-center justify-center pulse-glow">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="font-display text-xl font-bold gold-text tracking-tight">
                The Spotlightt Co.
              </span>
            </div>

            <p className="text-white/70 font-light leading-relaxed max-w-sm text-xs sm:text-sm">
              A cinematic live entertainment platform built to give emerging artists professional stages and deliver unforgettable experiences for live audiences.
            </p>

            <div className="flex items-center gap-2 pt-2">
              {[
                { icon: <Instagram className="w-4 h-4" />, href: '#', label: 'Instagram' },
                { icon: <Youtube className="w-4 h-4" />, href: '#', label: 'YouTube' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
                { icon: <Mail className="w-4 h-4" />, href: '#', label: 'Email' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center hover:border-[#F5C518] hover:text-[#F5C518] transition-colors text-white/80"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#F5C518] font-bold">
              Explore
            </div>
            <ul className="space-y-2 font-light">
              <li>
                <button
                  onClick={() => onScrollTo('events-section')}
                  className="hover:text-white transition-colors"
                >
                  Live Shows & Tickets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('perform-section')}
                  className="hover:text-white transition-colors"
                >
                  Performer Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('artists-section')}
                  className="hover:text-white transition-colors"
                >
                  Featured Artists
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('gallery-section')}
                  className="hover:text-white transition-colors"
                >
                  Stage Moments Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('faq-section')}
                  className="hover:text-white transition-colors"
                >
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Expansion & Cities */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#F5C518] font-bold">
              City Expansion
            </div>
            <ul className="space-y-2 font-light">
              <li className="flex items-center justify-between">
                <span>Chandigarh (HQ)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  ACTIVE
                </span>
              </li>
              <li className="flex items-center justify-between text-white/40">
                <span>Delhi NCR</span>
                <span className="text-[9px]">2027</span>
              </li>
              <li className="flex items-center justify-between text-white/40">
                <span>Mumbai</span>
                <span className="text-[9px]">2027</span>
              </li>
              <li className="flex items-center justify-between text-white/40">
                <span>Bengaluru</span>
                <span className="text-[9px]">2027</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>
            © {new Date().getFullYear()} The Spotlightt Co. (The Spotlightt Co. India). All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for the stage. Designed for the soul in Chandigarh.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
