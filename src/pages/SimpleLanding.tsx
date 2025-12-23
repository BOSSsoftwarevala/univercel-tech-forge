import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, DollarSign, LogIn } from 'lucide-react';
import heroAiWoman from '@/assets/hero-ai-woman.png';

const SimpleLanding = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-xl font-bold">SV</span>
              </div>
              <span className="text-xl font-bold">Software<span className="text-cyan-400">Vala</span></span>
            </Link>

            {/* Navigation - Simple 3 items */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/demos" 
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Live Demos
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Pricing
              </Link>
              <Link 
                to="/login" 
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Ultra Simple */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroAiWoman} 
            alt="AI Software Solutions" 
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.8) contrast(1.05)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        </div>

        {/* Content - Centered */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Try Live Software Demos.
            <br />
            <span className="text-cyan-400">Buy Only If You Like.</span>
          </motion.h1>

          {/* Sub-line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-300 mb-10"
          >
            No signup. No confusion. Just demos.
          </motion.p>

          {/* ONE Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/demos"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg font-bold uppercase tracking-wide hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:scale-105"
            >
              <Play className="w-6 h-6" />
              Check Live Demos
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SimpleLanding;