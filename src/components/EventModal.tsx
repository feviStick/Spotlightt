import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EventItem, AudienceBooking } from '../types';
import { useSpotlight } from '../context/SpotlightContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ShieldCheck,
  Check,
  Download,
  Share2,
  Tag,
  CreditCard,
  QrCode,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { bookTicket, applyCoupon, categories, venues } = useSpotlight();

  const [step, setStep] = useState<'details' | 'customize' | 'payment' | 'confirmed'>('details');
  const [ticketTier, setTicketTier] = useState<'general' | 'vip' | 'premium'>('general');
  const [quantity, setQuantity] = useState(1);
  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ percent: number; amount: number; message: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [attendee, setAttendee] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<AudienceBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!event) return null;

  const category = categories.find(c => c.id === event.categoryId);
  const venue = venues.find(v => v.id === event.venueId);
  const themeColor = category?.themeColor || '#F5C518';

  const tierPrices = {
    general: event.ticketPrice,
    vip: event.vipPrice,
    premium: event.premiumPrice,
  };

  const currentUnitPrice = tierPrices[ticketTier];
  const subtotal = currentUnitPrice * quantity;
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput, subtotal);
    if (res.valid) {
      setAppliedDiscount({
        percent: res.discountPercent,
        amount: res.discountAmount,
        message: res.message,
      });
      setErrorMessage(null);
    } else {
      setAppliedDiscount(null);
      setErrorMessage(res.message);
    }
  };

  const handleProcessPayment = async () => {
    if (!attendee.name.trim() || !attendee.email.trim() || !attendee.phone.trim()) {
      setErrorMessage('Please provide your complete name, email, and phone number.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate payment gateway delay (e.g. Razorpay modal)
    setTimeout(async () => {
      const res = await bookTicket({
        eventId: event.id,
        ticketType: ticketTier,
        quantity,
        coupon: appliedDiscount ? couponInput : undefined,
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        paymentMethod,
      });

      setIsProcessing(false);
      if (res.ok && res.booking) {
        setConfirmedBooking(res.booking);
        setStep('confirmed');
      } else {
        setErrorMessage(res.error || 'Payment failed. Please try again.');
      }
    }, 1200);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-[#0e0e0e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
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
        <div className="relative h-48 sm:h-64 shrink-0 overflow-hidden">
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/60 to-black/40" />

          <div className="absolute bottom-4 left-6 right-6 flex flex-col justify-end">
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-black uppercase tracking-wider w-fit mb-2 shadow-lg"
              style={{ backgroundColor: themeColor }}
            >
              {category?.name || 'Live Show'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Stepper Header (if customizing or paying) */}
        {step !== 'details' && step !== 'confirmed' && (
          <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 'customize' ? 'bg-[#F5C518] text-black' : 'bg-white/10 text-white'
                }`}
              >
                1
              </span>
              <span className={step === 'customize' ? 'text-white font-medium' : 'text-white/50'}>
                Select Tier & Seats
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-white/30" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 'payment' ? 'bg-[#F5C518] text-black' : 'bg-white/10 text-white'
                }`}
              >
                2
              </span>
              <span className={step === 'payment' ? 'text-white font-medium' : 'text-white/50'}>
                Payment & Checkout
              </span>
            </div>
          </div>
        )}

        {/* Modal Body Container with Scroll */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: EVENT DETAILS */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Event Description */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">
                  About This Performance
                </h4>
                <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
                  {event.longDescription || event.description}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-[#F5C518]" /> Date
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">
                    {formatDate(event.startDate)}
                  </div>
                </div>

                <div className="glass p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-[#F5C518]" /> Time
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {formatTime(event.startDate)}
                  </div>
                </div>

                <div className="glass p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-[#F5C518]" /> Venue
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">
                    {venue?.name || 'Chandigarh'}
                  </div>
                </div>

                <div className="glass p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-[#F5C518]" /> Host
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">
                    {event.host}
                  </div>
                </div>
              </div>

              {/* Venue Address + Maps link */}
              {venue && (
                <div className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#F5C518] mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">{venue.name}</div>
                      <div className="text-[11px] text-white/50">{venue.address}</div>
                    </div>
                  </div>
                  <a
                    href={venue.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#F5C518] hover:underline flex items-center gap-1 shrink-0 font-medium"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Guest Artists */}
              {event.guestArtists && event.guestArtists.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2.5">
                    Featured Guest Lineup
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.guestArtists.map(artist => (
                      <span
                        key={artist}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/90 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-[#F5C518]" />
                        <span>{artist}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Breakdown */}
              {event.timeline && event.timeline.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">
                    Show Night Timeline
                  </h4>
                  <div className="space-y-2">
                    {event.timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="glass px-4 py-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs"
                      >
                        <span className="font-mono text-[#F5C518] font-bold">{item.time}</span>
                        <span className="text-white/80 font-light">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA Row */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Starting From</div>
                  <div className="font-display text-3xl font-bold text-white">₹{event.ticketPrice}</div>
                </div>

                <button
                  onClick={() => setStep('customize')}
                  className="btn-glow px-8 py-3.5 rounded-full bg-[#F5C518] text-black font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Ticket className="w-4 h-4 text-black" />
                  <span>Choose Tickets</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CUSTOMIZE TICKET TIER & QUANTITY */}
          {step === 'customize' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Select Ticket Category</h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  Choose your level of stage immersion.
                </p>
              </div>

              {/* Ticket Tier Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* General */}
                <button
                  onClick={() => setTicketTier('general')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    ticketTier === 'general'
                      ? 'border-[#F5C518] bg-[#F5C518]/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-white">General</span>
                    <span className="font-display text-lg font-bold text-[#F5C518]">₹{event.ticketPrice}</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Standard theater entry with unobstructed stage view and audio fidelity.
                  </p>
                </button>

                {/* VIP */}
                <button
                  onClick={() => setTicketTier('vip')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    ticketTier === 'vip'
                      ? 'border-[#F5C518] bg-[#F5C518]/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1">
                      <span>VIP</span>
                      <Sparkles className="w-3 h-3 text-[#F5C518]" />
                    </span>
                    <span className="font-display text-lg font-bold text-[#F5C518]">₹{event.vipPrice}</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Reserved front 3 rows + 1 complimentary artisan mocktail/beverage.
                  </p>
                </button>

                {/* Premium */}
                <button
                  onClick={() => setTicketTier('premium')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    ticketTier === 'premium'
                      ? 'border-[#F5C518] bg-[#F5C518]/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#FFE58C]">
                      Backstage
                    </span>
                    <span className="font-display text-lg font-bold text-[#FFE58C]">₹{event.premiumPrice}</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    VIP front row + artist green room meet & greet + signed tour poster.
                  </p>
                </button>
              </div>

              {/* Quantity selector */}
              <div className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Number of Attendees</div>
                  <div className="text-[11px] text-white/50">Max 10 passes per checkout</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl glass border border-white/20 text-white font-bold hover:border-[#F5C518] transition-colors flex items-center justify-center text-base"
                  >
                    -
                  </button>
                  <span className="font-display text-xl font-bold w-6 text-center text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-9 h-9 rounded-xl glass border border-white/20 text-white font-bold hover:border-[#F5C518] transition-colors flex items-center justify-center text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Attendee Details Form */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                  Primary Attendee Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={attendee.name}
                    onChange={e => setAttendee({ ...attendee, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={attendee.email}
                    onChange={e => setAttendee({ ...attendee, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={attendee.phone}
                    onChange={e => setAttendee({ ...attendee, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#F5C518]/60"
                  />
                </div>
              </div>

              {/* Promo Coupon Applicator */}
              <div className="glass p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#F5C518]" />
                    <span>Have a Promo Code?</span>
                  </span>
                  <span className="text-[10px] text-[#F5C518] font-mono">Try SPOTLIGHT10</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. SPOTLIGHT10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs uppercase font-mono focus:outline-none focus:border-[#F5C518]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#F5C518] hover:text-black text-white text-xs font-bold uppercase transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount && (
                  <div className="text-xs text-emerald-400 font-medium">{appliedDiscount.message}</div>
                )}
                {errorMessage && (
                  <div className="text-xs text-red-400 font-medium">{errorMessage}</div>
                )}
              </div>

              {/* Order Summary Box */}
              <div className="glass-strong p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>
                    {ticketTier.toUpperCase()} Ticket ({quantity}x @ ₹{currentUnitPrice})
                  </span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Code ({couponInput})</span>
                    <span>-₹{appliedDiscount.amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>Convenience & Booking Fee</span>
                  <span className="text-emerald-400 font-medium">FREE (Launch Special)</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total Payable</span>
                  <span className="font-display text-lg gold-text">₹{finalTotal}</span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="px-5 py-3 rounded-full glass border border-white/20 text-white text-xs font-semibold uppercase hover:bg-white/5"
                >
                  Back
                </button>

                <button
                  onClick={() => {
                    if (!attendee.name.trim() || !attendee.email.trim() || !attendee.phone.trim()) {
                      setErrorMessage('Please fill in your name, email, and phone number.');
                      return;
                    }
                    setErrorMessage(null);
                    setStep('payment');
                  }}
                  className="flex-1 btn-glow py-3.5 rounded-full bg-[#F5C518] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment (₹{finalTotal})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT GATEWAY SIMULATION */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Select Payment Mode</h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  100% Secure Encrypted Sandbox Checkout
                </p>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#F5C518] bg-[#F5C518]/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <QrCode className="w-6 h-6 mx-auto mb-2 text-[#F5C518]" />
                  <div className="text-xs font-bold">UPI / QR</div>
                  <div className="text-[10px] opacity-60 mt-0.5">GPay · PhonePe · Paytm</div>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#F5C518] bg-[#F5C518]/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-[#F5C518]" />
                  <div className="text-xs font-bold">Credit / Debit</div>
                  <div className="text-[10px] opacity-60 mt-0.5">Visa · Mastercard · RuPay</div>
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#F5C518] bg-[#F5C518]/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-[#F5C518]" />
                  <div className="text-xs font-bold">Net Banking</div>
                  <div className="text-[10px] opacity-60 mt-0.5">HDFC · ICICI · SBI</div>
                </button>
              </div>

              {/* UPI Input / Card Preview */}
              {paymentMethod === 'upi' && (
                <div className="glass p-4 rounded-2xl border border-white/10 space-y-3 text-center">
                  <div className="w-32 h-32 mx-auto bg-white p-2.5 rounded-2xl shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        `upi://pay?pa=spotlightt@icici&pn=TheSpotlighttCo&am=${finalTotal}&cu=INR`
                      )}`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-white/70">
                    Scan via any UPI App or click below to simulate instant payment verification.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="glass p-4 rounded-2xl border border-white/10 space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (e.g. 4532 •••• •••• 8892)"
                    defaultValue="4532 8920 1823 8892"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08 / 29"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="782"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="glass p-4 rounded-2xl border border-white/10">
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs">
                    <option className="bg-[#111]">HDFC Bank</option>
                    <option className="bg-[#111]">State Bank of India</option>
                    <option className="bg-[#111]">ICICI Bank</option>
                    <option className="bg-[#111]">Axis Bank</option>
                    <option className="bg-[#111]">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {errorMessage && (
                <div className="text-xs text-red-400 font-medium text-center">{errorMessage}</div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('customize')}
                  disabled={isProcessing}
                  className="px-5 py-3 rounded-full glass border border-white/20 text-white text-xs font-semibold uppercase hover:bg-white/5 disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="flex-1 btn-glow py-3.5 rounded-full bg-[#F5C518] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Payment of ₹{finalTotal}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED TICKET WITH QR CODE */}
          {step === 'confirmed' && confirmedBooking && (
            <div className="text-center space-y-6 py-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                <Check className="w-8 h-8" />
              </motion.div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  You Are On Stage Tonight!
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1.5 max-w-md mx-auto">
                  A high-res digital pass has been issued and sent to{' '}
                  <strong className="text-white">{confirmedBooking.email}</strong>.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="glass-strong rounded-3xl p-6 border border-[#F5C518]/30 max-w-sm mx-auto text-left shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5C518]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-white/40 font-semibold block">
                      Booking Reference
                    </span>
                    <span className="font-mono text-base font-bold gold-text">
                      {confirmedBooking.bookingRef}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5C518]/20 text-[#F5C518] text-[10px] font-bold uppercase tracking-wider">
                    {confirmedBooking.ticketType.toUpperCase()} PASS
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-white font-semibold text-sm">{event.title}</div>
                  <div className="text-white/60">
                    {formatDate(event.startDate)} · {formatTime(event.startDate)}
                  </div>
                  <div className="text-white/60 truncate">{venue?.name || 'Kitty Su Chandigarh'}</div>
                  <div className="text-white/60 pt-1">
                    Pass Holder: <strong className="text-white">{confirmedBooking.name}</strong> ({confirmedBooking.quantity} Seat{confirmedBooking.quantity > 1 ? 's' : ''})
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="mt-4 p-3 bg-white rounded-2xl text-center shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      confirmedBooking.qrData
                    )}`}
                    alt="Ticket QR"
                    className="w-40 h-40 mx-auto object-contain"
                  />
                  <div className="text-[9px] font-mono text-black/60 mt-1 uppercase tracking-wider font-semibold">
                    Scan At Entrance · Gate Check-in
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const ticketText = `THE SPOTLIGHTT CO. PASS\nEvent: ${event.title}\nRef: ${confirmedBooking.bookingRef}\nName: ${confirmedBooking.name}\nQuantity: ${confirmedBooking.quantity}\nDate: ${event.startDate}\nVenue: ${venue?.name}`;
                    const blob = new Blob([ticketText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Spotlightt-Pass-${confirmedBooking.bookingRef}.txt`;
                    a.click();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full glass border border-white/20 hover:border-[#F5C518] text-white text-xs font-semibold uppercase flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#F5C518]" />
                  <span>Download Pass (.txt)</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto btn-glow px-8 py-3 rounded-full bg-[#F5C518] text-black font-bold text-xs uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
