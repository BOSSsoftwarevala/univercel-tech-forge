import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, Users, Code, Store, Megaphone, UserCheck, 
  Briefcase, BarChart3, FileText, Headphones, Target,
  Zap, Globe, Smartphone, ArrowRight, Copy, Check
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// All demo roles with their access URLs
const DEMO_ROLES = [
  {
    id: 'master',
    name: 'Master Admin',
    description: 'Full system control, all modules, master audit logs',
    icon: Shield,
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-500/10',
    features: ['System Control', 'All Modules', 'Master Logs', 'User Management'],
    tier: 'Master'
  },
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Administrative control, user management, analytics',
    icon: Shield,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-500/10',
    features: ['Admin Dashboard', 'User Manager', 'Analytics', 'Security Center'],
    tier: 'Admin'
  },
  {
    id: 'franchise',
    name: 'Franchise Partner',
    description: 'Territory management, lead board, wallet, performance',
    icon: Store,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    features: ['Lead Board', 'Wallet', 'Team Management', 'Performance'],
    tier: 'Partner'
  },
  {
    id: 'reseller',
    name: 'Reseller Partner',
    description: 'Sales dashboard, demo access, commission tracking',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    features: ['Sales Dashboard', 'Demo Library', 'Commissions', 'Leads'],
    tier: 'Partner'
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Task management, code access, timer, wallet',
    icon: Code,
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-500/10',
    features: ['Task Board', 'Code Access', 'Timer', 'Wallet'],
    tier: 'Staff'
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Referral links, click tracking, earnings dashboard',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
    features: ['Referral Links', 'Analytics', 'Earnings', 'Campaigns'],
    tier: 'Partner'
  },
  {
    id: 'prime',
    name: 'Prime User',
    description: 'Priority support, dedicated manager, premium features',
    icon: UserCheck,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    features: ['Priority Support', 'Dedicated Manager', 'Premium Access', 'SLA'],
    tier: 'Premium'
  },
];

// Manager roles
const MANAGER_ROLES = [
  { id: 'lead-manager', name: 'Lead Manager', icon: Target },
  { id: 'task-manager', name: 'Task Manager', icon: FileText },
  { id: 'demo-manager', name: 'Demo Manager', icon: Globe },
  { id: 'seo-manager', name: 'SEO Manager', icon: BarChart3 },
  { id: 'finance-manager', name: 'Finance Manager', icon: Briefcase },
  { id: 'support', name: 'Support', icon: Headphones },
];

const DemoDirectory = () => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const baseUrl = window.location.origin;

  const copyLink = (roleId: string) => {
    const url = `${baseUrl}/demo/${roleId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(roleId);
    toast({
      title: 'Link Copied!',
      description: `Demo URL for ${roleId} copied to clipboard`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Master': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Partner': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Staff': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Premium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SoftwareVala Demo</h1>
              <p className="text-xs text-white/50">One-Click Access to All Roles</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Smartphone className="w-3 h-3 mr-1" />
            No Login Required
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Demo Access Directory
          </h1>
          <p className="text-lg text-white/60 mb-8">
            Click any role below to instantly access that dashboard. No password needed.
            Works on unlimited devices from any country.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/50">
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" /> One-Click Login
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" /> Unlimited Devices
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" /> All Countries
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" /> Full Access
            </span>
          </div>
        </motion.div>
      </section>

      {/* Main Roles Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6">Core Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_ROLES.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-white/10 hover:border-white/20 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className={getTierColor(role.tier)}>
                          {role.tier}
                        </Badge>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-white mb-2">{role.name}</h3>
                      <p className="text-sm text-white/60 mb-4">{role.description}</p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {role.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-white/50"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link to={`/demo/${role.id}`} className="flex-1">
                          <Button
                            className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white`}
                          >
                            Access Demo
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => copyLink(role.id)}
                        >
                          {copiedId === role.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {/* URL Display */}
                      <div className="mt-3 p-2 bg-slate-900/50 rounded-lg">
                        <code className="text-xs text-white/40 break-all">
                          {baseUrl}/demo/{role.id}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* URL Reference Table */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6">All Demo URLs</h2>
          <Card className="bg-slate-800/50 border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/50">
                    <th className="text-left p-4 text-sm font-medium text-white/70">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-white/70">Demo URL</th>
                    <th className="text-left p-4 text-sm font-medium text-white/70">Dashboard</th>
                    <th className="text-right p-4 text-sm font-medium text-white/70">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ROLES.map((role) => (
                    <tr key={role.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <role.icon className="w-4 h-4 text-white/50" />
                          <span className="text-white font-medium">{role.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-sm text-primary">/demo/{role.id}</code>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-white/50">
                          {role.id === 'boss_owner' ? '/super-admin' :
                           `/${role.id}`}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyLink(role.id)}
                            className="text-white/70 hover:text-white"
                          >
                            {copiedId === role.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          <Link to={`/demo/${role.id}`}>
                            <Button size="sm" variant="default">
                              Go <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center">
        <p className="text-sm text-white/40">
          SoftwareVala Demo Access • No restrictions • Unlimited usage
        </p>
      </footer>
    </div>
  );
};

export default DemoDirectory;
