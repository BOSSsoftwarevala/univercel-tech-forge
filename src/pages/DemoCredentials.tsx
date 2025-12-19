import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Download, Copy, Check, Search, Shield, Crown, Code2, Building2, 
  Users, Sparkles, Star, Target, ListTodo, Play, Lightbulb, 
  HeartHandshake, TrendingUp, Wallet, Megaphone, Scale, UserPlus, 
  Headphones, Brain, User, Eye, EyeOff, Lock
} from "lucide-react";
import { toast } from "sonner";

interface DemoCredential {
  role: string;
  label: string;
  email: string;
  password: string;
  color: string;
  icon: React.ElementType;
  tier: 'admin' | 'manager' | 'partner' | 'user';
  dashboardPath: string;
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  // Admin Tier
  { role: 'super_admin', label: 'Super Admin', email: 'superadmin@softwarevala.demo', password: 'SuperAdmin@2024!', color: '#ef4444', icon: Crown, tier: 'admin', dashboardPath: '/super-admin' },
  { role: 'admin', label: 'Admin', email: 'admin@softwarevala.demo', password: 'Admin@2024!', color: '#f97316', icon: Shield, tier: 'admin', dashboardPath: '/admin' },
  
  // Manager Tier
  { role: 'seo_manager', label: 'SEO Manager', email: 'seo@softwarevala.demo', password: 'SEOManager@2024!', color: '#22c55e', icon: Search, tier: 'manager', dashboardPath: '/seo-dashboard' },
  { role: 'lead_manager', label: 'Lead Manager', email: 'leads@softwarevala.demo', password: 'LeadManager@2024!', color: '#14b8a6', icon: Target, tier: 'manager', dashboardPath: '/lead-manager' },
  { role: 'task_manager', label: 'Task Manager', email: 'tasks@softwarevala.demo', password: 'TaskManager@2024!', color: '#6366f1', icon: ListTodo, tier: 'manager', dashboardPath: '/task-manager' },
  { role: 'demo_manager', label: 'Demo Manager', email: 'demos@softwarevala.demo', password: 'DemoManager@2024!', color: '#a855f7', icon: Play, tier: 'manager', dashboardPath: '/demo-manager' },
  { role: 'rnd_manager', label: 'R&D Manager', email: 'rnd@softwarevala.demo', password: 'RnDManager@2024!', color: '#0ea5e9', icon: Lightbulb, tier: 'manager', dashboardPath: '/rnd-dashboard' },
  { role: 'client_success', label: 'Client Success', email: 'success@softwarevala.demo', password: 'ClientSuccess@2024!', color: '#10b981', icon: HeartHandshake, tier: 'manager', dashboardPath: '/client-success' },
  { role: 'performance_manager', label: 'Performance Manager', email: 'performance@softwarevala.demo', password: 'Performance@2024!', color: '#f43f5e', icon: TrendingUp, tier: 'manager', dashboardPath: '/performance' },
  { role: 'finance_manager', label: 'Finance Manager', email: 'finance@softwarevala.demo', password: 'Finance@2024!', color: '#84cc16', icon: Wallet, tier: 'manager', dashboardPath: '/finance' },
  { role: 'marketing_manager', label: 'Marketing Manager', email: 'marketing@softwarevala.demo', password: 'Marketing@2024!', color: '#d946ef', icon: Megaphone, tier: 'manager', dashboardPath: '/marketing' },
  { role: 'legal_compliance', label: 'Legal & Compliance', email: 'legal@softwarevala.demo', password: 'LegalCompliance@2024!', color: '#78716c', icon: Scale, tier: 'manager', dashboardPath: '/legal' },
  { role: 'hr_manager', label: 'HR Manager', email: 'hr@softwarevala.demo', password: 'HRManager@2024!', color: '#fb923c', icon: UserPlus, tier: 'manager', dashboardPath: '/hr-dashboard' },
  { role: 'ai_manager', label: 'AI Manager', email: 'ai@softwarevala.demo', password: 'AIManager@2024!', color: '#c084fc', icon: Brain, tier: 'manager', dashboardPath: '/ai-console' },
  
  // Partner Tier
  { role: 'franchise', label: 'Franchise', email: 'franchise@softwarevala.demo', password: 'Franchise@2024!', color: '#3b82f6', icon: Building2, tier: 'partner', dashboardPath: '/franchise' },
  { role: 'reseller', label: 'Reseller', email: 'reseller@softwarevala.demo', password: 'Reseller@2024!', color: '#06b6d4', icon: Users, tier: 'partner', dashboardPath: '/reseller' },
  { role: 'influencer', label: 'Influencer', email: 'influencer@softwarevala.demo', password: 'Influencer@2024!', color: '#ec4899', icon: Sparkles, tier: 'partner', dashboardPath: '/influencer' },
  
  // User Tier
  { role: 'developer', label: 'Developer', email: 'developer@softwarevala.demo', password: 'Developer@2024!', color: '#8b5cf6', icon: Code2, tier: 'user', dashboardPath: '/developer' },
  { role: 'prime', label: 'Prime User', email: 'prime@softwarevala.demo', password: 'PrimeUser@2024!', color: '#f59e0b', icon: Star, tier: 'user', dashboardPath: '/prime' },
  { role: 'support', label: 'Support Agent', email: 'support@softwarevala.demo', password: 'Support@2024!', color: '#38bdf8', icon: Headphones, tier: 'user', dashboardPath: '/support' },
  { role: 'client', label: 'Client', email: 'client@softwarevala.demo', password: 'Client@2024!', color: '#94a3b8', icon: User, tier: 'user', dashboardPath: '/dashboard' },
];

