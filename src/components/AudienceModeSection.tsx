import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useSpotlight } from '../context/SpotlightContext';
import { EventItem } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Ticket,
  Heart,
  ArrowRight,
  Filter,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface AudienceModeSectionProps {
  onBookEvent: (event: EventItem) => void;
}

export const AudienceModeSection: React.FC<AudienceModeSectionProps> = ({ onBookEvent }) => {
  const { events, categories, selectedCity, likeEvent, venues } = useSpotlight();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popular'>('date');

  // Venue map helper
  const venueMap = useMemo(() => {
    return Object.fromEntries(venues.map(v => [v.id, v]));
  }, [venues]);

  // Category map helper
  const categoryMap = useMemo(() => {
    return Object.fromEntries(categories.map(c => [c.id, c]));
  }, [categories]);

  // Filtered & Sorted events
  const filteredEvents = useMemo(() => {
    return events
      .filter(ev => {
        // City match
        if (ev.cityId !== selectedCity.id) return false;
        // Category match
        if (selectedCategory !== 'all' && ev.categoryId !== selectedCategory) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const venue = venueMap[ev.venueId]?.name || '';
          const guests = ev.guestArtists.join(' ').toLowerCase();
          const match =
            ev.title.toLowerCase().includes(q) ||
            ev.description.toLowerCase().includes(q) ||
            ev.host.toLowerCase().includes(q) ||
            venue.toLowerCase().includes(q) ||
            guests.includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return a.ticketPrice - b.ticketPrice;
        if (sortBy === 'popular') return (b.likesCount || 0) - (a.likesCount || 0);
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [events, selectedCity.id, selectedCategory, searchQuery, sortBy, venueMap]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <section id="events-section" className="relative py-24 sm:py-32 bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em] mb-3">
              <Ticket className="w-3.5 h-3.5" />
              <span>Upcoming Live Experiences</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Tonight, You <span className="gold-text">Belong</span> Here.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/60 font-light max-w-xl">
              Curated stand-up specials, poetry evenings, and intimate indie concerts in {selectedCity.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass px-4 py-2 rounded-2xl border border-white/10 text-right">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Active Region</div>
              <div className="text-sm font-semibold text-white flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedCity.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="glass-strong rounded-2xl p-4 sm:p-5 border border-white/10 mb-10 space-y-4">
          {/* Search bar + Sort selector */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search by artist, venue, show title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#F5C518]/60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'date' | 'price' | 'popular')}
                className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#F5C518]/60"
              >
                <option value="date" className="bg-[#111]">Soonest Date</option>
                <option value="price" className="bg-[#111]">Lowest Price</option>
                <option value="popular" className="bg-[#111]">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Shows ({events.filter(e => e.cityId === selectedCity.id).length})
            </button>

            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              const count = events.filter(e => e.cityId === selectedCity.id && e.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 border ${
                    isSelected
                      ? 'text-white border shadow-lg'
                      : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${cat.themeColor}22` : undefined,
                    borderColor: isSelected ? cat.themeColor : undefined,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/10 max-w-lg mx-auto">
            <Ticket className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-white">No shows match your query</h3>
            <p className="mt-2 text-sm text-white/60">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-6 px-5 py-2 rounded-full bg-[#F5C518] text-black text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredEvents.map((ev, idx) => {
              const cat = categoryMap[ev.categoryId];
              const venue = venueMap[ev.venueId];
              const themeColor = cat?.themeColor || '#F5C518';
              const soldPct = Math.round(
                ((ev.maxAudience - ev.remainingSeats) / ev.maxAudience) * 100
              );

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-3xl overflow-hidden glass border border-white/10 hover:border-white/25 flex flex-col justify-between transition-all duration-500 shadow-xl"
                >
                  {/* Top Poster Image */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={ev.poster}
                      alt={ev.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/50" />

                    {/* Category pill */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-bold text-black uppercase tracking-wider shadow-md backdrop-blur-md"
                        style={{ backgroundColor: themeColor }}
                      >
                        {cat?.name || 'Live Show'}
                      </span>
                    </div>

                    {/* Like button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        likeEvent(ev.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full glass border border-white/20 text-white/80 hover:text-red-400 hover:border-red-400/40 transition-colors flex items-center gap-1 text-xs"
                      title="Cheer for this show"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{ev.likesCount || 0}</span>
                    </button>

                    {/* Date Tag */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                      <div className="inline-flex items-center gap-1.5 glass px-2.5 py-1 rounded-lg border border-white/15 backdrop-blur-md">
                        <Calendar className="w-3.5 h-3.5 text-[#F5C518]" />
                        <span className="font-medium">{formatDate(ev.startDate)}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 glass px-2.5 py-1 rounded-lg border border-white/15 backdrop-blur-md">
                        <Clock className="w-3.5 h-3.5 text-[#F5C518]" />
                        <span>{formatTime(ev.startDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-[#FFE58C] transition-colors">
                        {ev.title}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm text-white/65 line-clamp-2 font-light leading-relaxed">
                        {ev.description}
                      </p>

                      {/* Venue & Host */}
                      <div className="mt-4 space-y-1.5 text-xs text-white/70">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          <span className="truncate">{venue?.name || 'Chandigarh Stage'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          <span className="truncate">Hosted by <strong className="text-white">{ev.host}</strong></span>
                        </div>
                      </div>

                      {/* Guest Artists Tag */}
                      {ev.guestArtists && ev.guestArtists.length > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                          {ev.guestArtists.map(artist => (
                            <span
                              key={artist}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80"
                            >
                              ★ {artist}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Booking Row & Seat Progress */}
                    <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                      {/* Seat indicator */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">Seats Filling Fast</span>
                        <span className="font-semibold text-white/90">
                          {ev.remainingSeats} / {ev.maxAudience} remaining
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${soldPct}%`,
                            background: `linear-gradient(to right, ${themeColor}, ${themeColor}88)`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-white/40">From</div>
                          <div className="font-display text-2xl font-bold text-white">
                            ₹{ev.ticketPrice}
                          </div>
                        </div>

                        <button
                          onClick={() => onBookEvent(ev)}
                          className="btn-glow px-5 py-2.5 rounded-full text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
                          style={{ backgroundColor: themeColor }}
                        >
                          <span>Book Tickets</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
