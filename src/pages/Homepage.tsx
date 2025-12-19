import HomepageNavbar from '@/components/homepage/HomepageNavbar';
import HomepageFooter from '@/components/homepage/HomepageFooter';
import FuturisticHero from '@/components/landing/FuturisticHero';
import AIBrainWidget from '@/components/landing/AIBrainWidget';
import ValueBadgeBar from '@/components/landing/ValueBadgeBar';
import CategoryGrid from '@/components/landing/CategoryGrid';
import TrendingDemoShowcase from '@/components/landing/TrendingDemoShowcase';
import DemoFilterBar from '@/components/landing/DemoFilterBar';
import ValueSlider from '@/components/landing/ValueSlider';
import RoleInvitePanel from '@/components/landing/RoleInvitePanel';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] overflow-x-hidden">
      {/* Navigation */}
      <HomepageNavbar />
      
      {/* Hero Section */}
      <FuturisticHero />
      
      {/* Value Badge Bar */}
      <ValueBadgeBar />
      
      {/* Category Grid - 40 Categories */}
      <CategoryGrid />
      
      {/* Demo Filter Bar */}
      <DemoFilterBar />
      
      {/* Trending Demo Showcase */}
      <TrendingDemoShowcase />
      
      {/* Value Slider Ticker */}
      <ValueSlider />
      
      {/* Role Invite Panel */}
      <RoleInvitePanel />
      
      {/* Footer */}
      <HomepageFooter />
      
      {/* AI Brain Widget - Floating */}
      <AIBrainWidget />
    </div>
  );
};

export default Homepage;
