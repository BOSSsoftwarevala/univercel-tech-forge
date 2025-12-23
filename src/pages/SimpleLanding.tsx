import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Play, LogIn, Zap, Shield, Clock, Globe, Users, Star, 
  ArrowRight, CheckCircle, Laptop, Building2, GraduationCap, 
  Heart, Utensils, ShoppingCart, Truck, Home, Sparkles, Bot,
  ChevronRight, MousePointer, Layers, Code2, Cpu, Database,
  Fingerprint, Gauge, LineChart, Lock, Rocket, Target,
  TrendingUp, Wand2, Workflow, Menu, X
} from 'lucide-react';

const SimpleLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Try any demo in seconds', gradient: 'from-amber-500 to-orange-600' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade protection', gradient: 'from-emerald-500 to-teal-600' },
    { icon: Globe, title: 'Global Access', desc: '50+ countries served', gradient: 'from-blue-500 to-indigo-600' },
    { icon: Cpu, title: 'AI-Powered', desc: 'Smart recommendations', gradient: 'from-purple-500 to-pink-600' },
    { icon: Clock, title: '24/7 Available', desc: 'Anytime, anywhere', gradient: 'from-cyan-500 to-blue-600' },
    { icon: Rocket, title: 'Quick Deploy', desc: 'Go live in hours', gradient: 'from-rose-500 to-red-600' },
  ];

  const categories = [
    { icon: Utensils, name: 'Restaurant & POS', count: 12, color: 'from-orange-500 to-red-500', demos: ['Bhojon POS', 'ViaviLab', 'Caferia'] },
    { icon: GraduationCap, name: 'Education', count: 8, color: 'from-blue-500 to-indigo-600', demos: ['School ERP', 'LMS Pro', 'Academy'] },
    { icon: Heart, name: 'Healthcare', count: 6, color: 'from-pink-500 to-rose-600', demos: ['Hospital MS', 'Clinic Pro', 'Lab System'] },
    { icon: ShoppingCart, name: 'E-Commerce', count: 10, color: 'from-green-500 to-emerald-600', demos: ['MultiShop', 'Grocery', 'Fashion'] },
    { icon: Building2, name: 'Business CRM', count: 15, color: 'from-violet-500 to-purple-600', demos: ['SalesPro', 'LeadHub', 'CRM Suite'] },
    { icon: Truck, name: 'Logistics', count: 5, color: 'from-cyan-500 to-teal-600', demos: ['FleetTrack', 'Delivery', 'Warehouse'] },
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Live Demos', icon: Play },
    { value: 10, suffix: 'K+', label: 'Happy Clients', icon: Users },
    { value: 50, suffix: '+', label: 'Countries', icon: Globe },
    { value: 99.9, suffix: '%', label: 'Uptime', icon: Gauge },
  ];

  const testimonials = [
    { 
      name: 'Rahul Sharma', 
      role: 'Restaurant Chain Owner', 
      company: 'FoodWorks India',
      text: 'Found the perfect POS in 10 minutes. No sales calls, no pressure. Just tried it and bought it. Saved us 3 weeks of vendor meetings.', 
      avatar: 'RS',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      name: 'Dr. Priya Mehta', 
      role: 'Hospital Administrator', 
      company: 'City Medical Center',
      text: 'The hospital management demo was exactly what we needed. We tested 5 different systems in one afternoon. Revolutionary platform!', 
      avatar: 'PM',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'Amit Kumar', 
      role: 'Tech Startup Founder', 
      company: 'InnovateTech',
      text: 'As a developer myself, I appreciate the quality. Clean code, modern stack, and incredible support. This is how software should be sold.', 
      avatar: 'AK',
      gradient: 'from-blue-500 to-indigo-500'
    },
  ];

  const workflowSteps = [
    { step: 1, title: 'Browse', desc: 'Explore 500+ live demos by category', icon: Layers },
    { step: 2, title: 'Try', desc: 'Test full functionality instantly', icon: MousePointer },
    { step: 3, title: 'Compare', desc: 'AI helps you find the best match', icon: Target },
    { step: 4, title: 'Buy', desc: 'Purchase only what you love', icon: CheckCircle },
  ];

  // Counter animation
  const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (hasAnimated) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setHasAnimated(true);
            let start = 0;
            const end = value;
            const duration = 2000;
            const increment = end / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
          }
        },
        { threshold: 0.5 }
      );
      const element = document.getElementById(`counter-${value}`);
      if (element) observer.observe(element);
      return () => observer.disconnect();
    }, [value, hasAnimated]);

    return <span id={`counter-${value}`}>{count}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Gradient orbs */}
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 20, 0], 
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]" 
        />

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25"
              >
                <span className="text-lg lg:text-xl font-black">SV</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold tracking-tight">
                  Software<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Vala</span>
                </span>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase">Try Before You Buy</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { to: '/demos', label: 'Live Demos', icon: Play },
                { to: '/sectors', label: 'Categories', icon: Layers },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link 
                to="/demos"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
              >
                <Play className="w-4 h-4" />
                Try Demos
              </Link>
              <Link 
                to="/login"
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
              <Link to="/demos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5">
                <Play className="w-5 h-5 text-cyan-400" />
                Live Demos
              </Link>
              <Link to="/sectors" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5">
                <Layers className="w-5 h-5 text-purple-400" />
                Categories
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 lg:pt-0">
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              500+ Live Software Demos • No Signup Required
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
          >
            <span className="block">Try Software.</span>
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Buy Only If You Love It.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            No sales calls. No commitments. Just live demos you can test instantly.
            Find your perfect software in minutes, not months.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="/demos"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold overflow-hidden transition-all hover:scale-105"
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
              Browse by Category
            </Link>
          </motion.div>

          {/* Trusted By */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-xs text-slate-500 uppercase tracking-widest">Trusted by 10,000+ businesses</span>
            <div className="flex items-center gap-6 opacity-40">
              {['TechCorp', 'InnovateLabs', 'FutureTech', 'DigitalFirst'].map((name, i) => (
                <div key={i} className="text-lg font-bold text-slate-500">{name}</div>
              ))}
            </div>
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
            className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center p-2"
          >
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-cyan-400 rounded-full" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              How It <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Finding your perfect software has never been easier
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
                )}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-cyan-500/30 transition-all group-hover:bg-white/5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs text-cyan-400 font-bold mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Built for <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Modern Business</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.04]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
              Industry Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Explore by <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Category</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setActiveCategory(index)}
              >
                <Link
                  to="/demos"
                  className="group block p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-400">
                      {category.count} demos
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors">{category.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.demos.map((demo) => (
                      <span key={demo} className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                        {demo}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View demos <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                <Bot className="w-4 h-4" />
                AI-Powered
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                Not Sure What You Need?
                <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Let AI Guide You
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Describe your business requirements and our AI assistant will instantly recommend the perfect software matches from our library.
              </p>
              <div className="space-y-4">
                {[
                  'Smart recommendations based on your industry',
                  'Compare features across multiple products',
                  'Get instant answers 24/7',
                  'Personalized demo suggestions'
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
              <div className="relative p-6 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">SoftwareVala AI</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Online • Ready to help
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 text-sm max-w-[80%]">
                      I need a restaurant system with POS, inventory tracking, and staff management
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="p-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-sm max-w-[85%]">
                      <p className="mb-3">Based on your requirements, I recommend:</p>
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-2">
                        <div className="font-semibold text-purple-400">🏆 Bhojon POS</div>
                        <div className="text-xs text-slate-400 mt-1">Complete restaurant solution with all features you mentioned + KOT system</div>
                      </div>
                      <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium mt-2">
                        View Live Demo →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Loved by <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Thousands</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                    <div className="text-xs text-slate-600">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Ready to Find Your
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Perfect Software?
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ businesses who found their ideal solution through SoftwareVala
              </p>
              <Link
                to="/demos"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_50px_rgba(6,182,212,0.3)] hover:shadow-[0_0_80px_rgba(6,182,212,0.5)] hover:scale-105"
              >
                <Play className="w-6 h-6" />
                Start Exploring Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <span className="font-bold">SV</span>
              </div>
              <div>
                <span className="font-bold">Software<span className="text-cyan-400">Vala</span></span>
                <div className="text-xs text-slate-600">Try Before You Buy</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link to="/demos" className="hover:text-white transition-colors">Demos</Link>
              <Link to="/sectors" className="hover:text-white transition-colors">Categories</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
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
