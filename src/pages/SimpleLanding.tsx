import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Play, LogIn, Zap, Shield, Clock, Globe, Users, Star, 
  ArrowRight, CheckCircle, Laptop, Building2, GraduationCap, 
  Heart, Utensils, ShoppingCart, Truck, Home, Sparkles, Bot,
  ChevronRight, MousePointer, Layers, Headphones, Phone,
  Mail, MessageCircle, Award, BadgeCheck, ThumbsUp, Menu, X
} from 'lucide-react';
import { PricingBanner } from '@/components/landing/PricingBanner';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';

const SimpleLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { 
      icon: Play, 
      title: 'Live Demo Access', 
      desc: 'Test real software instantly. No downloads, no setup - just click and try.',
      gradient: 'from-cyan-500 to-blue-600' 
    },
    { 
      icon: Shield, 
      title: '100% Safe & Secure', 
      desc: 'Your data is protected. All demos run in isolated secure environments.',
      gradient: 'from-emerald-500 to-teal-600' 
    },
    { 
      icon: ThumbsUp, 
      title: 'No Pressure Sales', 
      desc: 'Try everything freely. Buy only when you are completely satisfied.',
      gradient: 'from-purple-500 to-pink-600' 
    },
    { 
      icon: Headphones, 
      title: '24/7 Support', 
      desc: 'Our team is always ready to help you find the perfect solution.',
      gradient: 'from-amber-500 to-orange-600' 
    },
  ];

  const categories = [
    { icon: Utensils, name: 'Restaurant & POS', count: 12, color: 'from-orange-500 to-red-500', desc: 'Complete restaurant management solutions' },
    { icon: GraduationCap, name: 'Education & School', count: 8, color: 'from-blue-500 to-indigo-600', desc: 'ERP, LMS and student management' },
    { icon: Heart, name: 'Healthcare & Clinic', count: 6, color: 'from-pink-500 to-rose-600', desc: 'Hospital and clinic management' },
    { icon: ShoppingCart, name: 'E-Commerce', count: 10, color: 'from-green-500 to-emerald-600', desc: 'Online stores and marketplaces' },
    { icon: Building2, name: 'Business & CRM', count: 15, color: 'from-violet-500 to-purple-600', desc: 'Sales, leads and customer management' },
    { icon: Truck, name: 'Logistics & Delivery', count: 5, color: 'from-cyan-500 to-teal-600', desc: 'Fleet tracking and delivery management' },
  ];

  const stats = [
    { value: '500+', label: 'Live Demos Available' },
    { value: '10,000+', label: 'Happy Customers' },
    { value: '50+', label: 'Countries Served' },
    { value: '4.9★', label: 'Customer Rating' },
  ];

  const howItWorks = [
    { 
      step: 1, 
      title: 'Browse Demos', 
      desc: 'Explore our library of 500+ software demos organized by industry',
      icon: Layers 
    },
    { 
      step: 2, 
      title: 'Try Instantly', 
      desc: 'Click any demo to access full functionality - no signup needed',
      icon: MousePointer 
    },
    { 
      step: 3, 
      title: 'Get AI Help', 
      desc: 'Not sure? Our AI recommends the best software for your needs',
      icon: Bot 
    },
    { 
      step: 4, 
      title: 'Buy with Confidence', 
      desc: 'Purchase only what you love. 100% satisfaction guaranteed',
      icon: BadgeCheck 
    },
  ];

  const testimonials = [
    { 
      name: 'Rahul Sharma', 
      role: 'Restaurant Owner', 
      location: 'Mumbai, India',
      text: 'I tried 5 different POS systems in one afternoon. Found the perfect one without a single sales call. This is how software should be sold!', 
      avatar: 'RS',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      name: 'Dr. Priya Mehta', 
      role: 'Hospital Administrator', 
      location: 'Delhi, India',
      text: 'The hospital management demo saved us weeks of vendor meetings. We could test everything before making a decision. Brilliant platform!', 
      avatar: 'PM',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'Amit Kumar', 
      role: 'School Principal', 
      location: 'Bangalore, India',
      text: 'Found our school ERP in 30 minutes. The demo was complete with all features. No hidden surprises after purchase. Highly recommended!', 
      avatar: 'AK',
      gradient: 'from-blue-500 to-indigo-500'
    },
  ];

  const faqs = [
    { q: 'Is it really free to try demos?', a: 'Yes! All demos are 100% free to try. No credit card, no signup required for basic access.' },
    { q: 'How long can I test a demo?', a: 'Most demos are available 24/7. You can test as many times as you want before buying.' },
    { q: 'What happens after I buy?', a: 'You get full access to the software, source code, documentation, and lifetime support.' },
    { q: 'Do you offer customization?', a: 'Yes! We offer customization services. Contact our team for tailored solutions.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Static Background - No animations for speed */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
              >
                <span className="text-lg font-black">SV</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tight">
                  Software<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Vala</span>
                </span>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase">Try Before You Buy</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link to="/demos" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                <Play className="w-4 h-4" />
                All Demos
              </Link>
              <Link to="/sectors" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                <Layers className="w-4 h-4" />
                Categories
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcher compact />
              <Link 
                to="/demos"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-105"
              >
                <Play className="w-4 h-4" />
                Try Free Demo
              </Link>
              <Link 
                to="/auth"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 p-4"
          >
            <div className="flex flex-col gap-2">
              <Link to="/demos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5">
                <Play className="w-5 h-5 text-cyan-400" />
                All Demos
              </Link>
              <Link to="/sectors" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5">
                <Layers className="w-5 h-5 text-purple-400" />
                Categories
              </Link>
              <Link to="/demos" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold">
                <Play className="w-5 h-5" />
                Try Free Demo
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 lg:pt-0">
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-16 lg:py-24">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-8"
          >
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Trusted by 10,000+ Businesses Across 50+ Countries
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
          >
            <span className="block">Find Your Perfect Software</span>
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Try Before You Buy
            </span>
          </motion.h1>

          {/* Clear Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-6"
          >
            500+ live software demos for restaurants, schools, hospitals, shops and more.
            <span className="text-white font-medium"> No signup. No credit card. Just try.</span>
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-10 text-sm"
          >
            {['✓ Free Demo Access', '✓ No Registration', '✓ Instant Access', '✓ 24/7 Support'].map((item, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 text-slate-300">
                {item}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link
              to="/demos"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold overflow-hidden transition-all hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Play className="relative w-5 h-5" />
              <span className="relative">Explore All Demos</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/sectors"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-lg font-medium hover:bg-white/10 transition-all"
            >
              <Layers className="w-5 h-5" />
              Browse by Industry
            </Link>
          </motion.div>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-2 text-sm"
          >
            <span className="text-slate-500">Popular:</span>
            {['Restaurant POS', 'School ERP', 'Hospital', 'E-Commerce', 'CRM'].map((cat, i) => (
              <Link 
                key={i} 
                to="/demos" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {cat}{i < 4 ? ',' : ''}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-slate-700 flex items-start justify-center p-1.5"
          >
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1.5 bg-cyan-400 rounded-full" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Banner - HIGHLIGHTED */}
      <PricingBanner />

      {/* Stats Section */}
      <section className="relative py-16 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Clear Steps */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-3">
              How It <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Finding your perfect software is simple and free
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group text-center"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
                )}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-xs text-cyan-400 font-bold mb-2">STEP {step.step}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/demos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              <Play className="w-4 h-4" />
              Start Exploring Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features - Why Choose Us */}
      <section className="py-20 relative bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-3">
              Why <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Choose Us</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              The smartest way to find and buy software for your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-3">
              Popular <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Find software designed specifically for your industry
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to="/demos"
                  className="group block p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.03]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold group-hover:text-cyan-400 transition-colors">{category.name}</h3>
                        <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">{category.count} demos</span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{category.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              to="/sectors"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              View All 50+ Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-3">
              What Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Join thousands of satisfied businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center font-bold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role} • {testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-3">
              Frequently Asked <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <h3 className="font-semibold mb-2 flex items-start gap-3">
                  <span className="text-cyan-400">Q:</span>
                  {faq.q}
                </h3>
                <p className="text-slate-400 text-sm pl-6">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-4">
              Ready to Find Your
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Perfect Software?
              </span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Stop wasting time on sales calls. Try live demos instantly and make the right decision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/demos"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Start Exploring Free
              </Link>
              <Link
                to="/sectors"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-lg font-medium hover:bg-white/10 transition-all"
              >
                <Phone className="w-5 h-5" />
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <span className="font-bold text-sm">SV</span>
              </div>
              <div>
                <span className="font-bold">Software<span className="text-cyan-400">Vala</span></span>
                <div className="text-xs text-slate-600">Try Before You Buy</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link to="/demos" className="hover:text-white transition-colors">Demos</Link>
              <Link to="/sectors" className="hover:text-white transition-colors">Categories</Link>
              <Link to="/auth" className="hover:text-white transition-colors">Login</Link>
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <a href="mailto:info@softwarevala.com" className="hover:text-cyan-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-xs text-slate-600">
            © 2024 SoftwareVala. All rights reserved. Made with ❤️ in India.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleLanding;
