import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Coffee, Sparkles, MapPin } from "lucide-react";

const funMessages = [
  {
    title: "Oops! This page went on vacation 🏖️",
    subtitle: "It forgot to leave a forwarding address",
    tip: "Don't worry, our best pages are still here!"
  },
  {
    title: "Houston, we have a problem 🚀",
    subtitle: "This page has left Earth's orbit",
    tip: "Let's get you back to mission control!"
  },
  {
    title: "Page not found... but YOU are! 🎯",
    subtitle: "That's what matters most",
    tip: "You're still our favorite user!"
  },
  {
    title: "This page is playing hide & seek 🙈",
    subtitle: "And it's really good at it",
    tip: "But we have better pages to show you!"
  },
  {
    title: "404: Page took a coffee break ☕",
    subtitle: "It'll be back... eventually",
    tip: "In the meantime, explore something amazing!"
  },
  {
    title: "Wandered into the digital wilderness 🌲",
    subtitle: "This trail doesn't exist... yet",
    tip: "Let's find you a better path!"
  }
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message] = useState(() => funMessages[Math.floor(Math.random() * funMessages.length)]);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "Oops! Page Not Found | Software Vala";
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            y: [-20, 20, -20],
            x: [0, Math.sin(i) * 30, 0]
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute"
          style={{ 
            top: `${20 + Math.random() * 60}%`, 
            left: `${10 + Math.random() * 80}%` 
          }}
        >
          <Sparkles className="w-6 h-6 text-primary/30" />
        </motion.div>
      ))}

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl px-4"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative mb-8"
        >
          <h1 
            className="text-[150px] md:text-[200px] font-black leading-none"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280, 100%, 60%) 50%, hsl(var(--primary)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px hsla(var(--primary), 0.3)',
            }}
          >
            404
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <MapPin className="w-16 h-16 text-primary/20" />
          </motion.div>
        </motion.div>

        {/* Fun Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            {message.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            {message.subtitle}
          </p>
          <p className="text-sm text-primary/80">
            💡 {message.tip}
          </p>
        </motion.div>

        {/* Queue Message - Friendly Alternative */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Coffee className="w-5 h-5 text-amber-500" />
            <span className="text-muted-foreground">
              While you wait, others are exploring amazing features!
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Auto-redirecting to home in</span>
            <span className="font-mono font-bold text-primary text-lg">{countdown}s</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="gap-2 px-8">
            <Link to="/">
              <Home className="w-5 h-5" />
              Take Me Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <Link to="/demos">
              <Search className="w-5 h-5" />
              Explore Demos
            </Link>
          </Button>
        </motion.div>

        {/* Helpful Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-muted-foreground/60"
        >
          Looking for something specific? Contact support and we'll help you find it! 💬
        </motion.p>
      </motion.section>
    </main>
  );
};

export default NotFound;
