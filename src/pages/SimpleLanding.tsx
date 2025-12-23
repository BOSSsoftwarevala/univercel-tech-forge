import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, DollarSign, LogIn, Zap, Shield, Clock, 
  Globe, Users, Star, ArrowRight, CheckCircle,
  Laptop, Building2, GraduationCap, Heart, Utensils,
  ShoppingCart, Truck, Home, Sparkles, Bot
} from 'lucide-react';
import heroAiWoman from '@/assets/hero-ai-woman.png';

const SimpleLanding = () => {
  const features = [
    { icon: Zap, title: 'Instant Access', desc: 'Try any demo in seconds, no signup required' },
    { icon: Shield, title: 'Secure & Safe', desc: 'Enterprise-grade security for all demos' },
    { icon: Clock, title: '24/7 Available', desc: 'Access demos anytime, anywhere in the world' },
    { icon: Globe, title: 'Global Reach', desc: 'Serving clients across 50+ countries' },
  ];

  const categories = [
    { icon: Utensils, name: 'Restaurant & POS', count: 12, color: 'from-orange-500 to-red-500' },
    { icon: GraduationCap, name: 'Education & ERP', count: 8, color: 'from-blue-500 to-indigo-500' },
    { icon: Heart, name: 'Healthcare', count: 6, color: 'from-pink-500 to-rose-500' },
    { icon: ShoppingCart, name: 'E-Commerce', count: 10, color: 'from-green-500 to-emerald-500' },
    { icon: Building2, name: 'Business & CRM', count: 15, color: 'from-purple-500 to-violet-500' },
    { icon: Truck, name: 'Logistics', count: 5, color: 'from-cyan-500 to-teal-500' },
    { icon: Home, name: 'Real Estate', count: 7, color: 'from-amber-500 to-yellow-500' },
    { icon: Laptop, name: 'IT & SaaS', count: 9, color: 'from-slate-500 to-zinc-500' },
  ];

  const stats = [
    { value: '500+', label: 'Live Demos' },
    { value: '10K+', label: 'Happy Clients' },
    { value: '50+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const testimonials = [
    { name: 'Rahul S.', role: 'Restaurant Owner', text: 'Found the perfect POS system in 10 minutes. No sales calls, just tried the demo and bought it.', rating: 5 },
    { name: 'Priya M.', role: 'School Principal', text: 'The ERP demo was exactly what we needed. Saved us weeks of vendor meetings.', rating: 5 },
    { name: 'Amit K.', role: 'Startup Founder', text: 'Finally, a platform that lets you try before you buy. Revolutionary approach!', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-xl font-bold">SV</span>
              </div>
              <span className="text-xl font-bold">Software<span className="text-cyan-400">Vala</span></span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link 
                to="/demos" 
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Live Demos
              </Link>
              <Link 
                to="/sectors" 
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors hidden sm:flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Categories
              </Link>
              <Link 
                to="/login" 
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700/50"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroAiWoman} 
            alt="AI Software Solutions" 
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.7) contrast(1.05)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>500+ Live Software Demos Available</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Try Live Software Demos.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Buy Only If You Like.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl sm:text-2xl text-slate-300 mb-10"
          >
            No signup. No confusion. Just demos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/demos"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Explore All Demos
            </Link>
            <Link
              to="/sectors"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-lg font-medium hover:bg-slate-700 transition-all"
            >
              <Globe className="w-5 h-5" />
              Browse Categories
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-cyan-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
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
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-cyan-400">SoftwareVala</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The smartest way to find and buy software. No more endless demos with sales teams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-cyan-500/30 transition-all hover:bg-slate-900/80"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore By <span className="text-cyan-400">Category</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Find software solutions tailored for your industry
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  className="group flex items-center gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 transition-all hover:bg-slate-800/50"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{category.name}</h3>
                    <p className="text-sm text-slate-500">{category.count} demos</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </Link>
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
              to="/sectors"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Assistant Highlight */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
                <Bot className="w-4 h-4" />
                <span>AI-Powered Assistance</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Can't Decide? Let Our <span className="text-purple-400">AI Help</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Describe your business needs and our AI assistant will recommend the perfect software solutions from our library. No more confusion, just clarity.
              </p>
              <div className="space-y-4">
                {['Smart recommendations based on your needs', 'Compare features across products', 'Get instant answers 24/7'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">SV AI Assistant</div>
                    <div className="text-xs text-green-400">● Online</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-slate-800/50 text-sm text-slate-300">
                    "I need a restaurant management system with POS, inventory, and staff management"
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm text-slate-300">
                    Based on your needs, I recommend <span className="text-purple-400 font-medium">Bhojon POS</span> - it includes all features you mentioned plus KOT management. Would you like to try the demo?
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved By <span className="text-cyan-400">Thousands</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Join 10,000+ businesses who found their perfect software through us
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
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-slate-900 to-purple-500/10 border border-slate-800/50"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Software?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Stop wasting time on endless vendor calls. Try live demos instantly and make informed decisions.
            </p>
            <Link
              to="/demos"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] hover:scale-105"
            >
              <Play className="w-6 h-6" />
              Start Exploring Demos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-sm font-bold">SV</span>
              </div>
              <span className="font-bold">Software<span className="text-cyan-400">Vala</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link to="/demos" className="hover:text-cyan-400 transition-colors">Demos</Link>
              <Link to="/sectors" className="hover:text-cyan-400 transition-colors">Categories</Link>
              <Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link>
            </div>
            <div className="text-sm text-slate-600">
              © 2024 SoftwareVala. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleLanding;
