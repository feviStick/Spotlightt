import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpotlight } from '../context/SpotlightContext';
import {
  X,
  Shield,
  QrCode,
  Users,
  Ticket,
  DollarSign,
  Check,
  AlertCircle,
  Plus,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Search,
} from 'lucide-react';

export const AdminPortalModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminStats,
    bookings,
    registrations,
    events,
    categories,
    venues,
    selectedCity,
    adminCheckInBooking,
    adminApprovePerformer,
    adminRejectPerformer,
    adminAddEvent,
  } = useSpotlight();

  const [activeTab, setActiveTab] = useState<'overview' | 'checkin' | 'performers' | 'bookings' | 'addevent'>('overview');
  const [qrInput, setQrInput] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string } | null>(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    slug: '',
    description: '',
    categoryId: categories[0]?.id || 'comedy',
    cityId: selectedCity.id,
    venueId: venues[0]?.id || 'v1',
    host: 'The Spotlightt Co.',
    guestArtists: 'Jaspreet Singh, Aakash Mehta',
    startDate: '2026-10-18T20:00:00Z',
    endDate: '2026-10-18T22:30:00Z',
    registrationOpens: '2026-08-01T00:00:00Z',
    registrationCloses: '2026-10-16T23:59:00Z',
    poster: 'https://images.unsplash.com/photo-1512830414785-9928e23475dc?crop=entropy&cs=srgb&fm=jpg&q=85',
    ticketPrice: 399,
    vipPrice: 799,
    premiumPrice: 1299,
    registrationFee: 249,
    maxAudience: 200,
    maxPerformers: 10,
    featured: true,
  });
  const [eventCreatedNotice, setEventCreatedNotice] = useState(false);

  if (!isAdminOpen) return null;

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    const res = adminCheckInBooking(qrInput);
    setCheckInResult({ success: res.success, message: res.message });
    setQrInput('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    adminAddEvent({
      ...newEvent,
      slug: newEvent.title.toLowerCase().replace(/\s+/g, '-'),
      guestArtists: newEvent.guestArtists.split(',').map(s => s.trim()).filter(Boolean),
    });

    setEventCreatedNotice(true);
    setTimeout(() => {
      setEventCreatedNotice(false);
      setActiveTab('overview');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-[#0c0c0c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#141414] via-[#0c0c0c] to-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5C518]/15 border border-[#F5C518]/30 flex items-center justify-center text-[#F5C518]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Organizer Control Panel
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  LIVE ENGINE
                </span>
              </div>
              <p className="text-xs text-white/50">
                The Spotlightt Co. · Real-time tickets, artist approvals, & gate scanner
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2.5 rounded-full glass border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/10 bg-white/5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: <DollarSign className="w-3.5 h-3.5" /> },
            { id: 'checkin', label: 'Gate QR Scanner', icon: <QrCode className="w-3.5 h-3.5" /> },
            { id: 'performers', label: `Artists (${registrations.length})`, icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: <Ticket className="w-3.5 h-3.5" /> },
            { id: 'addevent', label: '+ Add New Show', icon: <Plus className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#F5C518] text-black font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content with Scroll */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl border border-white/10">
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mb-1">
                    Total Revenue
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold gold-text">
                    ₹{adminStats.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-medium">
                    100% Mock Razorpay Collected
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/10">
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mb-1">
                    Total Bookings
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {adminStats.totalBookings}
                  </div>
                  <div className="text-[10px] text-white/50 mt-1">Confirmed Audiences</div>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/10">
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mb-1">
                    Performer Apps
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[#38BDF8]">
                    {adminStats.totalPerformerRegistrations}
                  </div>
                  <div className="text-[10px] text-white/50 mt-1">Across 8 Categories</div>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/10">
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mb-1">
                    Active Shows
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[#A855F7]">
                    {adminStats.activeEventsCount}
                  </div>
                  <div className="text-[10px] text-white/50 mt-1">{selectedCity.name} Hub</div>
                </div>
              </div>

              {/* Recent Activity Mini Tables */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="glass rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Recent Audience Bookings
                    </h4>
                    <span className="text-[10px] text-[#F5C518]">Live Sync</span>
                  </div>

                  <div className="space-y-2">
                    {bookings.slice(0, 4).map(b => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{b.name}</div>
                          <div className="text-[10px] text-white/50">
                            {b.bookingRef} · {b.quantity}x {b.ticketType.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#F5C518]">₹{b.amount}</div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                              b.status === 'checked_in'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-white/10 text-white/70'
                            }`}
                          >
                            {b.status === 'checked_in' ? 'Checked In' : 'Confirmed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Artist Applications */}
                <div className="glass rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Recent Performer Submissions
                    </h4>
                    <span className="text-[10px] text-[#38BDF8]">Stage Queue</span>
                  </div>

                  <div className="space-y-2">
                    {registrations.slice(0, 4).map(r => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl bg-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{r.name}</div>
                          <div className="text-[10px] text-white/50 truncate max-w-[180px]">
                            {r.title} ({r.language})
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                            {r.applicationStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GATE QR / REF CHECK-IN SCANNER */}
          {activeTab === 'checkin' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <QrCode className="w-12 h-12 text-[#F5C518] mx-auto" />
                <h3 className="font-display text-2xl font-bold text-white">
                  Gate Check-In & Scanner
                </h3>
                <p className="text-xs text-white/60">
                  Scan QR code or enter booking reference ID to validate admission and prevent duplicate entries.
                </p>
              </div>

              <form onSubmit={handleCheckIn} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Booking Ref (e.g. SPT849201)..."
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white font-mono text-sm uppercase focus:outline-none focus:border-[#F5C518]"
                />
                <button
                  type="submit"
                  className="btn-glow px-6 py-3 rounded-2xl bg-[#F5C518] text-black font-bold text-xs uppercase tracking-wider"
                >
                  Verify Ticket
                </button>
              </form>

              {/* Sample QR Codes to quick click */}
              <div className="glass p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <span className="text-white/40 block text-[10px] uppercase font-semibold">
                  Quick-Test Sample Passes in Memory:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {bookings.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setQrInput(b.bookingRef);
                        const res = adminCheckInBooking(b.bookingRef);
                        setCheckInResult({ success: res.success, message: res.message });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#F5C518] hover:text-black font-mono text-[11px] transition-colors"
                    >
                      {b.bookingRef} ({b.name})
                    </button>
                  ))}
                </div>
              </div>

              {/* Check-In Response */}
              {checkInResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border flex items-center gap-3 text-sm ${
                    checkInResult.success
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/15 border-red-500/30 text-red-300'
                  }`}
                >
                  {checkInResult.success ? (
                    <Check className="w-6 h-6 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold">
                      {checkInResult.success ? 'VALID PASS — ACCESS GRANTED' : 'CHECK-IN ALERT'}
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">{checkInResult.message}</div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* TAB 3: ARTIST APPLICATIONS */}
          {activeTab === 'performers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-white">
                  Performer Roster & Applications
                </h3>
                <span className="text-xs text-white/50">{registrations.length} total registered</span>
              </div>

              <div className="space-y-3">
                {registrations.map(reg => (
                  <div
                    key={reg.id}
                    className="glass p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{reg.name}</span>
                        <span className="text-xs text-[#F5C518]">{reg.instagram}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            reg.applicationStatus === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : reg.applicationStatus === 'rejected'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {reg.applicationStatus}
                        </span>
                      </div>
                      <div className="text-xs text-white/70">
                        Act: <em>&ldquo;{reg.title}&rdquo;</em> · {reg.language} · {reg.duration} Mins
                      </div>
                      <div className="text-[11px] text-white/50">
                        {reg.email} · {reg.phone} · Experience: {reg.experience}
                      </div>
                      {reg.assignedSlot && (
                        <div className="text-[10px] text-emerald-400 font-semibold">
                          Assigned: {reg.assignedSlot}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {reg.applicationStatus !== 'approved' && (
                        <button
                          onClick={() => adminApprovePerformer(reg.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold"
                        >
                          Approve
                        </button>
                      )}
                      {reg.applicationStatus !== 'rejected' && (
                        <button
                          onClick={() => adminRejectPerformer(reg.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      )}
                      <a
                        href={reg.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl glass text-white/60 hover:text-[#F5C518]"
                        title="View Certificate URL"
                      >
                        <Award className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BOOKINGS ROSTER */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-white">
                  Audience Tickets & Passes
                </h3>
                <span className="text-xs text-white/50">{bookings.length} passes issued</span>
              </div>

              <div className="space-y-3">
                {bookings.map(b => (
                  <div
                    key={b.id}
                    className="glass p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#F5C518] text-sm">
                          {b.bookingRef}
                        </span>
                        <span className="font-bold text-white">{b.name}</span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 font-semibold uppercase text-[9px]">
                          {b.ticketType}
                        </span>
                      </div>
                      <div className="text-white/60 text-[11px] mt-0.5">
                        {b.email} · {b.phone} · {b.quantity} seat{b.quantity > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-white text-sm">₹{b.amount}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold uppercase">
                          {b.paymentStatus} via {b.paymentMethod.toUpperCase()}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {b.status === 'checked_in' ? 'Checked In' : 'Valid'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ADD NEW SHOW */}
          {activeTab === 'addevent' && (
            <form onSubmit={handleCreateEvent} className="space-y-4 max-w-2xl mx-auto">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Create New Live Show</h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  New shows will instantly publish to the homepage and event filters.
                </p>
              </div>

              {eventCreatedNotice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center"
                >
                  Show created & published live! Redirecting...
                </motion.div>
              )}

              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                  Show Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Storytelling Showcase #3"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C518]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Category
                  </label>
                  <select
                    value={newEvent.categoryId}
                    onChange={e => setNewEvent({ ...newEvent, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#111]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Venue
                  </label>
                  <select
                    value={newEvent.venueId}
                    onChange={e => setNewEvent({ ...newEvent, venueId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  >
                    {venues.map(v => (
                      <option key={v.id} value={v.id} className="bg-[#111]">
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Host
                  </label>
                  <input
                    type="text"
                    value={newEvent.host}
                    onChange={e => setNewEvent({ ...newEvent, host: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    General Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newEvent.ticketPrice}
                    onChange={e => setNewEvent({ ...newEvent, ticketPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    VIP Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newEvent.vipPrice}
                    onChange={e => setNewEvent({ ...newEvent, vipPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                    Performer Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={newEvent.registrationFee}
                    onChange={e => setNewEvent({ ...newEvent, registrationFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1 block">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Atmospheric summary of the show..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-glow py-3 rounded-full bg-[#F5C518] text-black font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Publish Show Live
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
