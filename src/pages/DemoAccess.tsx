import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, Shield, Users, Code, Store, Megaphone, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Demo credentials for each role - NO PASSWORD REQUIRED, ONE-CLICK LOGIN
const DEMO_ACCOUNTS: Record<string, { email: string; password: string; name: string; icon: React.ElementType; color: string; dashboard: string }> = {
  'master': {
    email: 'hellosoftwarevala@gmail.com',
    password: 'Demo@Master2024!',
    name: 'Master Admin',
    icon: Shield,
    color: 'from-yellow-500 to-amber-600',
    dashboard: '/master-admin'
  },
  'super-admin': {
    email: 'superadmin@softwarevala.com',
    password: 'SuperAdmin@2024!',
    name: 'Super Admin',
    icon: Shield,
    color: 'from-purple-500 to-indigo-600',
    dashboard: '/super-admin'
  },
  'franchise': {
    email: 'john@gmail.com',
    password: 'Demo@Franchise2024!',
    name: 'Franchise Partner',
    icon: Store,
    color: 'from-blue-500 to-cyan-600',
    dashboard: '/franchise'
  },
  'reseller': {
    email: 'skiketi@student.kibu.ac.ke',
    password: 'Demo@Reseller2024!',
    name: 'Reseller Partner',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    dashboard: '/reseller'
  },
  'developer': {
    email: 'developer@softwarevala.com',
    password: 'Demo@Developer2024!',
    name: 'Developer',
    icon: Code,
    color: 'from-cyan-500 to-teal-600',
    dashboard: '/developer'
  },
  'influencer': {
    email: 'influencer@softwarevala.com',
    password: 'Demo@Influencer2024!',
    name: 'Influencer',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-600',
    dashboard: '/influencer'
  },
  'prime': {
    email: 'prime@softwarevala.com',
    password: 'Demo@Prime2024!',
    name: 'Prime User',
    icon: UserCheck,
    color: 'from-amber-500 to-orange-600',
    dashboard: '/prime'
  },
};

const DemoAccess = () => {
  const { role } = useParams<{ role: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Preparing demo access...');

  useEffect(() => {
    const autoLogin = async () => {
      const roleKey = role?.toLowerCase() || searchParams.get('role')?.toLowerCase();
      
      if (!roleKey || !DEMO_ACCOUNTS[roleKey]) {
        setStatus('error');
        setMessage('Invalid demo role. Please use a valid demo URL.');
        return;
      }

      const account = DEMO_ACCOUNTS[roleKey];
      setMessage(`Logging in as ${account.name}...`);

      try {
        // Sign out any existing session first
        await supabase.auth.signOut();
        
        // Auto-login with demo credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password,
        });

        if (error) {
          // If user doesn't exist, create them
          if (error.message.includes('Invalid login credentials')) {
            setMessage('Setting up demo account...');
            
            // Create the demo user
            const { error: signUpError } = await supabase.auth.signUp({
              email: account.email,
              password: account.password,
              options: {
                data: {
                  full_name: account.name,
                  role: roleKey,
                },
              },
            });

            if (signUpError && !signUpError.message.includes('already registered')) {
              throw signUpError;
            }

            // Try login again
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email: account.email,
              password: account.password,
            });

            if (retryError) {
              throw retryError;
            }
          } else {
            throw error;
          }
        }

        setStatus('success');
        setMessage(`Welcome! Redirecting to ${account.name} Dashboard...`);
        
        toast({
          title: `Demo Access Granted`,
          description: `You are now logged in as ${account.name}`,
        });

        // Redirect to role dashboard
        setTimeout(() => {
          navigate(account.dashboard, { replace: true });
        }, 1500);

      } catch (err: any) {
        console.error('Demo login error:', err);
        setStatus('error');
        setMessage(err.message || 'Failed to access demo. Please try again.');
        
        toast({
          title: 'Demo Access Failed',
          description: err.message,
          variant: 'destructive',
        });
      }
    };

    autoLogin();
  }, [role, searchParams, navigate, toast]);

  const roleKey = role?.toLowerCase() || searchParams.get('role')?.toLowerCase() || '';
  const account = DEMO_ACCOUNTS[roleKey];
  const Icon = account?.icon || Shield;
  const gradientColor = account?.color || 'from-primary to-primary/80';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-6`}
          >
            {status === 'loading' ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <Icon className="w-10 h-10 text-white" />
            )}
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {account?.name || 'Demo'} Access
          </h1>

          {/* Status Message */}
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {message}
          </motion.p>

          {/* Loading Bar */}
          {status === 'loading' && (
            <motion.div
              className="mt-6 h-1 bg-muted rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${gradientColor}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </motion.div>
          )}

          {/* Features */}
          <div className="mt-6 text-xs text-muted-foreground space-y-1">
            <p>✓ No password required</p>
            <p>✓ Unlimited devices</p>
            <p>✓ All countries allowed</p>
            <p>✓ Full feature access</p>
          </div>

          {/* Error Retry */}
          {status === 'error' && (
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {/* All Demo Links */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground mb-3">Other Demo Roles:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
              <a
                key={key}
                href={`/demo/${key}`}
                className="text-xs px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                {acc.name}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoAccess;
