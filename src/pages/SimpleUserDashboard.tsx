import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Play, Wallet, Headphones, LogOut, 
  ExternalLink, Download, MessageCircle, ChevronRight,
  CheckCircle, Clock
} from 'lucide-react';
import { toast } from 'sonner';

const SimpleUserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const purchasedProducts = [
    { 
      id: '1', 
      name: 'Restaurant POS', 
      purchaseDate: '2024-01-15', 
      status: 'active',
      demoUrl: 'https://demo.softwarevala.com/restaurant-pos',
      downloadUrl: '#'
    },
    { 
      id: '2', 
      name: 'Hotel Management', 
      purchaseDate: '2024-01-10', 
      status: 'active',
      demoUrl: 'https://demo.softwarevala.com/hotel',
      downloadUrl: '#'
    },
  ];

  const demoHistory = [
    { id: '1', name: 'School ERP', viewedAt: '2024-01-20', status: 'demo' },
    { id: '2', name: 'Gym Management', viewedAt: '2024-01-18', status: 'demo' },
  ];

  const walletBalance = 2500;

  const tabs = [
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'demos', label: 'My Demos', icon: Play },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-xl font-bold">SV</span>
              </div>
              <span className="text-xl font-bold">Software<span className="text-cyan-400">Vala</span></span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Simple Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">My Purchased Products</h2>
            {purchasedProducts.length > 0 ? (
              <div className="grid gap-4">
                {purchasedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                        <Package className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-slate-400">Purchased: {product.purchaseDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </a>
                      <a
                        href={product.downloadUrl}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No products purchased yet.</p>
                <Link
                  to="/demos"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition-colors"
                >
                  Browse Demos
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'demos' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">My Demo History</h2>
            <div className="grid gap-4">
              {demoHistory.map((demo) => (
                <div
                  key={demo.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{demo.name}</h3>
                      <p className="text-sm text-slate-400">Viewed: {demo.viewedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm">
                      <Clock className="w-4 h-4" />
                      Demo
                    </span>
                    <Link
                      to={`/demo/${demo.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Demo
                    </Link>
                    <Link
                      to={`/checkout/${demo.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'wallet' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg"
          >
            <h2 className="text-2xl font-bold mb-6">My Wallet</h2>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
              <Wallet className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-sm text-slate-400 mb-2">Available Balance</p>
              <p className="text-4xl font-bold text-cyan-400">₹{walletBalance.toLocaleString()}</p>
              <div className="flex gap-4 mt-6 justify-center">
                <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition-colors">
                  Add Money
                </button>
                <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors">
                  Transaction History
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'support' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Support</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
              <Headphones className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
              <p className="text-slate-400 mb-6">Our support team is here to help you 24/7.</p>
              <div className="flex gap-4 justify-center">
                <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Start Chat
                </button>
                <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors">
                  View FAQs
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SimpleUserDashboard;