/**
 * app/page.tsx
 *
 * Home. Order follows the FDE "depth over volume" structure: the hero and
 * AskOrb, what I work with, Experience (LexTrack, the one deployment with
 * real users), the three featured projects, earlier work in a quieter list,
 * then detail shots, the statement, measured impact, capabilities with
 * proof links, and off-duty.
 */

import HeroSection from '@/components/home/HeroSection';
import SkillMarquee from '@/components/home/SkillMarquee';
import Experience from '@/components/home/Experience';
import SelectedWork from '@/components/home/SelectedWork';
import EarlierWork from '@/components/home/EarlierWork';
import DragGallery from '@/components/home/DragGallery';
import ScrollStatement from '@/components/home/ScrollStatement';
import ImpactStrip from '@/components/home/ImpactStrip';
import Capabilities from '@/components/home/Capabilities';
import OffDuty from '@/components/home/OffDuty';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillMarquee />
      <Experience />
      <SelectedWork />
      <EarlierWork />
      <DragGallery />
      <ScrollStatement />
      <ImpactStrip />
      <Capabilities />
      <OffDuty />
    </>
  );
}
