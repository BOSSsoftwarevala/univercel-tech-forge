import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowLeft, Search, Building2, ShoppingCart, GraduationCap, Heart, Utensils, Truck, Briefcase, Home } from 'lucide-react';

const SimpleDemoList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: Building2 },
    { id: 'retail', label: 'Retail & POS', icon: ShoppingCart },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'healthcare', label: 'Healthcare', icon: Heart },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'realestate', label: 'Real Estate', icon: Home },
  ];

  const demos = [
    { id: '1', name: 'Restaurant POS', category: 'restaurant', description: 'Complete billing & kitchen management', image: '/placeholder.svg' },
    { id: '2', name: 'Hotel Management', category: 'business', description: 'Booking, rooms & guest management', image: '/placeholder.svg' },
    { id: '3', name: 'School ERP', category: 'education', description: 'Students, fees & attendance system', image: '/placeholder.svg' },
    { id: '4', name: 'Hospital HMIS', category: 'healthcare', description: 'Patient records & appointments', image: '/placeholder.svg' },
    { id: '5', name: 'Retail POS', category: 'retail', description: 'Inventory, billing & reports', image: '/placeholder.svg' },
    { id: '6', name: 'Real Estate CRM', category: 'realestate', description: 'Properties, leads & sales', image: '/placeholder.svg' },
    { id: '7', name: 'Logistics Manager', category: 'logistics', description: 'Fleet, deliveries & tracking', image: '/placeholder.svg' },
    { id: '8', name: 'Gym Management', category: 'business', description: 'Members, plans & attendance', image: '/placeholder.svg' },
    { id: '9', name: 'Salon & Spa', category: 'business', description: 'Bookings, services & billing', image: '/placeholder.svg' },
    { id: '10', name: 'Coaching Center', category: 'education', description: 'Batches, students & tests', image: '/placeholder.svg' },
    { id: '11', name: 'Pharmacy POS', category: 'healthcare', description: 'Medicine inventory & billing', image: '/placeholder.svg' },
    { id: '12', name: 'Supermarket POS', category: 'retail', description: 'Multi-counter billing system', image: '/placeholder.svg' },
  ];

  const filteredDemos = demos.filter(demo => {
    const matchesSearch = demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         demo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || demo.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <Link to="/login" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Live Software Demos</h1>
          <p className="text-slate-400">Try before you buy. No signup required.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search demos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Demo Grid - Simple Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDemos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
            >
              {/* Demo Preview Image */}
              <div className="aspect-video bg-slate-800 relative">
                <img src={demo.image} alt={demo.name} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <Play className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Demo Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{demo.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{demo.description}</p>
                
                {/* Single CTA Button */}
                <Link
                  to={`/demo/${demo.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  <Play className="w-4 h-4" />
                  View Live Demo
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDemos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No demos found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SimpleDemoList;