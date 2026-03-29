import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Building2, ShoppingCart, GraduationCap, Heart, 
  Utensils, Truck, Briefcase, Home, Loader2, ShoppingBag, Sparkles,
  Filter, Grid3X3, LayoutGrid, SlidersHorizontal, TrendingUp, Zap,
  CheckCircle2, Star, X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDemoTestMode } from '@/contexts/DemoTestModeContext';
import EnhancedDemoCard from '@/components/demo/EnhancedDemoCard';
import SuggestionForm from '@/components/demo/SuggestionForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Demo {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string | null;
  status: string;
  health_score: number | null;
  uptime_percentage: number | null;
  response_time_ms: number | null;
  tech_stack: string | null;
  verification_status: string | null;
  is_trending: boolean | null;
}

const SimpleDemoList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Suggestion form state
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<{ id: string; title: string } | null>(null);
  
  // Demo Test Mode
  const { isTestMode, shouldShowAnimation } = useDemoTestMode();

  const categories = [
    { id: 'all', label: 'All Demos', icon: Sparkles, count: 0 },
    { id: 'enterprise', label: 'Enterprise', icon: Building2, count: 0 },
    { id: 'retail', label: 'Retail & POS', icon: ShoppingCart, count: 0 },
    { id: 'education', label: 'Education', icon: GraduationCap, count: 0 },
    { id: 'healthcare', label: 'Healthcare', icon: Heart, count: 0 },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils, count: 0 },
    { id: 'logistics', label: 'Logistics', icon: Truck, count: 0 },
    { id: 'business', label: 'Business', icon: Briefcase, count: 0 },
    { id: 'e-commerce', label: 'E-Commerce', icon: ShoppingBag, count: 0 },
    { id: 'realestate', label: 'Real Estate', icon: Home, count: 0 },
  ];

  useEffect(() => {
    const fetchDemos = async () => {
      setLoading(true);
      
      let query = supabase
        .from('demos')
        .select('id, title, url, category, description, status, health_score, uptime_percentage, response_time_ms, tech_stack, verification_status, is_trending')
        .order('created_at', { ascending: false });
      
      if (!isTestMode) {
        query = query.eq('status', 'active');
      }

      const { data, error } = await query;

      if (!error && data) {
        setDemos(data);
      }
      setLoading(false);
    };

    fetchDemos();
    fetchCartCount();
  }, [isTestMode]);

  const fetchCartCount = async () => {
    const sessionId = localStorage.getItem('demo_session_id');
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase.from('demo_cart').select('id', { count: 'exact' }).eq('is_active', true);
    
    if (user) {
      query = query.eq('user_id', user.id);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    
    const { count } = await query;
    setCartCount(count || 0);
  };

  const handleOpenSuggestions = (demo: { id: string; title: string }) => {
    setSelectedDemo(demo);
    setShowSuggestionForm(true);
  };

  const filteredDemos = demos
    .filter(demo => {
      const matchesSearch = demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (demo.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || demo.category?.toLowerCase().includes(activeCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by status: active first, then pending, then others
      const statusOrder: Record<string, number> = { 'active': 0, 'pending': 1, 'inactive': 2, 'maintenance': 3 };
      const aOrder = statusOrder[a.status] ?? 4;
      const bOrder = statusOrder[b.status] ?? 4;
      return aOrder - bOrder;
    });

  // Calculate category counts
  const categoryWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? demos.length : demos.filter(d => d.category?.toLowerCase().includes(cat.id)).length
  }));

  const stats = {
    total: demos.length,
    verified: demos.filter(d => d.verification_status === 'verified').length,
    trending: demos.filter(d => d.is_trending).length,
    healthy: demos.filter(d => (d.health_score || 0) >= 90).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 transition-colors">
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                  Back to Home
                </span>
              </div>
            </Link>
            
            {/* Center Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                SoftwareVala
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <Link 
                to="/user-dashboard" 
                className="relative p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-slate-400" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs border-0">
                    {cartCount}
                  </Badge>
                )}
              </Link>
              
              {!isTestMode && (
                <Link 
                  to="/auth" 
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-cyan-500/25"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">{stats.total}+ Premium Demos Available</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Live Software Demos
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Try before you buy. Experience enterprise-grade software with instant access. No signup required.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400"><span className="text-white font-semibold">{stats.verified}</span> Verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-slate-400"><span className="text-white font-semibold">{stats.trending}</span> Trending</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400"><span className="text-white font-semibold">{stats.healthy}</span> Healthy</span>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters Bar */}
        <motion.div 
          className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search demos by name, category, or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
            
            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "border-slate-700 bg-slate-800/50",
                  showFilters && "border-cyan-500/50 bg-cyan-500/10"
                )}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <div className="hidden sm:flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'compact' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/50">
                  {categoryWithCounts.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all",
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.label}
                        {cat.count > 0 && (
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-full text-xs",
                            isActive ? 'bg-white/20' : 'bg-slate-700'
                          )}>
                            {cat.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400 text-sm">
              Showing <span className="text-white font-semibold">{filteredDemos.length}</span> demos
              {activeCategory !== 'all' && ` in ${activeCategory}`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400" />
            </div>
            <p className="mt-4 text-slate-400">Loading demos...</p>
          </div>
        )}

        {/* Demo Grid */}
        {!loading && (
          <motion.div 
            className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredDemos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EnhancedDemoCard
                  id={demo.id}
                  title={demo.title}
                  description={demo.description || demo.category}
                  category={demo.category}
                  status={demo.status}
                  healthScore={demo.health_score || 100}
                  uptimePercentage={demo.uptime_percentage || 99.9}
                  responseTime={demo.response_time_ms || undefined}
                  techStack={demo.tech_stack || undefined}
                  isVerified={demo.verification_status === 'verified'}
                  isTrending={demo.is_trending || false}
                  onOpenSuggestions={handleOpenSuggestions}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredDemos.length === 0 && (
          <motion.div 
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No demos found</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <Button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-6 bg-slate-800 hover:bg-slate-700"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </main>

      {/* Suggestion Form Modal */}
      <SuggestionForm
        isOpen={showSuggestionForm}
        onClose={() => {
          setShowSuggestionForm(false);
          setSelectedDemo(null);
          fetchCartCount();
        }}
        demo={selectedDemo}
      />
    </div>
  );
};

export default SimpleDemoList;
