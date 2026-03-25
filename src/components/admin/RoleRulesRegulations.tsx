import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Shield, Code2, Building2, Users, Sparkles, Star, Search,
  Target, ListTodo, Play, Lightbulb, HeartHandshake, TrendingUp,
  Wallet, Megaphone, Scale, UserPlus, Headphones, Brain, User,
  ShieldCheck, Beaker, ChevronDown, ChevronRight, CheckCircle,
  XCircle, AlertTriangle, Lock, Clock, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface RoleRule {
  category: string;
  rules: string[];
}

interface RoleDefinition {
  role: string;
  label: string;
  icon: React.ElementType;
  color: string;
  tier: string;
  hierarchyLevel: number;
  description: string;
  permissions: string[];
  restrictions: string[];
  rules: RoleRule[];
  kycRequired: boolean;
  ipLockRequired: boolean;
  subscriptionRequired: boolean;
}

const roleDefinitions: RoleDefinition[] = [
  {
    role: 'boss_owner',
    label: 'Boss Owner',
    icon: Crown,
    color: 'text-amber-500 bg-amber-500/20',
    tier: 'admin',
    hierarchyLevel: 110,
    description: 'Supreme system authority with unrestricted access to all modules and functions.',
    permissions: ['Full system access', 'Create/delete any role', 'Override all restrictions', 'Access all logs', 'Force logout any user', 'Manage all admins'],
    restrictions: ['None - full bypass authority'],
    rules: [
      { category: 'Authority', rules: ['Can assign/revoke any role', 'Bypass all security checks', 'Access encrypted audit logs'] },
      { category: 'Responsibility', rules: ['Must maintain audit trail', 'Cannot be force logged out', 'Actions are permanently logged'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    color: 'text-orange-500 bg-orange-500/20',
    tier: 'admin',
    hierarchyLevel: 90,
    description: 'System administrator with broad access for daily operations management.',
    permissions: ['View dashboards', 'Manage standard users', 'Access reports', 'Configure non-critical settings'],
    restrictions: ['Cannot approve super admins', 'Cannot access financial settings', 'Cannot force logout privileged users'],
    rules: [
      { category: 'Operations', rules: ['Monitor system health', 'Manage demo products', 'Handle support escalations'] },
      { category: 'Compliance', rules: ['Generate compliance reports', 'Track user activities', 'Maintain documentation'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'finance_manager',
    label: 'Finance Manager',
    icon: Wallet,
    color: 'text-green-500 bg-green-500/20',
    tier: 'manager',
    hierarchyLevel: 85,
    description: 'Manages all financial operations including wallets, payouts, and invoicing.',
    permissions: ['View all wallets', 'Approve payouts', 'Generate invoices', 'View commission reports', 'Manage payment gateways'],
    restrictions: ['Cannot modify user roles', 'Cannot access security settings', 'Cannot delete transactions'],
    rules: [
      { category: 'Transactions', rules: ['Verify payout requests within 24 hours', 'Flag suspicious transactions', 'Maintain audit trail'] },
      { category: 'Reporting', rules: ['Generate daily financial summaries', 'Reconcile accounts weekly', 'Submit tax reports quarterly'] },
      { category: 'Compliance', rules: ['Follow anti-money laundering protocols', 'Verify large transactions', 'Document all exceptions'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'legal_compliance',
    label: 'Legal & Compliance',
    icon: Scale,
    color: 'text-gray-500 bg-gray-500/20',
    tier: 'manager',
    hierarchyLevel: 80,
    description: 'Ensures legal compliance and manages contracts and agreements.',
    permissions: ['Manage contracts', 'Review compliance', 'Access legal documents', 'Approve agreements'],
    restrictions: ['Cannot access financial transactions', 'Cannot modify user data', 'Cannot access technical settings'],
    rules: [
      { category: 'Contracts', rules: ['Review all contracts before signing', 'Maintain contract repository', 'Track expiration dates'] },
      { category: 'Compliance', rules: ['Conduct quarterly audits', 'Update policy documents', 'Handle legal disputes'] },
      { category: 'Data Protection', rules: ['Ensure GDPR compliance', 'Process data requests', 'Maintain privacy policies'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'hr_manager',
    label: 'HR Manager',
    icon: UserPlus,
    color: 'text-orange-400 bg-orange-400/20',
    tier: 'manager',
    hierarchyLevel: 75,
    description: 'Manages hiring, onboarding, and team operations.',
    permissions: ['Manage hiring', 'Onboard new users', 'View team performance', 'Manage developer profiles'],
    restrictions: ['Cannot access financial data', 'Cannot modify security settings', 'Cannot access client data'],
    rules: [
      { category: 'Hiring', rules: ['Post job openings', 'Screen candidates', 'Coordinate interviews'] },
      { category: 'Onboarding', rules: ['Create onboarding plans', 'Assign mentors', 'Track training progress'] },
      { category: 'Performance', rules: ['Conduct reviews', 'Process complaints', 'Manage terminations'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'performance_manager',
    label: 'Performance Manager',
    icon: TrendingUp,
    color: 'text-rose-500 bg-rose-500/20',
    tier: 'manager',
    hierarchyLevel: 70,
    description: 'Monitors developer performance, manages escalations, and ensures quality.',
    permissions: ['View performance metrics', 'Manage escalations', 'Access developer profiles', 'Review promise breaches'],
    restrictions: ['Cannot access financial data', 'Cannot modify roles', 'Cannot access client communications'],
    rules: [
      { category: 'Monitoring', rules: ['Review daily performance reports', 'Track SLA compliance', 'Identify underperformers'] },
      { category: 'Escalation', rules: ['Handle breach escalations within 2 hours', 'Document all actions', 'Report patterns to HR'] },
      { category: 'Quality', rules: ['Conduct code reviews', 'Verify task completion', 'Manage quality audits'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'rnd_manager',
    label: 'R&D Manager',
    icon: Lightbulb,
    color: 'text-sky-500 bg-sky-500/20',
    tier: 'manager',
    hierarchyLevel: 65,
    description: 'Leads research and development initiatives, manages product roadmap.',
    permissions: ['Manage suggestions', 'Plan roadmap', 'Access research data', 'Coordinate experiments'],
    restrictions: ['Cannot access production systems directly', 'Cannot manage live deployments'],
    rules: [
      { category: 'Innovation', rules: ['Evaluate feature suggestions', 'Prototype new solutions', 'Document research findings'] },
      { category: 'Planning', rules: ['Maintain product roadmap', 'Prioritize features', 'Coordinate with stakeholders'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'r_and_d',
    label: 'R&D',
    icon: Beaker,
    color: 'text-sky-400 bg-sky-400/20',
    tier: 'manager',
    hierarchyLevel: 65,
    description: 'Research and development team member focused on innovation.',
    permissions: ['Access research tools', 'Submit experiments', 'View testing data'],
    restrictions: ['Cannot deploy to production', 'Cannot access user data'],
    rules: [
      { category: 'Research', rules: ['Document all experiments', 'Follow testing protocols', 'Report findings promptly'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'marketing_manager',
    label: 'Marketing Manager',
    icon: Megaphone,
    color: 'text-fuchsia-500 bg-fuchsia-500/20',
    tier: 'manager',
    hierarchyLevel: 60,
    description: 'Manages marketing campaigns and influencer relationships.',
    permissions: ['Manage campaigns', 'View influencer data', 'Access analytics', 'Approve marketing content'],
    restrictions: ['Cannot access financial transactions', 'Cannot modify user roles'],
    rules: [
      { category: 'Campaigns', rules: ['Plan campaigns quarterly', 'Track ROI', 'Report metrics weekly'] },
      { category: 'Influencers', rules: ['Verify influencer credentials', 'Monitor content quality', 'Handle disputes'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'demo_manager',
    label: 'Demo Manager',
    icon: Play,
    color: 'text-purple-500 bg-purple-500/20',
    tier: 'manager',
    hierarchyLevel: 55,
    description: 'Manages product demos, health monitoring, and demo access.',
    permissions: ['Manage demos', 'Monitor demo health', 'Configure demo settings', 'View demo analytics'],
    restrictions: ['Cannot access production data', 'Cannot modify user accounts'],
    rules: [
      { category: 'Demo Management', rules: ['Ensure 99.9% uptime', 'Update demos regularly', 'Monitor usage patterns'] },
      { category: 'Access Control', rules: ['Manage demo credentials', 'Track demo usage', 'Report suspicious access'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'task_manager',
    label: 'Task Manager',
    icon: ListTodo,
    color: 'text-indigo-500 bg-indigo-500/20',
    tier: 'manager',
    hierarchyLevel: 50,
    description: 'Assigns and monitors developer tasks, manages workload distribution.',
    permissions: ['Create tasks', 'Assign developers', 'View task progress', 'Manage deadlines'],
    restrictions: ['Cannot access financial data', 'Cannot modify user roles'],
    rules: [
      { category: 'Assignment', rules: ['Balance workload across team', 'Consider skill levels', 'Respect developer capacity (max 3 promises)'] },
      { category: 'Monitoring', rules: ['Track daily progress', 'Escalate delays', 'Document blockers'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'lead_manager',
    label: 'Lead Manager',
    icon: Target,
    color: 'text-teal-500 bg-teal-500/20',
    tier: 'manager',
    hierarchyLevel: 45,
    description: 'Manages lead pipeline and distribution to franchise/resellers.',
    permissions: ['View all leads', 'Assign leads', 'Track conversions', 'Generate lead reports'],
    restrictions: ['Cannot access financial transactions', 'Cannot modify pricing'],
    rules: [
      { category: 'Distribution', rules: ['Assign leads within 30 minutes', 'Balance across regions', 'Prioritize hot leads'] },
      { category: 'Tracking', rules: ['Update lead status daily', 'Follow up on stale leads', 'Report conversion rates'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'seo_manager',
    label: 'SEO Manager',
    icon: Search,
    color: 'text-green-400 bg-green-400/20',
    tier: 'manager',
    hierarchyLevel: 40,
    description: 'Manages SEO strategy, keywords, and search analytics.',
    permissions: ['Manage keywords', 'View analytics', 'Configure SEO settings', 'Generate SEO reports'],
    restrictions: ['Cannot access user data', 'Cannot modify site structure'],
    rules: [
      { category: 'SEO', rules: ['Track keyword rankings weekly', 'Optimize meta tags', 'Monitor backlinks'] },
      { category: 'Reporting', rules: ['Generate monthly SEO reports', 'Track organic traffic', 'Analyze competitors'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'client_success',
    label: 'Client Success',
    icon: HeartHandshake,
    color: 'text-emerald-500 bg-emerald-500/20',
    tier: 'manager',
    hierarchyLevel: 35,
    description: 'Ensures client satisfaction and manages client relationships.',
    permissions: ['View client data', 'Manage satisfaction surveys', 'Handle complaints', 'Access support tickets'],
    restrictions: ['Cannot access financial transactions', 'Cannot modify contracts'],
    rules: [
      { category: 'Client Care', rules: ['Respond within 4 hours', 'Follow up on issues', 'Conduct satisfaction surveys'] },
      { category: 'Retention', rules: ['Identify at-risk clients', 'Propose solutions', 'Document all interactions'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'ai_manager',
    label: 'AI Manager',
    icon: Brain,
    color: 'text-violet-500 bg-violet-500/20',
    tier: 'manager',
    hierarchyLevel: 30,
    description: 'Manages AI systems, cache optimization, and AI-driven features.',
    permissions: ['Access AI console', 'Configure AI settings', 'View AI usage', 'Manage cache'],
    restrictions: ['Cannot access user data directly', 'Cannot modify security settings'],
    rules: [
      { category: 'AI Operations', rules: ['Monitor AI performance', 'Optimize cache usage', 'Track API costs'] },
      { category: 'Quality', rules: ['Review AI outputs', 'Handle AI errors', 'Document edge cases'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'api_security',
    label: 'API Security',
    icon: ShieldCheck,
    color: 'text-red-400 bg-red-400/20',
    tier: 'manager',
    hierarchyLevel: 28,
    description: 'Manages API security, integrations, and access control.',
    permissions: ['Manage API keys', 'Monitor security', 'View access logs', 'Configure integrations'],
    restrictions: ['Cannot access user data', 'Cannot modify roles'],
    rules: [
      { category: 'Security', rules: ['Review API access daily', 'Rotate keys quarterly', 'Monitor for breaches'] },
      { category: 'Integrations', rules: ['Validate third-party APIs', 'Document all integrations', 'Handle auth errors'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'support',
    label: 'Support',
    icon: Headphones,
    color: 'text-cyan-400 bg-cyan-400/20',
    tier: 'user',
    hierarchyLevel: 25,
    description: 'Handles customer support tickets and knowledge base.',
    permissions: ['View tickets', 'Respond to queries', 'Access knowledge base', 'Escalate issues'],
    restrictions: ['Cannot access financial data', 'Cannot modify user accounts'],
    rules: [
      { category: 'Response', rules: ['First response within 1 hour', 'Resolve within 24 hours', 'Escalate complex issues'] },
      { category: 'Documentation', rules: ['Update knowledge base', 'Document solutions', 'Track common issues'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'franchise',
    label: 'Franchise',
    icon: Building2,
    color: 'text-blue-500 bg-blue-500/20',
    tier: 'partner',
    hierarchyLevel: 20,
    description: 'Franchise partner with regional operations and reseller management.',
    permissions: ['Manage leads', 'View resellers', 'Access demos', 'View wallet', 'Generate invoices'],
    restrictions: ['Region-locked access', 'Cannot modify pricing', 'Cannot access other franchises'],
    rules: [
      { category: 'Operations', rules: ['Maintain 90% lead response rate', 'Report weekly to HQ', 'Follow brand guidelines'] },
      { category: 'Compliance', rules: ['Submit monthly reports', 'Maintain KYC compliance', 'Follow territory agreements'] },
      { category: 'Financial', rules: ['Invoice clients within 7 days', 'Report all transactions', 'Maintain min balance'] }
    ],
    kycRequired: true,
    ipLockRequired: true,
    subscriptionRequired: true
  },
  {
    role: 'reseller',
    label: 'Reseller',
    icon: Users,
    color: 'text-cyan-500 bg-cyan-500/20',
    tier: 'partner',
    hierarchyLevel: 15,
    description: 'Reseller partner for lead generation and sales.',
    permissions: ['Submit leads', 'View demos', 'Access wallet', 'View commission'],
    restrictions: ['Cannot manage other resellers', 'Cannot access backend systems'],
    rules: [
      { category: 'Sales', rules: ['Submit qualified leads only', 'Follow up within 48 hours', 'Report conversions accurately'] },
      { category: 'Compliance', rules: ['Maintain KYC documents', 'Follow pricing guidelines', 'No unauthorized discounts'] }
    ],
    kycRequired: true,
    ipLockRequired: false,
    subscriptionRequired: true
  },
  {
    role: 'developer',
    label: 'Developer',
    icon: Code2,
    color: 'text-violet-500 bg-violet-500/20',
    tier: 'user',
    hierarchyLevel: 12,
    description: 'Developer with task access and timer functionality.',
    permissions: ['View assigned tasks', 'Use timer', 'Access wallet', 'Use internal chat'],
    restrictions: ['Cannot access client data', 'Cannot modify task assignments', 'Max 3 concurrent promises'],
    rules: [
      { category: 'Work', rules: ['Promise before starting task', 'Complete within deadline', 'Report blockers immediately'] },
      { category: 'Quality', rules: ['Follow coding standards', 'Test before submission', 'Document code changes'] },
      { category: 'SLA', rules: ['Breach penalty: ₹50', 'Max 3 active promises', 'No work without promise'] }
    ],
    kycRequired: true,
    ipLockRequired: true,
    subscriptionRequired: false
  },
  {
    role: 'influencer',
    label: 'Influencer',
    icon: Sparkles,
    color: 'text-pink-500 bg-pink-500/20',
    tier: 'partner',
    hierarchyLevel: 10,
    description: 'Influencer partner for marketing and referrals.',
    permissions: ['Generate tracking links', 'View analytics', 'Access wallet', 'Use chat'],
    restrictions: ['Cannot access backend', 'Cannot modify content'],
    rules: [
      { category: 'Content', rules: ['Follow brand guidelines', 'Disclose partnerships', 'No false claims'] },
      { category: 'Performance', rules: ['Minimum monthly activity', 'Report accurate metrics', 'Maintain engagement rates'] }
    ],
    kycRequired: true,
    ipLockRequired: false,
    subscriptionRequired: false
  },
  {
    role: 'prime',
    label: 'Prime User',
    icon: Star,
    color: 'text-amber-500 bg-amber-500/20',
    tier: 'user',
    hierarchyLevel: 8,
    description: 'Premium client with dedicated support and demo access.',
    permissions: ['Access demos', 'Priority support', 'Dedicated chat'],
    restrictions: ['Cannot access internal systems', 'Cannot manage other users'],
    rules: [
      { category: 'Access', rules: ['Priority support response', 'Extended demo access', 'Dedicated success manager'] }
    ],
    kycRequired: false,
    ipLockRequired: true,
    subscriptionRequired: true
  },
  {
    role: 'client',
    label: 'Client',
    icon: User,
    color: 'text-slate-400 bg-slate-400/20',
    tier: 'user',
    hierarchyLevel: 5,
    description: 'Standard client with basic access.',
    permissions: ['View demos', 'Contact support'],
    restrictions: ['Cannot access internal systems', 'Limited demo time'],
    rules: [
      { category: 'Access', rules: ['Standard support SLA', 'Limited demo duration', 'Basic feature access'] }
    ],
    kycRequired: false,
    ipLockRequired: false,
    subscriptionRequired: false
  }
];

const RoleRulesRegulations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const tiers = ['admin', 'manager', 'partner', 'user'];

  const filteredRoles = roleDefinitions.filter(role => {
    const matchesSearch = role.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = !selectedTier || role.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Role Rules & Regulations</h2>
          <p className="text-muted-foreground">Complete documentation of all 24 system roles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      {/* Tier Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedTier === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTier(null)}
        >
          All Roles ({roleDefinitions.length})
        </Button>
        {tiers.map(tier => (
          <Button
            key={tier}
            variant={selectedTier === tier ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTier(tier)}
            className="capitalize"
          >
            {tier} ({roleDefinitions.filter(r => r.tier === tier).length})
          </Button>
        ))}
      </div>

      {/* Role Cards */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-4">
          {filteredRoles.map((role, index) => (
            <motion.div
              key={role.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-card/50 border-border/50 overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedRole(expandedRole === role.role ? null : role.role)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.color}`}>
                        <role.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{role.label}</CardTitle>
                          <Badge variant="outline" className="capitalize text-xs">{role.tier}</Badge>
                          <Badge variant="secondary" className="text-xs">Level {role.hierarchyLevel}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {role.kycRequired && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          <FileText className="w-3 h-3 mr-1" />
                          KYC
                        </Badge>
                      )}
                      {role.ipLockRequired && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <Lock className="w-3 h-3 mr-1" />
                          IP Lock
                        </Badge>
                      )}
                      {role.subscriptionRequired && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          Subscription
                        </Badge>
                      )}
                      {expandedRole === role.role ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedRole === role.role && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="border-t border-border/50 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Permissions */}
                          <div>
                            <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Permissions
                            </h4>
                            <ul className="space-y-2">
                              {role.permissions.map((perm, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span>{perm}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Restrictions */}
                          <div>
                            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                              <XCircle className="w-4 h-4" />
                              Restrictions
                            </h4>
                            <ul className="space-y-2">
                              {role.restrictions.map((rest, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                  <span>{rest}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Rules by Category */}
                        <div className="mt-6">
                          <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Rules & Regulations
                          </h4>
                          <Accordion type="multiple" className="w-full">
                            {role.rules.map((ruleCategory, i) => (
                              <AccordionItem key={i} value={`${role.role}-${i}`} className="border-border/50">
                                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                  {ruleCategory.category}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 pl-4">
                                    {ruleCategory.rules.map((rule, j) => (
                                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="text-primary">•</span>
                                        <span>{rule}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RoleRulesRegulations;
