import { motion } from 'framer-motion';
import ResellerHero from '@/components/reseller-landing/ResellerHero';
import ResellerBenefits from '@/components/reseller-landing/ResellerBenefits';
import CommissionSimulator from '@/components/reseller-landing/CommissionSimulator';
import SellingTools from '@/components/reseller-landing/SellingTools';
import ResellerDashboardPreview from '@/components/reseller-landing/ResellerDashboardPreview';
import LeadFlowSystem from '@/components/reseller-landing/LeadFlowSystem';
import ResellerCTA from '@/components/reseller-landing/ResellerCTA';
import ResellerNav from '@/components/reseller-landing/ResellerNav';
import ResellerFooter from '@/components/reseller-landing/ResellerFooter';
import ParticleBackground from '@/components/homepage/ParticleBackground';

const ResellerLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(222,47%,4%)] via-[hsl(220,50%,7%)] to-[hsl(217,55%,5%)] overflow-x-hidden">
      <ParticleBackground />
      <ResellerNav />
      <ResellerHero />
      <ResellerBenefits />
      <CommissionSimulator />
      <SellingTools />
      <ResellerDashboardPreview />
      <LeadFlowSystem />
      <ResellerCTA />
      <ResellerFooter />
    </div>
  );
};

export default ResellerLanding;
