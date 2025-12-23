import HomepageNavbar from '@/components/homepage/HomepageNavbar';
import HomepageFooter from '@/components/homepage/HomepageFooter';
import FuturisticHero from '@/components/landing/FuturisticHero';
import AIBrainWidget from '@/components/landing/AIBrainWidget';
import ValueBadgeBar from '@/components/landing/ValueBadgeBar';
import MasterCategoryWall from '@/components/landing/MasterCategoryWall';
import TrendingDemoShowcase from '@/components/landing/TrendingDemoShowcase';
import DemoFilterBar from '@/components/landing/DemoFilterBar';
import ValueSlider from '@/components/landing/ValueSlider';
import WorldMapPanel from '@/components/landing/WorldMapPanel';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] overflow-x-hidden">
      {/* Navigation */}
      <HomepageNavbar />
      
      {/* Hero Section */}
      <FuturisticHero />
      
      {/* World Map Panel - Global Network */}
      <WorldMapPanel />
      
      {/* Value Badge Bar */}
      <ValueBadgeBar />
      
      {/* Master Category Wall - 40 Categories */}
      <MasterCategoryWall />
      
      {/* Demo Filter Bar */}
      <DemoFilterBar />
      
      {/* Trending Demo Showcase */}
      <TrendingDemoShowcase />
      
      {/* Value Slider Ticker */}
      <ValueSlider />
      
      {/* Footer */}
      <HomepageFooter />
      
      {/* AI Brain Widget - Floating */}
      <AIBrainWidget />
    </div>
  );
};

export default Homepage;
