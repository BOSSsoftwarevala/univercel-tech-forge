import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Monitor, Play, ExternalLink, Search, Filter, Star, Clock, Users, ArrowRight, 
  ShoppingCart, Building2, Calendar, MessageCircle, Sparkles, Eye, Heart,
  TrendingUp, Shield, Zap, Globe, ChevronRight, Phone, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Demo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string | null;
  status: string;
  thumbnail?: string;
}

type DemoCategory = 'all' | 'ecommerce' | 'crm' | 'booking' | 'social';

const categoryConfig: Record<DemoCategory, { label: string; icon: any; color: string; gradient: string }> = {
  all: { label: 'All Demos', icon: Monitor, color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-blue-500/20' },
  ecommerce: { label: 'E-Commerce', icon: ShoppingCart, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/20' },
  crm: { label: 'Business CRM', icon: Building2, color: 'text-violet-400', gradient: 'from-violet-500/20 to-purple-500/20' },
  booking: { label: 'Service Booking', icon: Calendar, color: 'text-orange-400', gradient: 'from-orange-500/20 to-amber-500/20' },
  social: { label: 'Social/Community', icon: MessageCircle, color: 'text-pink-400', gradient: 'from-pink-500/20 to-rose-500/20' },
};

// Premium demo showcases - these look like REAL apps
const premiumDemos = [
  {
    id: 'demo-1',
    title: 'ShopMax Pro',
    description: 'Complete e-commerce platform with inventory, orders, payments, and analytics',
    category: 'ecommerce',
    features: ['Multi-vendor', 'Inventory Management', 'Payment Gateway', 'Analytics Dashboard'],
    price: '₹45,000',
    rating: 4.9,
    reviews: 127,
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
  {
    id: 'demo-2',
    title: 'ClientHub CRM',
    description: 'Professional CRM for managing leads, clients, invoices and team performance',
    category: 'crm',
    features: ['Lead Management', 'Invoice Generator', 'Team Analytics', 'Email Integration'],
    price: '₹55,000',
    rating: 4.8,
    reviews: 89,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  },
  {
    id: 'demo-3',
    title: 'BookEase',
    description: 'Appointment & service booking system for salons, clinics, and professionals',
    category: 'booking',
    features: ['Online Booking', 'Staff Scheduling', 'SMS Reminders', 'Payment Collection'],
    price: '₹35,000',
    rating: 4.9,
    reviews: 156,
    thumbnail: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=600&h=400&fit=crop',
  },
  {
    id: 'demo-4',
    title: 'CommUnity',
    description: 'Social networking platform with chat, forums, events and member management',
    category: 'social',
    features: ['Real-time Chat', 'Discussion Forums', 'Event Management', 'Member Directory'],
    price: '₹65,000',
    rating: 4.7,
    reviews: 64,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
  },
  {
    id: 'demo-5',
    title: 'FoodOrder Pro',
    description: 'Restaurant ordering system with menu management, delivery tracking & kitchen display',
    category: 'ecommerce',
    features: ['Menu Builder', 'Order Tracking', 'Delivery Management', 'Kitchen Display'],
    price: '₹40,000',
    rating: 4.8,
    reviews: 203,
    thumbnail: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop',
  },
  {
    id: 'demo-6',
    title: 'HotelMaster',
    description: 'Hotel booking & management system with room inventory, billing & housekeeping',
    category: 'booking',
    features: ['Room Booking', 'Billing System', 'Housekeeping', 'Guest Management'],
    price: '₹75,000',
    rating: 4.9,
    reviews: 78,
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
  },
];

const PremiumDemoShowcase = () => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<DemoCategory>('all');
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      const { data, error } = await supabase
        .from('demos')
        .select('id, title, description, url, category, status')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDemos(data as Demo[]);
      }
    } catch (err) {
      console.error('Error fetching demos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDemos = premiumDemos.filter(demo => {
    const matchesSearch = demo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || demo.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Software Vala
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-slate-400 hover:text-white"
                onClick={() => navigate('/contact')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-lg shadow-cyan-500/25"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1.5">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Premium Software Solutions
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Experience Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Live Product Demos
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Try before you buy. Explore fully functional demos of our premium software solutions. 
              No signup required.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[
                { icon: Shield, label: '100% Secure' },
                { icon: Zap, label: 'Instant Access' },
                { icon: Globe, label: '24/7 Support' },
                { icon: TrendingUp, label: '500+ Clients' },
              ].map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-2 text-slate-400"
                >
                  <badge.icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search for software..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 bg-slate-900/50 border-slate-700/50 rounded-2xl text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </motion.div>
        </section>

        {/* Category Filter */}
        <section className="px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {(Object.keys(categoryConfig) as DemoCategory[]).map((cat) => {
                const config = categoryConfig[cat];
                const Icon = config.icon;
                const isActive = activeCategory === cat;
                
                return (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${config.gradient} ${config.color} border border-current/30 shadow-lg`
                        : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{config.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Demo Grid */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredDemos.map((demo, index) => {
                  const config = categoryConfig[demo.category as DemoCategory];
                  const isHovered = hoveredDemo === demo.id;
                  
                  return (
                    <motion.div
                      key={demo.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredDemo(demo.id)}
                      onMouseLeave={() => setHoveredDemo(null)}
                      className="group"
                    >
                      <Card className="bg-slate-900/50 border-slate-800/50 overflow-hidden hover:border-slate-700/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/5">
                        {/* Thumbnail */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={demo.thumbnail}
                            alt={demo.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                          
                          {/* Category Badge */}
                          <Badge className={`absolute top-4 left-4 ${config.color} bg-slate-900/80 backdrop-blur-sm border-current/30`}>
                            {config.label}
                          </Badge>
                          
                          {/* Rating */}
                          <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-medium text-white">{demo.rating}</span>
                            <span className="text-xs text-slate-400">({demo.reviews})</span>
                          </div>
                          
                          {/* Play Button Overlay */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-slate-900/60"
                          >
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: isHovered ? 1 : 0.8 }}
                              className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/50"
                            >
                              <Play className="w-6 h-6 text-white ml-1" />
                            </motion.div>
                          </motion.div>
                        </div>

                        <CardContent className="p-5">
                          {/* Title & Description */}
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {demo.title}
                          </h3>
                          <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                            {demo.description}
                          </p>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {demo.features.slice(0, 3).map((feature) => (
                              <span 
                                key={feature}
                                className="text-xs px-2 py-1 rounded-full bg-slate-800/50 text-slate-300"
                              >
                                {feature}
                              </span>
                            ))}
                            {demo.features.length > 3 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-slate-800/50 text-slate-400">
                                +{demo.features.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                            <div>
                              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                                {demo.price}
                              </span>
                              <span className="text-xs text-slate-500 ml-1">onwards</span>
                            </div>
                            <Button 
                              size="sm"
                              className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 hover:from-cyan-500 hover:to-violet-500 text-cyan-400 hover:text-white border border-cyan-500/30 hover:border-transparent transition-all"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Demo
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {filteredDemos.length === 0 && (
              <div className="text-center py-20">
                <Monitor className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-400 mb-2">No demos found</h3>
                <p className="text-slate-500">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 border-t border-slate-800/50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Need Custom Software?
              </span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
              We build tailored solutions for your business. Contact us for a free consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-lg shadow-cyan-500/25 px-8"
              >
                <Mail className="w-4 h-4 mr-2" />
                Request Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Us Now
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm">Your data is 100% secure with us</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 Software Vala. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumDemoShowcase;
