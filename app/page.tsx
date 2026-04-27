/**
 * app/page.tsx
 *
 * The root page. Renders the six sections of the portfolio in order:
 *   01 — Hero
 *   02 — Metrics wall
 *   03 — Case studies (scrollytelling)
 *   04 — Ask Hamid (live Gemini chat)
 *   05 — Off-duty (photos, chess, case study tracker)
 *   06 — Contact + colophon
 *
 * Each section is a self-contained client component with its own animations,
 * state, and styles (via styled-jsx). They share design tokens through the
 * CSS variables defined in app/globals.css.
 */

import HeroSection from '@/components/HeroSection';
import MetricsWall from '@/components/MetricsWall';
import CaseStudyScrollytell from '@/components/CaseStudyScrollytell';
import AskHamidChat from '@/components/AskHamidChat';
import OffDutySection from '@/components/OffDutySection';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MetricsWall />
      <CaseStudyScrollytell />
      <AskHamidChat />
      <OffDutySection />
      <ContactSection />
    </main>
  );
}
