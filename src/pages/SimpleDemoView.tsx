import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, ExternalLink, Check } from 'lucide-react';

const SimpleDemoView = () => {
  const { demoId } = useParams();
  const [selectedRole, setSelectedRole] = useState('admin');

  // Mock demo data - would come from API
  const demo = {
    id: demoId,
    name: 'Restaurant POS',
    description: 'Complete restaurant billing, kitchen management, and inventory system.',
    demoUrl: 'https://demo.softwarevala.com/restaurant-pos',
    roles: [
      { id: 'admin', label: 'Admin', description: 'Full access to all features' },
      { id: 'cashier', label: 'Cashier', description: 'Billing and orders only' },
      { id: 'kitchen', label: 'Kitchen', description: 'View orders and update status' },
    ],
    features: [
      'Multi-table billing',
      'Kitchen order display',
      'Inventory management',
      'Daily reports',
      'Customer management',
      'Menu customization',
    ],
    price: '₹15,000',
    priceLabel: 'one-time payment',
  };

  const handleOpenDemo = () => {
    // Would open demo in new tab or iframe based on selected role
    window.open(`${demo.demoUrl}?role=${selectedRole}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/demos" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Demos</span>
            </Link>
            <Link to="/login" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Demo Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{demo.name}</h1>
          <p className="text-slate-400 text-lg">{demo.description}</p>
        </motion.div>

        {/* Demo Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8"
        >
          {/* Demo Preview Image */}
          <div className="aspect-video bg-slate-800 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-cyan-400" />
                </div>
                <p className="text-slate-400">Live demo preview</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Role Selector - Only if demo has multiple roles */}
            {demo.roles.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Select Role to View</h3>
                <div className="grid grid-cols-3 gap-3">
                  {demo.roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedRole === role.id
                          ? 'bg-cyan-500/10 border-cyan-500'
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {selectedRole === role.id && <Check className="w-4 h-4 text-cyan-400" />}
                        <span className="font-semibold">{role.label}</span>
                      </div>
                      <p className="text-xs text-slate-400">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Single Open Demo Button */}
            <button
              onClick={handleOpenDemo}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              <ExternalLink className="w-5 h-5" />
              Open Demo
            </button>
          </div>
        </motion.div>

        {/* Features & Pricing */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {demo.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-cyan-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Pricing</h3>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-cyan-400">{demo.price}</p>
              <p className="text-slate-400 text-sm">{demo.priceLabel}</p>
            </div>
            <Link
              to={`/checkout/${demo.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-semibold transition-colors mt-4"
            >
              Buy Now
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SimpleDemoView;