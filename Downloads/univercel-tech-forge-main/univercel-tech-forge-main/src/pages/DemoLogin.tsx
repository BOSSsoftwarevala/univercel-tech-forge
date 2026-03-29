import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, Shield, Users, Server, Briefcase, UserCheck, 
  TrendingUp, Headphones, Code, DollarSign, Eye, 
  Loader2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================
// DEMO LOGIN PAGE - ONE-CLICK TESTING
// ============================================

interface DemoAccount {
  id: string;
  role: string;
  email: string;
  password: string;
  icon: typeof Crown;
  color: string;
  description: string;
  redirectPath: string;
  tier: 'master' | 'admin' | 'manager' | 'staff';
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  // TIER 1: MASTER
  {
    id: 'master',
    role: 'Master Admin',
    email: 'masteradmin@demo.softwarevala.com',
    password: 'Demo@Master2025!',
    icon: Crown,
    color: 'from-purple-500 to-purple-700',
    description: 'System Owner • Root of Trust • Hidden Endpoint',
    redirectPath: '/master-control-vault-x9k2m',
    tier: 'master',
  },
  // TIER 2: SUPER ADMIN
  {
    id: 'super',
    role: 'Super Admin',
    email: 'superadmin@demo.softwarevala.com',
    password: 'Demo@Super2025!',
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    description: 'Platform Commander • Global Control',
    redirectPath: '/super-admin',
    tier: 'admin',
  },
  // TIER 3: ADMIN
  {
    id: 'admin',
    role: 'Admin',
    email: 'admin@demo.softwarevala.com',
    password: 'Demo@Admin2025!',
    icon: Users,
    color: 'from-blue-500 to-blue-700',
    description: 'System Operator • Daily Operations',
    redirectPath: '/admin-secure',
    tier: 'admin',
  },
  // TIER 4: MANAGERS
  {
    id: 'server',
    role: 'Server Manager',
    email: 'server@demo.softwarevala.com',
    password: 'Demo@Server2025!',
    icon: Server,
    color: 'from-slate-500 to-slate-700',
    description: 'Infra Guardian • Zero Trust',
    redirectPath: '/server-manager',
    tier: 'manager',
  },
  {
    id: 'franchise',
    role: 'Franchise Manager',
    email: 'franchise@demo.softwarevala.com',
    password: 'Demo@Franchise2025!',
    icon: Briefcase,
    color: 'from-emerald-500 to-emerald-700',
    description: 'Business Operations • Regional Control',
    redirectPath: '/franchise-manager',
    tier: 'manager',
  },
  {
    id: 'area',
    role: 'Area Manager',
    email: 'area@demo.softwarevala.com',
    password: 'Demo@Area2025!',
    icon: UserCheck,
    color: 'from-teal-500 to-teal-700',
    description: 'Regional Oversight • Territory Management',
    redirectPath: '/area-manager',
    tier: 'manager',
  },
  {
    id: 'finance',
    role: 'Finance Manager',
    email: 'finance@demo.softwarevala.com',
    password: 'Demo@Finance2025!',
    icon: DollarSign,
    color: 'from-green-500 to-green-700',
    description: 'Financial Operations • Transactions',
    redirectPath: '/finance',
    tier: 'manager',
  },
  // TIER 5: STAFF
  {
    id: 'developer',
    role: 'Developer',
    email: 'developer@demo.softwarevala.com',
    password: 'Demo@Dev2025!',
    icon: Code,
    color: 'from-violet-500 to-violet-700',
    description: 'Development Tasks • Code Access',
    redirectPath: '/developer',
    tier: 'staff',
  },
  {
    id: 'sales',
    role: 'Sales Lead',
    email: 'sales@demo.softwarevala.com',
    password: 'Demo@Sales2025!',
    icon: TrendingUp,
    color: 'from-cyan-500 to-cyan-700',
    description: 'Lead Management • Sales Pipeline',
    redirectPath: '/sales',
    tier: 'staff',
  },
  {
    id: 'support',
    role: 'Support Staff',
    email: 'support@demo.softwarevala.com',
    password: 'Demo@Support2025!',
    icon: Headphones,
    color: 'from-pink-500 to-pink-700',
    description: 'Client Support • Issue Resolution',
    redirectPath: '/support',
    tier: 'staff',
  },
  {
    id: 'viewer',
    role: 'Viewer',
    email: 'viewer@demo.softwarevala.com',
    password: 'Demo@Viewer2025!',
    icon: Eye,
    color: 'from-gray-500 to-gray-700',
    description: 'Read-Only Access • Monitoring',
    redirectPath: '/dashboard',
    tier: 'staff',
  },
];

