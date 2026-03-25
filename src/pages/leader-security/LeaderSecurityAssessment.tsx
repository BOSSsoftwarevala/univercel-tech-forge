import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, ShieldCheck, Wifi, User, Users, Calendar, Newspaper,
  Brain, Star, AlertTriangle, CheckCircle, XCircle, ChevronRight,
  MapPin, Lock, Eye, Monitor, Fingerprint, Radio, Activity,
  TrendingUp, TrendingDown, Minus, Zap, Target, Globe, Server,
  FileWarning, Lightbulb, Watch, Route, Copy, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Module data types
interface SecurityModule {
  id: string;
  title: string;
  icon: React.ReactNode;
  score: number;
  rating: string;
  status: 'good' | 'warning' | 'critical';
  features: { name: string; status: 'active' | 'warning' | 'inactive' }[];
  aiChecks: { name: string; result: 'pass' | 'warning' | 'fail' }[];
}

interface FeatureGap {
  area: string;
  severity: 'high' | 'medium' | 'low';
}

interface SuggestedFeature {
  name: string;
  priority: 'critical' | 'high' | 'medium';
  description: string;
}

// Module data
const securityModules: SecurityModule[] = [
  {
    id: 'physical',
    title: 'Physical Security',
    icon: <Shield className="h-5 w-5" />,
    score: 87,
    rating: '87/100',
    status: 'good',
    features: [
      { name: 'Security Zone Mapping', status: 'active' },
      { name: 'Perimeter Coverage Status', status: 'active' },
      { name: 'Guard Deployment Tracker', status: 'warning' },
      { name: 'Access Control Logs', status: 'active' },
      { name: 'Escort Assignment Status', status: 'active' },
    ],
    aiChecks: [
      { name: 'Blind spot detection', result: 'pass' },
      { name: 'Understaffed zone alert', result: 'warning' },
      { name: 'Schedule vs coverage mismatch', result: 'pass' },
    ],
  },
  {
    id: 'cyber',
    title: 'Digital & Cyber Security',
    icon: <Lock className="h-5 w-5" />,
    score: 72,
    rating: 'Medium Risk',
    status: 'warning',
    features: [
      { name: 'Device Hardening Status', status: 'active' },
      { name: 'Communication Encryption Check', status: 'active' },
      { name: 'Phishing / Spyware Risk', status: 'warning' },
      { name: 'Data Leak Monitoring', status: 'active' },
      { name: 'Dark Web Mention Scan', status: 'warning' },
    ],
    aiChecks: [
      { name: 'Suspicious access behavior', result: 'warning' },
      { name: 'Weak endpoint detection', result: 'pass' },
    ],
  },
  {
    id: 'personal',
    title: 'Personal Risk Indicators',
    icon: <User className="h-5 w-5" />,
    score: 65,
    rating: 'Elevated',
    status: 'warning',
    features: [
      { name: 'Public Schedule Exposure', status: 'warning' },
      { name: 'Travel Pattern Predictability', status: 'warning' },
      { name: 'Media Overexposure Index', status: 'active' },
      { name: 'Public Sentiment Volatility', status: 'warning' },
    ],
    aiChecks: [
      { name: 'Predictability risk', result: 'warning' },
      { name: 'Crowd pressure alerts', result: 'pass' },
    ],
  },
  {
    id: 'team',
    title: 'Team & Process Security',
    icon: <Users className="h-5 w-5" />,
    score: 91,
    rating: '91/100',
    status: 'good',
    features: [
      { name: 'Staff Background Clearance Status', status: 'active' },
      { name: 'Role-Based Access Enforcement', status: 'active' },
      { name: 'Information Flow Control', status: 'active' },
      { name: 'Decision Dependency Mapping', status: 'active' },
    ],
    aiChecks: [
      { name: 'Insider risk indicators', result: 'pass' },
      { name: 'Over-centralization warning', result: 'pass' },
    ],
  },
  {
    id: 'event',
    title: 'Event & Crowd Security',
    icon: <Calendar className="h-5 w-5" />,
    score: 78,
    rating: '78/100',
    status: 'good',
    features: [
      { name: 'Event Risk Level', status: 'active' },
      { name: 'Crowd Density Prediction', status: 'warning' },
      { name: 'Emergency Exit Readiness', status: 'active' },
      { name: 'Medical Response Availability', status: 'active' },
    ],
    aiChecks: [
      { name: 'Stampede risk', result: 'pass' },
      { name: 'Delay-based exposure risk', result: 'warning' },
    ],
  },
  {
    id: 'media',
    title: 'Media & Reputation',
    icon: <Newspaper className="h-5 w-5" />,
    score: 69,
    rating: 'Moderate',
    status: 'warning',
    features: [
      { name: 'News Sentiment Tracking', status: 'active' },
      { name: 'Fake News Detection', status: 'warning' },
      { name: 'Social Media Threat Signals', status: 'warning' },
      { name: 'Narrative Drift Alerts', status: 'active' },
    ],
    aiChecks: [
      { name: 'Coordinated attack detection', result: 'warning' },
      { name: 'Viral risk alert', result: 'pass' },
    ],
  },
  {
    id: 'threat',
    title: 'AI Threat Prediction',
    icon: <Brain className="h-5 w-5" />,
    score: 82,
    rating: '18% Threat',
    status: 'good',
    features: [
      { name: 'Multi-source threat correlation', status: 'active' },
      { name: 'Early warning alerts', status: 'active' },
      { name: 'Scenario simulation', status: 'active' },
      { name: 'Risk heatmap', status: 'active' },
    ],
    aiChecks: [
      { name: 'Threat Probability', result: 'pass' },
      { name: 'Impact Severity', result: 'pass' },
      { name: 'Suggested Preventive Action', result: 'pass' },
    ],
  },
];

