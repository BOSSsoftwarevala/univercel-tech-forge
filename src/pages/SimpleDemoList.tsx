import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Building2, ShoppingCart, GraduationCap, Heart, Utensils, Truck, Briefcase, Home, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDemoTestMode } from '@/contexts/DemoTestModeContext';
import EnhancedDemoCard from '@/components/demo/EnhancedDemoCard';
import SuggestionForm from '@/components/demo/SuggestionForm';
import { Badge } from '@/components/ui/badge';

interface Demo {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string | null;
  status: string;
}

const SimpleDemoList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  
  // Suggestion form state
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<{ id: string; title: string } | null>(null);
  
  // Demo Test Mode - Check if we should skip restrictions
  const { isTestMode, shouldShowAnimation } = useDemoTestMode();

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

  useEffect(() => {
    const fetchDemos = async () => {
      setLoading(true);
      
      // In test mode, fetch ALL demos regardless of status
      // Otherwise only fetch active demos
      let query = supabase
        .from('demos')
        .select('id, title, url, category, description, status')
        .order('created_at', { ascending: false });
      
      // Only filter by status if NOT in test mode
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

  const filteredDemos = demos.filter(demo => {
    const matchesSearch = demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (demo.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || demo.category?.toLowerCase().includes(activeCategory);
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
            
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link 
                to="/user-dashboard" 
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-cyan-500 text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>
              
              {/* Hide login button in test mode - no login required */}
              {!isTestMode && (
                <Link to="/auth" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Login
                </Link>
              )}
            </div>
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        )}

        {/* Demo Grid - Enhanced Cards with all buttons */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDemos.map((demo, index) => (
              <div
                key={demo.id}
                className={shouldShowAnimation() ? 'animate-fade-in' : ''}
                style={shouldShowAnimation() ? { animationDelay: `${index * 50}ms` } : undefined}
              >
                <EnhancedDemoCard
                  id={demo.id}
                  title={demo.title}
                  description={demo.description || demo.category}
                  category={demo.category}
                  status={demo.status}
                  onOpenSuggestions={handleOpenSuggestions}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDemos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No demos found matching your search.</p>
          </div>
        )}
      </main>

      {/* Suggestion Form Modal */}
      <SuggestionForm
        isOpen={showSuggestionForm}
        onClose={() => {
          setShowSuggestionForm(false);
          setSelectedDemo(null);
          fetchCartCount(); // Refresh cart count after action
        }}
        demo={selectedDemo}
      />
    </div>
  );
};

export default SimpleDemoList;
