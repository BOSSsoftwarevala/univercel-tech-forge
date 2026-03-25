import { motion } from 'framer-motion';
import FranchiseHero from '@/components/franchise-landing/FranchiseHero';
import ValuePropositionCards from '@/components/franchise-landing/ValuePropositionCards';
import EarningModel from '@/components/franchise-landing/EarningModel';
import FeaturesHexGrid from '@/components/franchise-landing/FeaturesHexGrid';
import DashboardPreview from '@/components/franchise-landing/DashboardPreview';
import ApplicationProcess from '@/components/franchise-landing/ApplicationProcess';
import FranchiseCTA from '@/components/franchise-landing/FranchiseCTA';
import FranchiseLandingNav from '@/components/franchise-landing/FranchiseLandingNav';
import FranchiseLandingFooter from '@/components/franchise-landing/FranchiseLandingFooter';
import ParticleBackground from '@/components/homepage/ParticleBackground';

const FranchiseLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(222,47%,4%)] via-[hsl(217,50%,8%)] to-[hsl(220,55%,6%)] overflow-x-hidden">
      <ParticleBackground />
      <FranchiseLandingNav />
      <FranchiseHero />
      <ValuePropositionCards />
      <EarningModel />
      <FeaturesHexGrid />
      <DashboardPreview />
      <ApplicationProcess />
      <FranchiseCTA />
      <FranchiseLandingFooter />
    </div>
  );
};

export default FranchiseLanding;
