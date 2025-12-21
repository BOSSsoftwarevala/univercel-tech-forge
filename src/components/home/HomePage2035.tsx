import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Globe, 
  Shield, 
  Users, 
  Zap,
  MapPin,
  Play,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  Bot,
  Building2,
  Code2,
  Megaphone,
  MessageCircle,
  Languages,
  IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Education', icon: '🎓', count: 45 },
  { name: 'POS/Retail', icon: '🛒', count: 38 },
  { name: 'CRM', icon: '📊', count: 52 },
  { name: 'Healthcare', icon: '🏥', count: 28 },
  { name: 'Real Estate', icon: '🏠', count: 34 },
  { name: 'Finance', icon: '💰', count: 41 },
];

const demos = [
  { name: 'School ERP Pro', category: 'Education', status: 'live', tech: 'React' },
  { name: 'RetailMaster 360', category: 'POS', status: 'live', tech: 'Node.js' },
  { name: 'ClinicFlow', category: 'Healthcare', status: 'live', tech: 'PHP' },
  { name: 'PropDesk CRM', category: 'Real Estate', status: 'live', tech: 'Laravel' },
];

const HomePage2035 = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState('English');
  const [detectedCurrency, setDetectedCurrency] = useState('INR');

  // Auto-rotate demos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo(prev => (prev + 1) % demos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate geo-detection
  useEffect(() => {
    // In production, this would use geolocation API
    setDetectedLanguage('English');
    setDetectedCurrency('INR');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d1025] to-[#0a0a1a] text-white overflow-hidden">
      {/* Auto Language/Currency Indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Badge variant="outline" className="bg-background/50 backdrop-blur">
          <Languages className="h-3 w-3 mr-1" />
          {detectedLanguage}
        </Badge>
        <Badge variant="outline" className="bg-background/50 backdrop-blur">
          <IndianRupee className="h-3 w-3 mr-1" />
          {detectedCurrency}
        </Badge>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400 px-4 py-2 text-sm">
              <Brain className="h-4 w-4 mr-2" />
              Powered by AI + Human Collaboration
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              SOFTWARE VALA
            </span>
            <br />
            <span className="text-white/90 text-3xl md:text-4xl">
              Enterprise SaaS Ecosystem 2035
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            Your complete software solutions partner. From development to deployment,
            we deliver enterprise-grade solutions with zero advance payment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 gap-2 text-lg px-8">
              Apply for Roles
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 gap-2 text-lg px-8">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { icon: <Shield className="h-5 w-5" />, text: 'Zero Advance Guarantee' },
              { icon: <Users className="h-5 w-5" />, text: '2,800+ Happy Clients' },
              { icon: <Globe className="h-5 w-5" />, text: '12 Global Branches' },
              { icon: <Zap className="h-5 w-5" />, text: '99.9% Uptime' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-cyan-400">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Software Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">{cat.icon}</span>
                    <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{cat.count} demos</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Showcase Carousel */}
      <section className="py-16 px-6 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Live Demo Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {demos.map((demo, i) => (
              <motion.div
                key={demo.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "transition-all duration-300",
                  i === currentDemo && "scale-105"
                )}
              >
                <Card className={cn(
                  "bg-white/5 border-white/10 transition-all",
                  i === currentDemo && "border-cyan-500/50 ring-2 ring-cyan-500/20"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-xs">{demo.tech}</Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        {demo.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{demo.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{demo.category}</p>
                    <Button size="sm" variant="outline" className="w-full gap-2">
                      <Play className="h-3 w-3" />
                      View Demo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifetime Pricing Block */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
                    Special Offer
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    Lifetime Software Ownership
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Own your software forever with lifetime updates, zero recurring costs,
                    and complete source code access.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {['Full Source Code', 'Lifetime Updates', 'Priority Support', 'Custom Branding'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Get Lifetime Access
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-400">₹49K</div>
                  <div className="text-muted-foreground">One-time payment</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Zero Advance Guarantee */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block p-8 rounded-full bg-green-500/10 border border-green-500/30 mb-8"
          >
            <Shield className="h-16 w-16 text-green-400" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Zero Advance Guarantee</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We believe in our work. Pay only after you see results. 
            No upfront costs, no hidden fees, no risks.
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              100% Risk Free
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Pay After Delivery
            </Badge>
          </div>
        </div>
      </section>

      {/* Global Branches Map */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Global Presence</h2>
          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center relative">
                {/* Placeholder for actual map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="h-32 w-32 text-cyan-400/30" />
                </div>
                
                {/* Branch Pins (Simulated) */}
                {[
                  { x: '20%', y: '30%', name: 'New York' },
                  { x: '45%', y: '25%', name: 'London' },
                  { x: '60%', y: '40%', name: 'Mumbai' },
                  { x: '75%', y: '35%', name: 'Singapore' },
                ].map((branch, i) => (
                  <motion.div
                    key={branch.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute cursor-pointer group"
                    style={{ left: branch.x, top: branch.y }}
                  >
                    <div className="relative">
                      <MapPin className="h-6 w-6 text-cyan-400" />
                      <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs bg-background/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {branch.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Apply for Roles */}
      <section className="py-16 px-6 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Join Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Building2 />, role: 'Franchise Partner', color: 'from-blue-500/20 to-indigo-500/20' },
              { icon: <Users />, role: 'Reseller', color: 'from-green-500/20 to-emerald-500/20' },
              { icon: <Code2 />, role: 'Developer', color: 'from-cyan-500/20 to-blue-500/20' },
              { icon: <Megaphone />, role: 'Influencer', color: 'from-pink-500/20 to-rose-500/20' },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={cn(
                  "bg-gradient-to-br border-white/10 hover:border-primary/30 transition-all cursor-pointer",
                  item.color
                )}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-block p-4 rounded-full bg-white/10 mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{item.role}</h3>
                    <Button size="sm" variant="outline" className="mt-2">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chatbot Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
};

export default HomePage2035;
