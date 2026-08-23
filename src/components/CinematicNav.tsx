import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpotlight } from '../context/SpotlightContext';
import {
  Sparkles,
  Ticket,
  Mic2,
  MapPin,
  Volume2,
  VolumeX,
  Shield,
  Menu,
  X,
  ChevronDown,
  Calendar,
} from 'lucide-react';

interface CinematicNavProps {
  onScrollTo: (elementId: string) => void;
}

export const CinematicNav: React.FC<CinematicNavProps> = ({ onScrollTo }) => {
  const {
    cities,
    selectedCity,
    setSelectedCity,
    ambientAudioPlaying,
    toggleAmbientAudio,
    setIsAdminOpen,
    setSelectedCategoryForModal,
    categories,
  } = useSpotlight();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shows', id: 'events-section' },
    { label: 'Perform', id: 'perform-section' },
    { label: 'Lineup', id: 'artists-section' },
    { label: 'Why Us', id: 'why-section' },
    { label: 'Gallery', id: 'gallery-section' },
    { label: 'Reviews', id: 'reviews-section' },
    { label: 'FAQ', id: 'faq-section' },
  ];

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong py-3.5 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('top')}
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="The Spotlightt Co. Home"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFE58C] via-[#F5C518] to-[#C8960E] flex items-center justify-center pulse-glow shadow-[0_0_15px_rgba(245,197,24,0.4)]">
              <Sparkles className="w-4 h-4 text-black font-bold" />
            </div>
            <div className="text-left">
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight gold-text block leading-none">
                The Spotlightt Co.
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/50 block mt-0.5 font-medium">
                Live Entertainment
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-xs tracking-wider uppercase font-medium text-white/70 hover:text-white transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[1.5px] bg-[#F5C518] w-0 group-hover:w-full transition-all duration-300 rounded-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-white/90 hover:border-[#F5C518]/50 transition-colors"
                title="Select City"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F5C518]" />
                <span className="font-medium">{selectedCity.name}</span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              <AnimatePresence>
                {cityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-52 glass-strong rounded-2xl p-2 border border-white/10 shadow-2xl z-50"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-white/40 px-3 py-1 font-semibold">
                      Select Region
                    </div>
                    {cities.map(city => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                          selectedCity.id === city.id
                            ? 'bg-[#F5C518]/15 text-[#F5C518] font-medium'
                            : 'text-white/80 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{city.name}</span>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-widest font-semibold ${
                            city.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {city.status === 'active' ? 'Live' : 'Soon'}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Audio Atmosphere Toggle */}
            <button
              onClick={toggleAmbientAudio}
              className={`p-2 rounded-full glass border transition-colors ${
                ambientAudioPlaying
                  ? 'border-[#F5C518] text-[#F5C518] bg-[#F5C518]/10'
                  : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
              title={ambientAudioPlaying ? 'Mute stage atmosphere' : 'Play stage ambient atmosphere'}
              aria-label="Ambient sound"
            >
              {ambientAudioPlaying ? (
                <div className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-semibold">Live Sound</span>
                </div>
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Organizer Admin Portal Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-full glass text-white/60 hover:text-white hover:border-[#F5C518]/40 transition-colors"
              title="Organizer & Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

            {/* CTA: Book Tickets */}
            <button
              onClick={() => handleNavClick('events-section')}
              className="hidden sm:inline-flex items-center gap-1.5 btn-glow bg-[#F5C518] text-black font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-full hover:bg-[#FFE58C] transition-all"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Tickets</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg glass"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 inset-x-4 z-40 lg:hidden glass-strong rounded-3xl p-6 border border-white/15 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <div className="text-xs uppercase tracking-widest text-[#F5C518] font-bold pb-2 border-b border-white/10">
                Navigation
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="text-left text-sm py-2 px-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                <button
                  onClick={() => handleNavClick('events-section')}
                  className="w-full btn-glow bg-[#F5C518] text-black font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" /> Explore & Book Shows
                </button>
                <button
                  onClick={() => handleNavClick('perform-section')}
                  className="w-full glass border border-white/20 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:border-[#F5C518]"
                >
                  <Mic2 className="w-4 h-4 text-[#F5C518]" /> I Want To Perform
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
