import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Instagram, Mic2, Star } from 'lucide-react';

const ARTISTS = [
  {
    id: 'a1',
    name: 'Kanan Gill',
    role: 'Resident Headliner · Stand-up Comedy',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85',
    bio: 'Touring nationally with his brand-new hour. Frequent guest judge at Spotlightt Open Mics.',
    showsCount: 14,
    rating: 4.9,
    tag: 'COMEDY ICON',
    tagColor: '#F5C518',
  },
  {
    id: 'a2',
    name: 'Priya Malik',
    role: 'Curator & Spoken Word Poet',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=srgb&fm=jpg&q=85',
    bio: 'Leading the poetry revolution across North India with raw, unapologetic lyrical storytelling.',
    showsCount: 22,
    rating: 5.0,
    tag: 'SPOKEN WORD',
    tagColor: '#38BDF8',
  },
  {
    id: 'a3',
    name: 'Prateek Kuhad',
    role: 'Guest Headliner · Indie Songwriter',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85',
    bio: 'Pioneering intimate acoustic concerts under our signature purple spotlight sessions.',
    showsCount: 8,
    rating: 4.9,
    tag: 'INDIE MUSIC',
    tagColor: '#A855F7',
  },
  {
    id: 'a4',
    name: 'DIVINE',
    role: 'Cypher Mentor · Hip-Hop Showcase',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=srgb&fm=jpg&q=85',
    bio: 'Judging Chandigarh’s breakthrough rap battles and mentoring young underground emcees.',
    showsCount: 6,
    rating: 5.0,
    tag: 'RAP & CYPHERS',
    tagColor: '#EF4444',
  },
];

export const FeaturedArtistsSection: React.FC = () => {
  return (
    <section id="artists-section" className="relative py-24 sm:py-32 bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold text-[#F5C518] uppercase tracking-[0.25em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Lineup</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Masters Of The <span className="gold-text">Craft</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/60 font-light leading-relaxed">
            From India’s most celebrated headline acts to the hottest emerging underground stars, experience artists performing in their truest element.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ARTISTS.map((artist, idx) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl overflow-hidden glass border border-white/10 hover:border-white/25 flex flex-col justify-between transition-all duration-500 shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={artist.img}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-black uppercase tracking-wider shadow-md"
                    style={{ backgroundColor: artist.tagColor }}
                  >
                    {artist.tag}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-[#F5C518] text-xs mb-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{artist.rating} · {artist.showsCount} Shows</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white leading-tight">
                    {artist.name}
                  </h3>
                  <div className="text-xs text-white/70 font-medium">{artist.role}</div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-white/60 font-light leading-relaxed">
                  {artist.bio}
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#F5C518]">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Resident Mentor</span>
                  <Mic2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
