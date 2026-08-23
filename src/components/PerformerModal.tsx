import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Category, EventItem, PerformerRegistration } from '../types';
import { useSpotlight } from '../context/SpotlightContext';
import {
  X,
  Mic2,
  Calendar,
  MapPin,
  Check,
  ChevronRight,
  ShieldCheck,
  Award,
  Video,
  Instagram,
  User,
  Sparkles,
} from 'lucide-react';

interface PerformerModalProps {
  category: Category | null;
  onClose: () => void;
}

export const PerformerModal: React.FC<PerformerModalProps> = ({ category, onClose }) => {
  const { events, selectedCity, registerPerformer, venues } = useSpotlight();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
    instagram: '',
    age: '',
    city: selectedCity.name || 'Chandigarh',
  });
  const [performance, setPerformance] = useState({
    title: '',
    language: 'Hindi / Hinglish',
    experience: 'Beginner (0-2 open mics)',
    description: '',
    duration: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReg, setConfirmedReg] = useState<PerformerRegistration | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!category) return null;

  // Filter shows matching this category in active city
  const availableEvents = events.filter(
    e => e.categoryId === category.id && e.cityId === selectedCity.id
  );

  const selectedEvent = events.find(e => e.id === selectedEventId) || availableEvents[0];
  const fee = selectedEvent ? selectedEvent.registrationFee : category.registrationFee;

  const handleSubmit = async () => {
    if (!selectedEvent) {
      setErrorMessage('Please select a show to perform at.');
      return;
    }
    if (!personal.name.trim() || !personal.email.trim() || !personal.phone.trim()) {
      setErrorMessage('Please fill in your primary personal contact info.');
      return;
    }
    if (!performance.title.trim()) {
      setErrorMessage('Please provide a title or working name for your performance/act.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate payment & registration workflow
    setTimeout(async () => {
      const res = await registerPerformer({
        eventId: selectedEvent.id,
        categoryId: category.id,
        name: personal.name,
        email: personal.email,
        phone: personal.phone,
        instagram: personal.instagram || '@thespotlighttco',
        age: personal.age || '22',
        city: personal.city,
        title: performance.title,
        language: performance.language,
        experience: performance.experience,
        description: performance.description || 'Raw original piece prepared for The Spotlightt Co. stage.',
        duration: performance.duration,
      });

      setIsSubmitting(false);
      if (res.ok && res.registration) {
        setConfirmedReg(res.registration);
        setStep(4);
      } else {
        setErrorMessage(res.error || 'Registration could not be completed.');
      }
    }, 1200);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full glass border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Banner */}
        <div
          className="p-6 sm:p-8 shrink-0 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${category.themeColor}33 0%, rgba(14,14,14,0.95) 65%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <span
                className="text-[10px] tracking-[0.3em] font-bold uppercase block mb-1"
                style={{ color: category.themeColor }}
              >
                Artist Registration · {selectedCity.name}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {category.name} Stage
              </h2>
            </div>
          </div>

          {/* Stepper Progress Line */}
          {step < 4 && (
            <div className="mt-6 flex items-center gap-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: s <= step ? category.themeColor : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Body Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: PICK EVENT */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Step 1 · Choose Your Show Date
                </h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  Select which upcoming live showcase you want to perform in.
                </p>
              </div>

              {availableEvents.length === 0 ? (
                <div className="glass p-8 rounded-2xl border border-white/10 text-center space-y-3">
                  <p className="text-sm text-white/70">
                    No active {category.name} dates in {selectedCity.name} right now.
                  </p>
                  <p className="text-xs text-white/50">
                    Register below to be added to our priority waitlist for the next open stage call.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableEvents.map(ev => {
                    const isSelected = selectedEventId === ev.id || (!selectedEventId && ev.id === availableEvents[0].id);
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEventId(ev.id)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'shadow-lg'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                        style={{
                          borderColor: isSelected ? category.themeColor : undefined,
                          backgroundColor: isSelected ? `${category.themeColor}15` : undefined,
                        }}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-white text-sm">{ev.title}</div>
                          <div className="text-xs text-white/60 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(ev.startDate)}
                            </span>
                            <span>·</span>
                            <span>{ev.maxPerformers} Artist Slots</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className="font-display text-base font-bold block"
                            style={{ color: category.themeColor }}
                          >
                            ₹{ev.registrationFee}
                          </span>
                          <span className="text-[10px] text-white/50">Registration Fee</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => {
                  if (!selectedEventId && availableEvents[0]) {
                    setSelectedEventId(availableEvents[0].id);
                  }
                  setStep(2);
                }}
                className="w-full btn-glow py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: category.themeColor }}
              >
                <span>Continue to Personal Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Step 2 · Personal Information
                </h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  How our showrunners and stage managers will reach you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Full Stage Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sahil Varma"
                    value={personal.name}
                    onChange={e => setPersonal({ ...personal, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    value={personal.email}
                    onChange={e => setPersonal({ ...personal, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={personal.phone}
                    onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    value={personal.instagram}
                    onChange={e => setPersonal({ ...personal, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="22"
                    value={personal.age}
                    onChange={e => setPersonal({ ...personal, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    City
                  </label>
                  <input
                    type="text"
                    value={personal.city}
                    onChange={e => setPersonal({ ...personal, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-full glass border border-white/20 text-white text-xs font-semibold uppercase hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!personal.name.trim() || !personal.email.trim() || !personal.phone.trim()) {
                      setErrorMessage('Please fill in your name, email, and phone number.');
                      return;
                    }
                    setErrorMessage(null);
                    setStep(3);
                  }}
                  className="flex-1 btn-glow py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2"
                  style={{ backgroundColor: category.themeColor }}
                >
                  <span>Continue to Performance Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PERFORMANCE DETAILS & FEE PAYMENT */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Step 3 · Act Description & Stage Fee
                </h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  Tell us about your set so we can schedule the sound setup.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Performance Title / Act Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chandigarh Monsoon Stories / 5 Mins of Chaos"
                    value={performance.title}
                    onChange={e => setPerformance({ ...performance, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                      Language
                    </label>
                    <select
                      value={performance.language}
                      onChange={e => setPerformance({ ...performance, language: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                    >
                      <option className="bg-[#111]">Hindi / Hinglish</option>
                      <option className="bg-[#111]">Punjabi</option>
                      <option className="bg-[#111]">English</option>
                      <option className="bg-[#111]">Urdu</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                      Experience
                    </label>
                    <select
                      value={performance.experience}
                      onChange={e => setPerformance({ ...performance, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                    >
                      <option className="bg-[#111]">Debut / First Time on Stage</option>
                      <option className="bg-[#111]">Intermediate (1-5 Open Mics)</option>
                      <option className="bg-[#111]">Seasoned Performer (5+ Shows)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Slot Duration Preference
                  </label>
                  <div className="flex gap-3">
                    {[5, 7, 10].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setPerformance({ ...performance, duration: mins })}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          performance.duration === mins
                            ? 'border-[#F5C518] bg-[#F5C518]/15 text-[#F5C518]'
                            : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
                        }`}
                      >
                        {mins} Minutes
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Brief Summary / Theme of Act
                  </label>
                  <textarea
                    rows={3}
                    placeholder="A quick 1-2 sentence description of what you'll be delivering..."
                    value={performance.description}
                    onChange={e => setPerformance({ ...performance, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>
              </div>

              {/* Stage Fee Summary */}
              <div className="glass-strong p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Stage Registration Fee</div>
                  <div className="text-[11px] text-white/50">
                    Includes 4K Video Recording + Sound Master + Certificate
                  </div>
                </div>
                <div
                  className="font-display text-2xl font-bold"
                  style={{ color: category.themeColor }}
                >
                  ₹{fee}
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-red-400 font-medium text-center">{errorMessage}</div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-full glass border border-white/20 text-white text-xs font-semibold uppercase hover:bg-white/5 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 btn-glow py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
                  style={{ backgroundColor: category.themeColor }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Slot & Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay ₹{fee} & Secure Stage Slot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REGISTRATION CONFIRMED PASS */}
          {step === 4 && confirmedReg && (
            <div className="text-center space-y-6 py-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  backgroundColor: `${category.themeColor}25`,
                  border: `1px solid ${category.themeColor}60`,
                  color: category.themeColor,
                }}
              >
                <Check className="w-8 h-8" />
              </motion.div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Slot Confirmed! You Are On Stage.
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1.5 max-w-md mx-auto">
                  A confirmation email with slot timing & green-room instructions has been sent to{' '}
                  <strong className="text-white">{confirmedReg.email}</strong>.
                </p>
              </div>

              {/* Performer Pass Card */}
              <div
                className="glass-strong rounded-3xl p-6 border max-w-sm mx-auto text-left shadow-2xl space-y-3"
                style={{ borderColor: `${category.themeColor}40` }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-white/40 font-semibold block">
                      Performer Pass ID
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      {confirmedReg.transactionId}
                    </span>
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${category.themeColor}25`,
                      color: category.themeColor,
                    }}
                  >
                    ARTIST PASS
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-white font-bold text-sm">{personal.name}</div>
                  <div className="text-white/70">
                    Act: <em>&ldquo;{performance.title}&rdquo;</em>
                  </div>
                  <div className="text-white/60">
                    Genre: {category.name} · {performance.duration} Mins Slot
                  </div>
                  <div className="text-emerald-400 font-semibold pt-1">
                    Status: Approved & Slot Locked ({confirmedReg.assignedSlot})
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                  <span>Certificate: Auto-generated post show</span>
                  <Award className="w-4 h-4 text-[#F5C518]" />
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn-glow px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-black shadow-lg"
                style={{ backgroundColor: category.themeColor }}
              >
                Done · Return to Stage
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
