import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Products', href: '#products' },
  { label: 'Demo', href: '#demo' },
  { label: 'Franchise', href: '#franchise' },
  { label: 'Reseller', href: '#reseller' },
  { label: 'Support', href: '#support' },
];

const HomepageNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary/50 blur-xl -z-10" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-xl text-foreground tracking-tight">
                SOFTWARE <span className="text-primary">VALA</span>
              </h1>
              <p className="text-[10px] text-primary/80 tracking-[0.3em] uppercase">AI Powered</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-neon-teal group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-32 glass-panel py-2"
                  >
                    {['English', 'Hindi', 'Spanish'].map(lang => (
                      <button
                        key={lang}
                        className="w-full px-4 py-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        onClick={() => setLangOpen(false)}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency */}
            <span className="text-sm text-muted-foreground">₹ INR</span>

            {/* Login Button */}
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel mx-4 mt-2 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  className="w-full border-primary/50 text-primary"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar Glass Effect */}
      <div className="absolute inset-0 -z-10 bg-background/60 backdrop-blur-xl border-b border-border/20" />
    </motion.nav>
  );
};

export default HomepageNavbar;
