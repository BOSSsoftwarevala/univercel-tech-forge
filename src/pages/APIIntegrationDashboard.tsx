import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, Server, Globe, CreditCard, Shield, Code, Search, 
  MessageSquare, Wallet, Monitor, BarChart, FileText, Users,
  Megaphone, Scale, ChevronRight, CheckCircle, AlertTriangle,
  Lock, Unlock, ExternalLink, Filter, MapPin, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// API Data
const apiModuleMapping = {
  'Lead Management': {
    icon: Users,
    apis: ['Twilio', 'Google Maps', 'Firebase', 'SendGrid', 'Mailgun'],
    color: 'emerald'
  },
  'Developer Module': {
    icon: Code,
    apis: ['GitHub Actions', 'Docker', 'Supabase', 'Sentry', 'Socket.IO'],
    color: 'violet'
  },
  'SEO Module': {
    icon: Search,
    apis: ['Search Console', 'Ahrefs', 'Moz', 'PageSpeed', 'KeywordTool'],
    color: 'cyan'
  },
  'Support Module': {
    icon: MessageSquare,
    apis: ['DialogFlow', 'Telegram Bot', 'Slack API', 'WhatsApp Business'],
    color: 'amber'
  },
  'Wallet Module': {
    icon: Wallet,
    apis: ['Razorpay', 'Stripe', 'PayPal', 'Paystack', 'Coinbase'],
    color: 'green'
  },
  'Demo Module': {
    icon: Monitor,
    apis: ['Firebase Hosting', 'Render', 'Railway', 'Cloudinary', 'MapBox'],
    color: 'blue'
  },
  'Performance Module': {
    icon: BarChart,
    apis: ['Grafana', 'Prometheus', 'NewRelic'],
    color: 'orange'
  },
  'Legal Module': {
    icon: Scale,
    apis: ['DocuSign', 'KYC APIs', 'IPinfo', 'reCAPTCHA'],
    color: 'rose'
  },
  'HR/Recruitment': {
    icon: Users,
    apis: ['LinkedIn API', 'Google Jobs API', 'Calendly'],
    color: 'purple'
  },
  'Client Success': {
    icon: Megaphone,
    apis: ['SurveyMonkey', 'ChatGPT Sentiment', 'EmailJet'],
    color: 'teal'
  }
};

const roleApiMapping: Record<string, string[]> = {
  'Super Admin': ['ALL APIs', 'Auth0', 'Stripe', 'Search Console'],
  'Franchise': ['Wallet APIs', 'Lead APIs', 'Maps'],
  'Reseller': ['Lead APIs', 'Email', 'Wallet'],
  'Developer': ['GitHub', 'Docker', 'Sentry', 'Cloudinary'],
  'Support': ['DialogFlow', 'WhatsApp', 'Slack', 'CRM'],
  'SEO Manager': ['Search Console', 'Moz', 'Ahrefs'],
  'Finance Manager': ['Razorpay', 'PayPal', 'Tax APIs'],
  'HR Manager': ['LinkedIn', 'Jobs API', 'Auth0'],
  'Marketing Manager': ['Ubersuggest', 'SimilarWeb', 'EmailJet'],
  'Legal': ['DocuSign', 'IPinfo', 'Compliance APIs']
};

const pricingTiers = {
  free: {
    label: 'Free Tier',
    color: 'emerald',
    apis: ['Firebase', 'Supabase', 'DeepL', 'Google Maps (free)', 'Brevo', 'Cloudinary', 'Vercel', 'Render', 'Railway', 'OpenStreetMap']
  },
  paid: {
    label: 'Paid Option',
    color: 'blue',
    apis: ['Stripe', 'Razorpay', 'Paystack', 'Ahrefs', 'Moz', 'DocuSign', 'LinkedIn API']
  },
  enterprise: {
    label: 'Enterprise',
    color: 'red',
    apis: ['AWS Translate', 'IBM Watson', 'Nvidia NLP', 'NewRelic Enterprise', 'Datadog']
  }
};

const regionVariants = {
  'India': { apis: ['Razorpay', 'MSG91', 'Paytm', 'MapMyIndia'], flag: '🇮🇳' },
  'Africa': { apis: ['Paystack', 'Flutterwave', "Africa's Talking SMS", 'GeoIP Africa'], flag: '🌍' },
  'Europe': { apis: ['Stripe', 'SEPA', 'GDPR APIs', 'EU SMS'], flag: '🇪🇺' },
  'US': { apis: ['Stripe', 'Square', 'AWS Services', 'Twilio'], flag: '🇺🇸' },
  'Middle East': { apis: ['Tap Payments', 'STC Pay', 'Noon SMS', 'Regional KYC'], flag: '🇦🇪' }
};

const priorityTiers = {
  tier1: { label: 'Critical', color: 'red', items: ['Auth & Security', 'Wallet & Payments', 'Lead APIs', 'Chat & Notifications', 'Database Hosting'] },
  tier2: { label: 'Important', color: 'amber', items: ['SEO Analytics', 'Performance Monitoring', 'Demo Hosting', 'Automation', 'Support AI'] },
  tier3: { label: 'Enhancers', color: 'slate', items: ['Influencer Tracking', 'Region APIs', 'Compliance', 'OCR', 'Media CDNs'] }
};

const APIIntegrationDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('modules');

  const getApiStatus = (api: string) => {
    // Simulated status - in real app this would come from actual integration checks
    const connected = ['Firebase', 'Supabase', 'Cloudinary', 'Vercel'].includes(api);
    const pending = ['Stripe', 'Razorpay'].includes(api);
    if (connected) return 'connected';
    if (pending) return 'pending';
    return 'not_connected';
  };

  const getPricingTier = (api: string) => {
    if (pricingTiers.free.apis.includes(api)) return 'free';
    if (pricingTiers.paid.apis.includes(api)) return 'paid';
    if (pricingTiers.enterprise.apis.includes(api)) return 'enterprise';
    return 'unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white p-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="api-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" className="text-blue-500" />
              <path d="M 30 0 V 60 M 0 30 H 60" stroke="currentColor" strokeWidth="0.3" className="text-blue-500/50" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#api-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Cloud className="w-8 h-8 text-blue-400" />
              API Integration Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Manage all third-party API integrations across modules</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              4 Connected
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              <AlertTriangle className="w-3 h-3 mr-1" />
              2 Pending
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.keys(regionVariants).map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="modules" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Server className="w-4 h-4 mr-2" />
              By Module
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Shield className="w-4 h-4 mr-2" />
              By Role
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <CreditCard className="w-4 h-4 mr-2" />
              Pricing Tiers
            </TabsTrigger>
            <TabsTrigger value="priority" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Zap className="w-4 h-4 mr-2" />
              Priority
            </TabsTrigger>
            <TabsTrigger value="regions" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Globe className="w-4 h-4 mr-2" />
              Regions
            </TabsTrigger>
          </TabsList>

          {/* By Module Tab */}
          <TabsContent value="modules">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(apiModuleMapping).map(([module, data], index) => {
                const Icon = data.icon;
                return (
                  <motion.div
                    key={module}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`bg-slate-900/50 border-${data.color}-500/30 hover:border-${data.color}-500/50 transition-all`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                          <div className={`p-2 rounded-lg bg-${data.color}-500/20`}>
                            <Icon className={`w-5 h-5 text-${data.color}-400`} />
                          </div>
                          {module}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {data.apis.map((api) => {
                            const status = getApiStatus(api);
                            const pricing = getPricingTier(api);
                            return (
                              <div key={api} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-center gap-2">
                                  {status === 'connected' ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  ) : status === 'pending' ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-slate-500" />
                                  )}
                                  <span className="text-sm text-white">{api}</span>
                                </div>
                                <Badge variant="outline" className={`text-xs ${
                                  pricing === 'free' ? 'border-emerald-500/30 text-emerald-400' :
                                  pricing === 'paid' ? 'border-blue-500/30 text-blue-400' :
                                  pricing === 'enterprise' ? 'border-red-500/30 text-red-400' :
                                  'border-slate-500/30 text-slate-400'
                                }`}>
                                  {pricing}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* By Role Tab */}
          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(roleApiMapping).map(([role, apis], index) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <h3 className="font-semibold text-white">{role}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {apis.map((api) => (
                              <Badge key={api} variant="secondary" className="bg-slate-800 text-slate-300">
                                {api}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                          {apis.length} APIs
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Pricing Tiers Tab */}
          <TabsContent value="pricing">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(pricingTiers).map(([tier, data], index) => (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-slate-900/50 border-${data.color}-500/30 h-full`}>
                    <CardHeader>
                      <CardTitle className={`text-${data.color}-400 flex items-center gap-2`}>
                        <div className={`w-4 h-4 rounded-full bg-${data.color}-500`} />
                        {data.label}
                        <Badge variant="outline" className={`ml-auto border-${data.color}-500/30 text-${data.color}-400`}>
                          {data.apis.length} APIs
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {data.apis.map((api) => (
                          <div key={api} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
                            <CheckCircle className={`w-4 h-4 text-${data.color}-400`} />
                            <span className="text-sm text-white">{api}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Priority Tab */}
          <TabsContent value="priority">
            <div className="space-y-6">
              {Object.entries(priorityTiers).map(([tier, data], index) => (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-slate-900/50 border-${data.color}-500/30`}>
                    <CardHeader className="pb-3">
                      <CardTitle className={`text-${data.color}-400 flex items-center gap-2`}>
                        <Badge className={`bg-${data.color}-500/20 text-${data.color}-400 border-0`}>
                          {tier.toUpperCase().replace('TIER', 'TIER ')}
                        </Badge>
                        {data.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {data.items.map((item) => (
                          <div key={item} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                            <span className="text-sm text-white">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(regionVariants).map(([region, data], index) => (
                <motion.div
                  key={region}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/30 transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-3">
                        <span className="text-3xl">{data.flag}</span>
                        <div>
                          <div className="font-bold">{region}</div>
                          <div className="text-xs text-slate-400 font-normal">Regional APIs</div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {data.apis.map((api) => (
                          <div key={api} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                            <span className="text-sm text-white">{api}</span>
                            <MapPin className="w-4 h-4 text-blue-400" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
          <p className="text-slate-400 text-sm">
            SOFTWARE VALA • API INTEGRATION MATRIX • {Object.keys(apiModuleMapping).length} Modules • {Object.values(apiModuleMapping).flatMap(m => m.apis).length}+ APIs
          </p>
        </div>
      </div>
    </div>
  );
};

export default APIIntegrationDashboard;
