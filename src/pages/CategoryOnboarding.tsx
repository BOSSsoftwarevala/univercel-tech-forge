import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, MessageCircle, GitCompare, ExternalLink, Star,
  Shield, Code, Building2, Users, Crown, Check, Sparkles, Brain,
  Globe, Clock, RefreshCcw, Lock
} from 'lucide-react';

// Category data mapping
const categoryData: Record<string, { name: string; description: string; icon: string }> = {
  'pos-billing': { name: 'POS & Billing', description: 'Complete point of sale and billing solutions', icon: '💳' },
  'education': { name: 'Education', description: 'School, college, and e-learning platforms', icon: '🎓' },
  'real-estate': { name: 'Real Estate', description: 'Property management and listing solutions', icon: '🏠' },
  'ecommerce': { name: 'E-Commerce', description: 'Online store and marketplace platforms', icon: '🛒' },
  'healthcare': { name: 'Healthcare', description: 'Hospital and clinic management systems', icon: '🏥' },
  'manufacturing': { name: 'Manufacturing', description: 'ERP and production management', icon: '🏭' },
  'restaurant': { name: 'Restaurant', description: 'POS, delivery, and reservation systems', icon: '🍽️' },
  'automotive': { name: 'Automotive', description: 'Dealership and service management', icon: '🚗' },
  'travel': { name: 'Travel & Tourism', description: 'Booking and tour management', icon: '✈️' },
  'home-services': { name: 'Home Services', description: 'Service booking and management', icon: '🏠' },
  'professional': { name: 'Professional Services', description: 'Law, accounting, and consulting', icon: '💼' },
  'fitness': { name: 'Fitness & Gym', description: 'Gym and wellness management', icon: '💪' },
  'salon-spa': { name: 'Salon & Spa', description: 'Beauty and wellness booking', icon: '💇' },
  'photography': { name: 'Photography', description: 'Studio and event management', icon: '📷' },
  'entertainment': { name: 'Entertainment', description: 'Events and ticketing', icon: '🎭' },
  'gaming': { name: 'Gaming', description: 'Esports and arcade management', icon: '🎮' },
  'publishing': { name: 'Publishing', description: 'News and content platforms', icon: '📰' },
  'agriculture': { name: 'Agriculture', description: 'Farm and agritech solutions', icon: '🌾' },
  'finance': { name: 'Finance & Banking', description: 'Banking and fintech solutions', icon: '🏦' },
  'legal': { name: 'Legal', description: 'Law firm and contract management', icon: '⚖️' },
  'media': { name: 'Media & OTT', description: 'Streaming and media platforms', icon: '📺' },
  'telecom': { name: 'Telecom', description: 'ISP and telecom management', icon: '📡' },
  'news': { name: 'News Portal', description: 'News and magazine platforms', icon: '📰' },
  'fashion': { name: 'Fashion', description: 'Fashion retail and e-commerce', icon: '👗' },
  'jewelry': { name: 'Jewelry', description: 'Jewelry retail and custom orders', icon: '💎' },
  'cafe': { name: 'Cafe & Bakery', description: 'Cafe and bakery management', icon: '☕' },
  'nightlife': { name: 'Nightlife', description: 'Bar and club management', icon: '🍸' },
  'childcare': { name: 'Childcare', description: 'Daycare and preschool management', icon: '👶' },
  'pets': { name: 'Pet Services', description: 'Pet care and veterinary', icon: '🐕' },
  'florist': { name: 'Florist', description: 'Flower shop and events', icon: '🌸' },
  'art-design': { name: 'Art & Design', description: 'Gallery and design studio', icon: '🎨' },
  'construction': { name: 'Construction', description: 'Project and contractor management', icon: '🏗️' },
  'maintenance': { name: 'Maintenance', description: 'Service and repair management', icon: '🔧' },
  'logistics': { name: 'Logistics', description: 'Shipping and fleet management', icon: '🚚' },
  'marine': { name: 'Marine', description: 'Charter and marina management', icon: '🚢' },
  'transport': { name: 'Transport', description: 'Taxi and rideshare platforms', icon: '🚕' },
  'sports': { name: 'Sports', description: 'Club and academy management', icon: '⚽' },
  'adventure': { name: 'Adventure', description: 'Adventure tourism and activities', icon: '🏔️' },
  'events': { name: 'Events', description: 'Event planning and management', icon: '🎪' },
  'insurance': { name: 'Insurance', description: 'Insurance management systems', icon: '☂️' },
};