const DemoCredentials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredCredentials = DEMO_CREDENTIALS.filter(cred =>
    cred.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tierOrder = { admin: 0, manager: 1, partner: 2, user: 3 };
  const sortedCredentials = [...filteredCredentials].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  const handleCopy = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePassword = (role: string) => {
    setShowPasswords(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const generateCredentialsFile = () => {
    const content = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                     SOFTWARE VALA - DEMO LOGIN CREDENTIALS                    ║
║                              All 21 Role Accounts                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

Generated: ${new Date().toISOString()}
Base URL: ${window.location.origin}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 ADMIN TIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${DEMO_CREDENTIALS.filter(c => c.tier === 'admin').map(c => `
┌─ ${c.label.toUpperCase()} ─────────────────────────────────────
│  Role:      ${c.role}
│  Email:     ${c.email}
│  Password:  ${c.password}
│  Dashboard: ${window.location.origin}${c.dashboardPath}
└────────────────────────────────────────────────────────────────`).join('\n')}

🟠 MANAGER TIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${DEMO_CREDENTIALS.filter(c => c.tier === 'manager').map(c => `
┌─ ${c.label.toUpperCase()} ─────────────────────────────────────
│  Role:      ${c.role}
│  Email:     ${c.email}
│  Password:  ${c.password}
│  Dashboard: ${window.location.origin}${c.dashboardPath}
└────────────────────────────────────────────────────────────────`).join('\n')}

🔵 PARTNER TIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${DEMO_CREDENTIALS.filter(c => c.tier === 'partner').map(c => `
┌─ ${c.label.toUpperCase()} ─────────────────────────────────────
│  Role:      ${c.role}
│  Email:     ${c.email}
│  Password:  ${c.password}
│  Dashboard: ${window.location.origin}${c.dashboardPath}
└────────────────────────────────────────────────────────────────`).join('\n')}

🟢 USER TIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${DEMO_CREDENTIALS.filter(c => c.tier === 'user').map(c => `
┌─ ${c.label.toUpperCase()} ─────────────────────────────────────
│  Role:      ${c.role}
│  Email:     ${c.email}
│  Password:  ${c.password}
│  Dashboard: ${window.location.origin}${c.dashboardPath}
└────────────────────────────────────────────────────────────────`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  SECURITY NOTICE: These are demo credentials for testing purposes only.
    Do not use in production environments.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SoftwareVala_Demo_Credentials.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Credentials file downloaded!");
  };

  const generateCSV = () => {
    const headers = ['Role', 'Label', 'Email', 'Password', 'Tier', 'Dashboard URL'];
    const rows = DEMO_CREDENTIALS.map(c => [
      c.role,
      c.label,
      c.email,
      c.password,
      c.tier,
      `${window.location.origin}${c.dashboardPath}`
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SoftwareVala_Demo_Credentials.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CSV file downloaded!");
  };

  const generateJSON = () => {
    const data = {
      generated: new Date().toISOString(),
      baseUrl: window.location.origin,
      credentials: DEMO_CREDENTIALS.map(c => ({
        role: c.role,
        label: c.label,
        email: c.email,
        password: c.password,
        tier: c.tier,
        dashboardUrl: `${window.location.origin}${c.dashboardPath}`
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SoftwareVala_Demo_Credentials.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON file downloaded!");
  };

  const tierColors = {
    admin: 'from-red-500/20 to-orange-500/20 border-red-500/30',
    manager: 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
    partner: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    user: 'from-green-500/20 to-teal-500/20 border-green-500/30'
  };

  const tierLabels = {
    admin: { label: 'Admin', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    manager: { label: 'Manager', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    partner: { label: 'Partner', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    user: { label: 'User', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Lock className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Demo Login Credentials
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access all 21 role dashboards with these demo credentials. Download as TXT, CSV, or JSON.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generateCredentialsFile} className="gap-2">
              <Download className="w-4 h-4" />
              TXT
            </Button>
            <Button onClick={generateCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button onClick={generateJSON} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              JSON
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(tierLabels).map(([tier, config], i) => (
            <motion.div
              key={tier}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className={`bg-gradient-to-br ${tierColors[tier as keyof typeof tierColors]} backdrop-blur-xl border`}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {DEMO_CREDENTIALS.filter(c => c.tier === tier).length}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{tier} Roles</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCredentials.map((cred, index) => (
            <motion.div
              key={cred.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card className={`bg-gradient-to-br ${tierColors[cred.tier]} backdrop-blur-xl border hover:border-primary/50 transition-all duration-300 group`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${cred.color}20` }}
                      >
                        <cred.icon className="w-5 h-5" style={{ color: cred.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">{cred.label}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono">{cred.role}</p>
                      </div>
                    </div>
                    <Badge className={tierLabels[cred.tier].color + ' border text-xs'}>
                      {tierLabels[cred.tier].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Email</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-slate-900/50 px-3 py-2 rounded-lg text-foreground truncate">
                        {cred.email}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleCopy(cred.email, `email-${cred.role}`)}
                      >
                        {copiedField === `email-${cred.role}` ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Password</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-slate-900/50 px-3 py-2 rounded-lg text-foreground truncate">
                        {showPasswords[cred.role] ? cred.password : '••••••••••••'}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={() => togglePassword(cred.role)}
                      >
                        {showPasswords[cred.role] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleCopy(cred.password, `password-${cred.role}`)}
                      >
                        {copiedField === `password-${cred.role}` ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <a
                    href={cred.dashboardPath}
                    className="block text-center py-2 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
                  >
                    Open Dashboard →
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 flex items-center gap-4">
              <Shield className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-400">Security Notice</h3>
                <p className="text-sm text-muted-foreground">
                  These are demo credentials for testing purposes only. Do not use in production environments.
                  All passwords follow strong security patterns but should be changed for real deployments.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoCredentials;
