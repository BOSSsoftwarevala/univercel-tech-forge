/**
 * AI / API BILLING SECTION
 * Usage Cost, Spike Alert, Stop/Resume, Budget Limit
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Cpu,
  Activity,
  AlertTriangle,
  StopCircle,
  Target,
  BarChart3,
  TrendingUp,
  Zap,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface AIAPIBillingProps {
  activeView: FinanceView;
}

const AIAPIBilling: React.FC<AIAPIBillingProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'ai_usage_cost': return 'AI Usage Cost';
      case 'api_usage_cost': return 'API Usage Cost';
      case 'ai_spike_alert': return 'Cost Spike Alerts';
      case 'ai_stop_resume': return 'Stop / Resume AI';
      case 'ai_budget_limit': return 'Budget Limits';
      default: return 'AI / API Billing';
    }
  };

  const aiServices = [
    { name: 'OpenAI GPT-4', usage: '2.5M tokens', cost: '₹75,000', budget: '₹1,00,000', used: 75, status: 'Active' },
    { name: 'Claude 3', usage: '1.8M tokens', cost: '₹45,000', budget: '₹60,000', used: 75, status: 'Active' },
    { name: 'Gemini Pro', usage: '3.2M tokens', cost: '₹35,000', budget: '₹50,000', used: 70, status: 'Active' },
    { name: 'Whisper API', usage: '500 hrs', cost: '₹25,000', budget: '₹30,000', used: 83, status: 'Warning' },
    { name: 'DALL-E 3', usage: '10K images', cost: '₹15,000', budget: '₹20,000', used: 75, status: 'Active' },
  ];

  const spikeAlerts = [
    { id: 'SPIKE001', service: 'OpenAI GPT-4', threshold: '₹5,000/hr', current: '₹7,500/hr', triggered: '10:30 AM', status: 'Active' },
    { id: 'SPIKE002', service: 'Claude 3', threshold: '₹3,000/hr', current: '₹4,200/hr', triggered: '09:45 AM', status: 'Resolved' },
    { id: 'SPIKE003', service: 'Whisper API', threshold: '₹2,000/hr', current: '₹2,800/hr', triggered: '08:15 AM', status: 'Active' },
  ];

  const stats = [
    { label: 'Total AI Cost', value: '₹1.95L', change: '+15%', icon: Cpu },
    { label: 'Total API Cost', value: '₹85K', change: '+8%', icon: Activity },
    { label: 'Active Alerts', value: '2', change: '-1', icon: AlertTriangle },
    { label: 'Budget Used', value: '72%', change: '+5%', icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monitor and control AI/API costs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Configure Limits
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <StopCircle className="w-4 h-4" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <Badge variant="outline" className="text-[10px]">{stat.change}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stop/Resume Controls (for ai_stop_resume view) */}
      {activeView === 'ai_stop_resume' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Service Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiServices.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      service.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      <Cpu className={`w-5 h-5 ${
                        service.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
                      <p className="text-xs text-slate-500">Usage: {service.usage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">{service.cost}</p>
                      <p className="text-xs text-slate-500">of {service.budget}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={service.status === 'Active'} />
                      <Button variant={service.status === 'Active' ? 'destructive' : 'default'} size="sm">
                        {service.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spike Alerts (for ai_spike_alert view) */}
      {activeView === 'ai_spike_alert' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Active Spike Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spikeAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  alert.status === 'Active' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-slate-50 dark:bg-slate-800/50'
                }`}>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{alert.service}</p>
                    <p className="text-xs text-slate-500">
                      Threshold: {alert.threshold} | Current: <span className="text-red-600 font-semibold">{alert.current}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{alert.triggered}</span>
                    <Badge variant={alert.status === 'Active' ? 'destructive' : 'secondary'}>{alert.status}</Badge>
                    {alert.status === 'Active' && (
                      <Button variant="outline" size="sm">Acknowledge</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Services Usage */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">AI/API Usage & Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiServices.map((service) => (
              <div key={service.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{service.name}</span>
                    <Badge variant={service.status === 'Active' ? 'default' : 'destructive'} className="text-[10px]">
                      {service.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{service.cost}</span>
                    <span className="text-xs text-slate-500"> / {service.budget}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={service.used} className={`h-2 flex-1 ${service.used > 80 ? '[&>div]:bg-amber-500' : ''}`} />
                  <span className="text-xs text-slate-500 w-10">{service.used}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Limits (for ai_budget_limit view) */}
      {activeView === 'ai_budget_limit' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Configure Budget Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Daily Budget Limit</label>
                <Input placeholder="₹50,000" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Monthly Budget Limit</label>
                <Input placeholder="₹10,00,000" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Spike Alert Threshold</label>
                <Input placeholder="₹5,000/hr" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Auto-Stop at</label>
                <Input placeholder="90% of budget" />
              </div>
            </div>
            <Button className="mt-4">Save Budget Settings</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAPIBilling;