const CategoryOnboarding = () => {
  const { category } = useParams<{ category: string }>();
  const [selectedTech, setSelectedTech] = useState('All');
  
  const catInfo = categoryData[category || ''] || { 
    name: 'Category', 
    description: 'Explore our solutions',
    icon: '📦'
  };

  // Mock demos for the category
  const demos = [
    { id: 1, title: `${catInfo.name} Pro`, tech: 'React/Node', rating: 4.9, views: 2847, featured: true },
    { id: 2, title: `${catInfo.name} Starter`, tech: 'PHP/MySQL', rating: 4.7, views: 1923, featured: false },
    { id: 3, title: `${catInfo.name} Enterprise`, tech: 'Java/Spring', rating: 4.8, views: 3156, featured: true },
    { id: 4, title: `${catInfo.name} Basic`, tech: 'Vue/Laravel', rating: 4.6, views: 1567, featured: false },
    { id: 5, title: `${catInfo.name} Advanced`, tech: 'React/Node', rating: 4.8, views: 2341, featured: false },
    { id: 6, title: `${catInfo.name} Multi-Branch`, tech: 'React/Python', rating: 4.7, views: 2089, featured: true },
    { id: 7, title: `${catInfo.name} Cloud`, tech: 'Next.js/Node', rating: 4.9, views: 2654, featured: false },
    { id: 8, title: `${catInfo.name} Mobile`, tech: 'React Native', rating: 4.5, views: 1432, featured: false },
    { id: 9, title: `${catInfo.name} Lite`, tech: 'PHP/MySQL', rating: 4.4, views: 987, featured: false },
  ];

  const techFilters = ['All', 'React/Node', 'PHP/MySQL', 'Java/Spring', 'Vue/Laravel', 'Next.js/Node'];

  const filteredDemos = selectedTech === 'All' 
    ? demos 
    : demos.filter(d => d.tech === selectedTech);

  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with circuit pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,25%,6%)] to-[hsl(220,20%,4%)]" />
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="onboardCircuit" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M0 40 L35 40 M45 40 L80 40 M40 0 L40 35 M40 45 L40 80" 
                      stroke="hsl(210 100% 55%)" strokeWidth="0.5" fill="none"/>
                <circle cx="40" cy="40" r="5" fill="none" stroke="hsl(45 100% 50%)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#onboardCircuit)"/>
          </svg>
        </div>

        {/* Neon border lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-50" />

        <div className="container relative mx-auto px-4">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Category icon hologram */}
            <div className="text-6xl mb-6 animate-float">{catInfo.icon}</div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 40px hsl(210 100% 55% / 0.3)' }}>
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]">
                {catInfo.name}
              </span>{' '}
              Solutions
            </h1>
            
            <p className="text-xl text-slate-300 mb-6">{catInfo.description}</p>
            
            {/* Value proposition */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(45,100%,50%)/0.1] border border-[hsl(45,100%,50%)/0.3]">
                <Check className="w-4 h-4 text-[hsl(45,100%,50%)]" />
                <span className="text-sm text-[hsl(45,100%,50%)]">Fixed Price</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(210,100%,55%)/0.1] border border-[hsl(210,100%,55%)/0.3]">
                <RefreshCcw className="w-4 h-4 text-[hsl(210,100%,55%)]" />
                <span className="text-sm text-[hsl(210,100%,55%)]">Lifetime Updates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(142,76%,50%)/0.1] border border-[hsl(142,76%,50%)/0.3]">
                <Shield className="w-4 h-4 text-[hsl(142,76%,50%)]" />
                <span className="text-sm text-[hsl(142,76%,50%)]">No Advance</span>
              </div>
            </div>

            {/* CTA Row */}
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                               bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]
                               text-white shadow-[0_0_30px_hsl(210_100%_55%/0.4)]
                               hover:opacity-90 transition-opacity">
                <Play className="w-5 h-5" />
                Try Live Demo
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                               border-2 border-[hsl(210,100%,55%)/0.5] text-[hsl(210,100%,55%)]
                               hover:bg-[hsl(210,100%,55%)/0.1] transition-colors">
                <MessageCircle className="w-5 h-5" />
                Chat With AI
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                               border-2 border-white/20 text-white/80
                               hover:bg-white/5 transition-colors">
                <GitCompare className="w-5 h-5" />
                Compare Features
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Filter */}
      <section className="py-6 border-y border-[hsl(210,100%,55%)/0.2]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="text-sm text-slate-500 whitespace-nowrap">Tech Stack:</span>
            {techFilters.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  selectedTech === tech
                    ? 'bg-[hsl(210,100%,55%)] text-white'
                    : 'bg-[hsl(220,20%,10%)] text-slate-400 border border-[hsl(210,100%,55%)/0.2] hover:border-[hsl(210,100%,55%)/0.5]'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Tiles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden
                          bg-[hsl(220,20%,8%)] border-2 border-[hsl(210,100%,55%)/0.2]
                          hover:border-[hsl(210,100%,55%)/0.6] transition-all duration-300
                          hover:shadow-[0_0_40px_hsl(210_100%_55%/0.2)]"
              >
                {/* Featured badge */}
                {demo.featured && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium
                                bg-[hsl(45,100%,50%)] text-black flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </div>
                )}

                {/* Demo preview placeholder */}
                <div className="h-44 bg-gradient-to-br from-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)] 
                              flex items-center justify-center relative overflow-hidden">
                  <div className="text-5xl opacity-50">{catInfo.icon}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,8%)] to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[hsl(210,100%,55%)/0.1]
                                   text-[hsl(210,100%,55%)] border border-[hsl(210,100%,55%)/0.2]">
                      {demo.tech}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[hsl(45,100%,50%)]">
                      <Star className="w-3 h-3 fill-current" />
                      {demo.rating}
                    </div>
                  </div>

                  <h3 className="font-semibold text-white mb-2 group-hover:text-[hsl(210,100%,55%)] transition-colors">
                    {demo.title}
                  </h3>

                  <p className="text-sm text-slate-400 mb-4">
                    {demo.views.toLocaleString()} views • Auto-translated
                  </p>

                  <button className="w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2
                                   border-2 border-[hsl(45,100%,50%)/0.5] text-[hsl(45,100%,50%)]
                                   hover:bg-[hsl(45,100%,50%)/0.1] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Open Demo
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Prompt Bar */}
      <section className="py-8 border-y border-[hsl(45,100%,50%)/0.3] bg-[hsl(45,100%,50%)/0.05]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="text-slate-300">Interested in this category?</span>
            <Link to="/reseller-landing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                         border-2 border-[hsl(210,100%,55%)/0.5] text-[hsl(210,100%,55%)]
                         hover:bg-[hsl(210,100%,55%)/0.1] transition-colors">
              <Users className="w-4 h-4" />
              Want to sell this? → Apply Reseller
            </Link>
            <Link to="/franchise-landing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                         border-2 border-[hsl(45,100%,50%)/0.5] text-[hsl(45,100%,50%)]
                         hover:bg-[hsl(45,100%,50%)/0.1] transition-colors">
              <Building2 className="w-4 h-4" />
              Want territory? → Apply Franchise
            </Link>
            <Link to="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                         bg-gradient-to-r from-amber-500 to-yellow-500 text-black
                         hover:opacity-90 transition-opacity">
              <Crown className="w-4 h-4" />
              Want priority? → Upgrade Prime
            </Link>
          </div>
        </div>
      </section>

      {/* Price Stamp */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Transparent <span className="text-[hsl(45,100%,50%)]">Pricing</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Software License */}
              <div className="p-6 rounded-2xl bg-[hsl(220,20%,8%)] border-2 border-[hsl(210,100%,55%)/0.3]
                            hover:border-[hsl(210,100%,55%)/0.6] transition-all text-center">
                <div className="text-sm text-slate-400 mb-2">Software License</div>
                <div className="text-4xl font-bold text-white mb-2">$249</div>
                <div className="text-sm text-[hsl(45,100%,50%)] flex items-center justify-center gap-1">
                  <RefreshCcw className="w-4 h-4" /> Lifetime Updates
                </div>
              </div>

              {/* SaaS Model */}
              <div className="p-6 rounded-2xl bg-[hsl(220,20%,8%)] border-2 border-[hsl(45,100%,50%)/0.5]
                            shadow-[0_0_30px_hsl(45_100%_50%/0.2)] text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium
                              bg-[hsl(45,100%,50%)] text-black">Popular</div>
                <div className="text-sm text-slate-400 mb-2">SaaS Model</div>
                <div className="text-4xl font-bold text-[hsl(45,100%,50%)] mb-2">$730</div>
                <div className="text-sm text-slate-300">Hosting + Support + Updates</div>
              </div>

              {/* Enterprise */}
              <div className="p-6 rounded-2xl bg-[hsl(220,20%,8%)] border-2 border-[hsl(210,100%,55%)/0.3]
                            hover:border-[hsl(210,100%,55%)/0.6] transition-all text-center">
                <div className="text-sm text-slate-400 mb-2">Enterprise</div>
                <div className="text-4xl font-bold text-white mb-2">Custom</div>
                <div className="text-sm text-slate-300">Contact for quote</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Masked Login for Deep Demo */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-[hsl(220,20%,8%)] border border-[hsl(210,100%,55%)/0.3]
                        text-center">
            <Lock className="w-10 h-10 text-[hsl(210,100%,55%)] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Deep Demo Access</h4>
            <p className="text-sm text-slate-400 mb-4">Sign in to access full demo features</p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium
                               hover:bg-slate-100 transition-colors">
                <Globe className="w-4 h-4" />
                Google
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2] text-white font-medium
                               hover:opacity-90 transition-opacity">
                <Globe className="w-4 h-4" />
                Twitter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 border-t border-[hsl(210,100%,55%)/0.2]">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Ready to Get Started?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium
                             bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]
                             text-white shadow-[0_0_30px_hsl(210_100%_55%/0.4)]
                             hover:opacity-90 transition-opacity">
              Proceed to Order
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium
                             border-2 border-[hsl(45,100%,50%)/0.5] text-[hsl(45,100%,50%)]
                             hover:bg-[hsl(45,100%,50%)/0.1] transition-colors">
              <Code className="w-5 h-5" />
              Request Developer
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium
                             border-2 border-white/20 text-white/80
                             hover:bg-white/5 transition-colors">
              <ExternalLink className="w-5 h-5" />
              Share Demo Link
            </button>
          </div>
        </div>
      </section>

      {/* AI Brain Widget would be imported separately */}
    </div>
  );
};

export default CategoryOnboarding;