const DemoLogin = () => {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleDemoLogin = async (account: DemoAccount) => {
    setLoadingId(account.id);
    
    try {
      // Sign out first to clear any existing session
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(`Demo account not created yet. Please create: ${account.email}`);
        } else {
          toast.error(error.message);
        }
        setLoadingId(null);
        return;
      }

      setSuccessId(account.id);
      toast.success(`Logged in as ${account.role}`);
      
      setTimeout(() => {
        navigate(account.redirectPath);
      }, 500);
    } catch (err) {
      toast.error('Login failed');
      setLoadingId(null);
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'master': return { label: 'ROOT', color: 'bg-purple-500/20 text-purple-400' };
      case 'admin': return { label: 'ADMIN', color: 'bg-amber-500/20 text-amber-400' };
      case 'manager': return { label: 'MANAGER', color: 'bg-blue-500/20 text-blue-400' };
      case 'staff': return { label: 'STAFF', color: 'bg-emerald-500/20 text-emerald-400' };
      default: return { label: 'USER', color: 'bg-muted text-muted-foreground' };
    }
  };

  const groupedAccounts = {
    master: DEMO_ACCOUNTS.filter(a => a.tier === 'master'),
    admin: DEMO_ACCOUNTS.filter(a => a.tier === 'admin'),
    manager: DEMO_ACCOUNTS.filter(a => a.tier === 'manager'),
    staff: DEMO_ACCOUNTS.filter(a => a.tier === 'staff'),
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Demo Login Portal</h1>
          <p className="text-muted-foreground">
            One-click login for testing all role dashboards
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3 text-amber-400">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Demo Accounts Required</p>
              <p className="text-sm text-amber-400/80">
                You need to create these accounts in your backend first. Use the emails and passwords shown below.
              </p>
            </div>
          </div>
        </div>

        {/* Account Groups */}
        <div className="space-y-8">
          {/* Master Tier */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-400" />
              Root Authority
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.master.map((account, index) => (
                <DemoAccountCard
                  key={account.id}
                  account={account}
                  index={index}
                  loading={loadingId === account.id}
                  success={successId === account.id}
                  onLogin={() => handleDemoLogin(account)}
                  tierInfo={getTierLabel(account.tier)}
                />
              ))}
            </div>
          </div>

          {/* Admin Tier */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Administrative
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.admin.map((account, index) => (
                <DemoAccountCard
                  key={account.id}
                  account={account}
                  index={index}
                  loading={loadingId === account.id}
                  success={successId === account.id}
                  onLogin={() => handleDemoLogin(account)}
                  tierInfo={getTierLabel(account.tier)}
                />
              ))}
            </div>
          </div>

          {/* Manager Tier */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.manager.map((account, index) => (
                <DemoAccountCard
                  key={account.id}
                  account={account}
                  index={index}
                  loading={loadingId === account.id}
                  success={successId === account.id}
                  onLogin={() => handleDemoLogin(account)}
                  tierInfo={getTierLabel(account.tier)}
                />
              ))}
            </div>
          </div>

          {/* Staff Tier */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              Staff & Operations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.staff.map((account, index) => (
                <DemoAccountCard
                  key={account.id}
                  account={account}
                  index={index}
                  loading={loadingId === account.id}
                  success={successId === account.id}
                  onLogin={() => handleDemoLogin(account)}
                  tierInfo={getTierLabel(account.tier)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Credentials Reference */}
        <Card className="mt-8 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">All Demo Credentials</CardTitle>
            <CardDescription>Copy these to create accounts in your backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Password</th>
                    <th className="text-left p-2">Dashboard</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ACCOUNTS.map((account) => (
                    <tr key={account.id} className="border-b border-border/30">
                      <td className="p-2 font-medium">{account.role}</td>
                      <td className="p-2 font-mono text-xs">{account.email}</td>
                      <td className="p-2 font-mono text-xs">{account.password}</td>
                      <td className="p-2 font-mono text-xs text-primary">{account.redirectPath}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface DemoAccountCardProps {
  account: DemoAccount;
  index: number;
  loading: boolean;
  success: boolean;
  onLogin: () => void;
  tierInfo: { label: string; color: string };
}

const DemoAccountCard = ({ account, index, loading, success, onLogin, tierInfo }: DemoAccountCardProps) => {
  const Icon = account.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{account.role}</h3>
                <Badge variant="outline" className={tierInfo.color}>
                  {tierInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {account.description}
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={onLogin}
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Success!
                  </>
                ) : (
                  'Login as ' + account.role
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DemoLogin;
