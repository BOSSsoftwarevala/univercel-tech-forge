import { motion } from 'framer-motion';
import HomepageNavbar from '@/components/homepage/HomepageNavbar';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesGrid from '@/components/homepage/FeaturesGrid';
import IndustryModules from '@/components/homepage/IndustryModules';
import HologramInfographic from '@/components/homepage/HologramInfographic';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import CTASection from '@/components/homepage/CTASection';
import HomepageFooter from '@/components/homepage/HomepageFooter';
import ParticleBackground from '@/components/homepage/ParticleBackground';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(222,47%,4%)] via-[hsl(220,50%,8%)] to-[hsl(225,55%,6%)] overflow-x-hidden">
      {/* Animated Background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <HomepageNavbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Grid */}
      <FeaturesGrid />
      
      {/* Hologram Infographic */}
      <HologramInfographic />
      
      {/* Industry Modules */}
      <IndustryModules />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <HomepageFooter />
    </div>
  );
};

export default Homepage;