const featureGaps: FeatureGap[] = [
  { area: 'Predictive crowd AI', severity: 'high' },
  { area: 'Insider risk AI', severity: 'high' },
  { area: 'Automated incident drills', severity: 'medium' },
  { area: 'Real-time escort health tracking', severity: 'medium' },
];

const suggestedFeatures: SuggestedFeature[] = [
  { name: 'Wearable panic sensors', priority: 'critical', description: 'Instant distress signal from wearable devices' },
  { name: 'AI-based route randomizer', priority: 'high', description: 'Unpredictable travel pattern generation' },
  { name: 'Decoy schedule generator', priority: 'high', description: 'False itinerary creation for misdirection' },
  { name: 'Digital twin simulation', priority: 'medium', description: 'Virtual event security testing' },
];

const overallRatings = [
  { label: 'Physical Security', stars: 4 },
  { label: 'Cyber Safety', stars: 3 },
  { label: 'Exposure Risk', stars: 2 },
  { label: 'Team Security', stars: 4 },
  { label: 'Event Safety', stars: 3 },
];

const LeaderSecurityAssessment = () => {
  const [selectedModule, setSelectedModule] = useState<string>('physical');
  const [activeTab, setActiveTab] = useState('overview');

  const currentModule = securityModules.find(m => m.id === selectedModule) || securityModules[0];
  const overallScore = 78;

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return 'text-neon-green bg-neon-green/20 border-neon-green/30';
      case 'warning': return 'text-neon-orange bg-neon-orange/20 border-neon-orange/30';
      case 'critical': return 'text-neon-red bg-neon-red/20 border-neon-red/30';
    }
  };

  const getFeatureStatusIcon = (status: 'active' | 'warning' | 'inactive') => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-neon-green" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-neon-orange" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-neon-red" />;
    }
  };

  const getAICheckIcon = (result: 'pass' | 'warning' | 'fail') => {
    switch (result) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-neon-green" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-neon-orange" />;
      case 'fail': return <XCircle className="h-4 w-4 text-neon-red" />;
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= count ? 'text-gold fill-gold' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">National Leader Security Assessment</h1>
            <p className="text-sm text-muted-foreground">Comprehensive Security & Readiness System</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Module List */}
        <div className="col-span-3">
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Security Modules</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-1">
                  {securityModules.map((module, index) => (
                    <motion.button
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedModule(module.id)}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                        selectedModule === module.id
                          ? 'bg-primary/20 border border-primary/40'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${getStatusColor(module.status)}`}>
                        {module.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{module.title}</p>
                        <p className="text-xs text-muted-foreground">{module.rating}</p>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                        selectedModule === module.id ? 'rotate-90' : ''
                      }`} />
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Center - Module Details */}
        <div className="col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-panel mb-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${getStatusColor(currentModule.status)}`}>
                        {currentModule.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{currentModule.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">Module {securityModules.findIndex(m => m.id === currentModule.id) + 1} of 7</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-foreground">{currentModule.score}</p>
                      <p className="text-xs text-muted-foreground">Security Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={currentModule.score} className="h-2 mb-6" />

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full bg-secondary/50">
                      <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                      <TabsTrigger value="ai-checks" className="flex-1">AI Checks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="features" className="mt-4">
                      <div className="space-y-2">
                        {currentModule.features.map((feature, idx) => (
                          <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <span className="text-sm text-foreground">{feature.name}</span>
                            {getFeatureStatusIcon(feature.status)}
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="ai-checks" className="mt-4">
                      <div className="space-y-2">
                        {currentModule.aiChecks.map((check, idx) => (
                          <motion.div
                            key={check.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-primary" />
                              <span className="text-sm text-foreground">{check.name}</span>
                            </div>
                            {getAICheckIcon(check.result)}
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Feature Gap Detection */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <FileWarning className="h-4 w-4 text-neon-orange" />
                    <CardTitle className="text-sm">Feature Gap Detection</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {featureGaps.map((gap, idx) => (
                      <motion.div
                        key={gap.area}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Missing Area</span>
                          <Badge variant="outline" className={
                            gap.severity === 'high' ? 'border-neon-red text-neon-red' :
                            gap.severity === 'medium' ? 'border-neon-orange text-neon-orange' :
                            'border-neon-cyan text-neon-cyan'
                          }>
                            {gap.severity}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">{gap.area}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Sidebar - Overall Rating & Suggestions */}
        <div className="col-span-3 space-y-6">
          {/* Leader Readiness Index */}
          <Card className="glass-panel overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm text-muted-foreground">Leader Readiness Index</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-secondary"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#lri-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: overallScore / 100 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      style={{ strokeDasharray: '251.2', strokeDashoffset: '0' }}
                    />
                    <defs>
                      <linearGradient id="lri-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(187 100% 50%)" />
                        <stop offset="100%" stopColor="hsl(142 76% 50%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">{overallScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Star Ratings */}
              <div className="space-y-2">
                {overallRatings.map((rating, idx) => (
                  <motion.div
                    key={rating.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-xs text-muted-foreground">{rating.label}</span>
                    {renderStars(rating.stars)}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Features */}
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-gold" />
                <CardTitle className="text-sm">Suggested Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestedFeatures.map((feature, idx) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-2">
                      {feature.priority === 'critical' && <Watch className="h-4 w-4 text-neon-red mt-0.5" />}
                      {feature.priority === 'high' && <Route className="h-4 w-4 text-neon-orange mt-0.5" />}
                      {feature.priority === 'medium' && <Copy className="h-4 w-4 text-neon-cyan mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{feature.name}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Global Rule */}
          <Card className="glass-panel border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Global Rule</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-neon-red" />
                  No personal life scanning
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-neon-red" />
                  No relationship analysis
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-neon-red" />
                  No speculative profiling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-neon-green" />
                  Security = systems, not gossip
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderSecurityAssessment;
