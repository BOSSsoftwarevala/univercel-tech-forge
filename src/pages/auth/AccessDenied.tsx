import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, ArrowLeft, LogIn, Sparkles, Coffee, MessageCircle, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const friendlyMessages = [
  {
    title: "Oops! VIP Zone Ahead 🚧",
    subtitle: "This area requires special clearance",
    tip: "Don't worry, you still have access to amazing features!"
  },
  {
    title: "Hold Up, Champion! ⚡",
    subtitle: "This room is currently locked for your role",
    tip: "Let's find you the right door to open!"
  },
  {
    title: "Almost There! 🎯",
    subtitle: "Just need the right key for this lock",
    tip: "Contact admin for access, or explore what's available!"
  },
  {
    title: "Members Only Zone 🌟",
    subtitle: "Your current pass doesn't cover this area",
    tip: "But there's plenty to explore with your access level!"
  }
];

const AccessDenied = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [message] = useState(() => friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
          }}
          className="absolute"
          style={{ 
            top: `${20 + Math.random() * 60}%`, 
            left: `${15 + Math.random() * 70}%` 
          }}
        >
          <Sparkles className="w-5 h-5 text-primary/20" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-2"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-10 h-10 text-amber-500" />
              </motion.div>
            </motion.div>
            <CardTitle className="text-2xl font-bold">{message.title}</CardTitle>
            <CardDescription className="text-base">
              {message.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Friendly Tip */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl p-4 border border-green-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-400">Pro Tip</p>
                  <p className="text-xs text-muted-foreground">{message.tip}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Current Role Display */}
            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/50 rounded-xl p-4"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Your Current Role:</span>
                  <span className="font-medium capitalize bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                    {userRole?.replace(/_/g, ' ') || 'Guest'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* What You Can Do */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                What you can do:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Explore your available dashboard features
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Request access upgrade from your admin
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Browse public demos and resources
                </li>
              </ul>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="w-full gap-2">
                <Home className="w-4 h-4" />
                Go to My Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate('/auth')} className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button variant="ghost" onClick={() => navigate('/support')} className="flex-1 gap-2">
                <MessageCircle className="w-4 h-4" />
                Get Help
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Encouraging Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground/60 mt-4"
        >
          You're valued! We're here to help you get the access you need. 💜
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
