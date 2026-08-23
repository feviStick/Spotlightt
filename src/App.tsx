/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { SpotlightProvider, useSpotlight } from './context/SpotlightContext';
import { CinematicLoader } from './components/CinematicLoader';
import { SpotlightCursor } from './components/SpotlightCursor';
import { CinematicNav } from './components/CinematicNav';
import { HeroCarousel } from './components/HeroCarousel';
import { SplitExperience } from './components/SplitExperience';
import { AudienceModeSection } from './components/AudienceModeSection';
import { PerformerModeSection } from './components/PerformerModeSection';
import { FeaturedArtistsSection } from './components/FeaturedArtistsSection';
import { WhySpotlighttSection } from './components/WhySpotlighttSection';
import { MomentsGallerySection } from './components/MomentsGallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { VIPNewsletterSection } from './components/VIPNewsletterSection';
import { Footer } from './components/Footer';
import { EventModal } from './components/EventModal';
import { PerformerModal } from './components/PerformerModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { EventItem, Category } from './types';

const SpotlightAppContent: React.FC = () => {
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<Category | null>(null);

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-white selection:bg-[#F5C518] selection:text-black font-sans antialiased overflow-x-hidden">
      {/* 1. Cinematic Intro Screen */}
      <CinematicLoader />

      {/* 2. Dynamic Ambient Spotlight Cursor */}
      <SpotlightCursor />

      {/* 3. Sticky Luxury Navigation */}
      <CinematicNav onScrollTo={handleScrollTo} />

      <main className="relative z-10">
        {/* 4. Cinematic Rotating Hero Carousel */}
        <HeroCarousel
          onExploreEvents={() => handleScrollTo('events-section')}
          onRegisterPerformer={() => handleScrollTo('perform-section')}
        />

        {/* 5. Split-Screen Performer vs Audience Mode Switcher */}
        <SplitExperience
          onSelectAudience={() => handleScrollTo('events-section')}
          onSelectPerformer={() => handleScrollTo('perform-section')}
        />

        {/* 6. Audience Mode: Live Event Discovery & Booking */}
        <AudienceModeSection
          onBookEvent={(event) => setSelectedEventForModal(event)}
        />

        {/* 7. Performer Mode: Artist Category Stages & Registration */}
        <PerformerModeSection
          onSelectCategory={(category) => setSelectedCategoryForModal(category)}
        />

        {/* 8. Featured Headline Artists & Mentors */}
        <FeaturedArtistsSection />

        {/* 9. Why Spotlightt: Bento Grid Standard */}
        <WhySpotlighttSection />

        {/* 10. Moments Gallery & Photo Archive with Lightbox */}
        <MomentsGallerySection />

        {/* 11. Testimonials & Audience Community */}
        <TestimonialsSection />

        {/* 12. Categorized FAQs */}
        <FAQSection />

        {/* 13. VIP Newsletter & Contact Partner Form */}
        <VIPNewsletterSection />
      </main>

      {/* 14. Luxury Footer */}
      <Footer onScrollTo={handleScrollTo} />

      {/* Interactive Modals */}
      <AnimatePresence>
        {selectedEventForModal && (
          <EventModal
            event={selectedEventForModal}
            onClose={() => setSelectedEventForModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCategoryForModal && (
          <PerformerModal
            category={selectedCategoryForModal}
            onClose={() => setSelectedCategoryForModal(null)}
          />
        )}
      </AnimatePresence>

      <AdminPortalModal />
    </div>
  );
};

export default function App() {
  return (
    <SpotlightProvider>
      <SpotlightAppContent />
    </SpotlightProvider>
  );
}
