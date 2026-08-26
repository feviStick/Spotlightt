import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Sparkles, Send, CheckCircle2, Phone, MapPin, Instagram, Youtube, Linkedin } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VIPNewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    type: 'Partnership / Sponsorship',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) return;
    setSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F5C518', '#FFE58C', '#FFFFFF'],
      });
    } catch {}
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    });
    if (!response.ok) return;
    setContactSubmitted(true);
  };

  return (
    <section id="contact-section" className="relative py-24 sm:py-32 bg-[#0b0b0b] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: VIP Circle Newsletter */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inner Circle Access</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Never Miss A <span className="gold-text">Show</span>.
            </h2>

            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
              Get secret line-up drops 48 hours before the public, early-bird VIP discounts, and invitations to private artist afterparties in Chandigarh.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-5 rounded-2xl border border-emerald-500/30 flex items-center gap-3 text-emerald-300"
              >
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                <div className="text-xs sm:text-sm">
                  <strong>Welcome to The Spotlightt Circle.</strong> Check your inbox for exclusive early access invites!
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-[#F5C518]/60"
                  required
                />
                <button
                  type="submit"
                  className="btn-glow px-7 py-3.5 rounded-full bg-[#F5C518] text-black font-bold text-xs uppercase tracking-wider whitespace-nowrap shadow-lg flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Join Circle</span>
                </button>
              </form>
            )}

            {/* Quick Contact Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5C518]" />
                <span>Sector 18 / 26 / IT Park, Chandigarh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F5C518]" />
                <span>+91 98765 43210 (11am - 8pm)</span>
              </div>
            </div>
          </div>

          {/* Right: Partner / Sponsor Contact Form */}
          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Partner With The Spotlightt Co.
            </h3>
            <p className="text-xs text-white/60 font-light mb-6">
              Host your own event, sponsor an upcoming comedy tour, or book our curated talent for private shows.
            </p>

            {contactSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-white/5 border border-[#F5C518]/30 text-center space-y-2"
              >
                <CheckCircle2 className="w-8 h-8 text-[#F5C518] mx-auto" />
                <div className="font-display text-lg font-bold text-white">Message Received</div>
                <p className="text-xs text-white/60">
                  Our talent director will get in touch with you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Work Email *"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                    required
                  />
                </div>

                <div>
                  <select
                    value={contactForm.type}
                    onChange={e => setContactForm({ ...contactForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C518]/60"
                  >
                    <option className="bg-[#111]">Brand Sponsorship & Stage Naming</option>
                    <option className="bg-[#111]">Venue Partnership (Chandigarh)</option>
                    <option className="bg-[#111]">Private Corporate Live Show Booking</option>
                    <option className="bg-[#111]">Media & Press Inquiry</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your vision or requirements..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-glow py-3 rounded-full bg-[#F5C518] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
