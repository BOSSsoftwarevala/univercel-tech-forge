import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plug, Shield, CreditCard, MessageSquare, Database, Search,
  Brain, Server, BarChart3, Globe, Plus, Trash2, Play, Square
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface APIService {
  id: string;
  name: string;
  type: string;
  linkedModule: string;
  status: 'running' | 'stopped';
  payment: 'paid' | 'unpaid';
  usage: number;
  cost: string;
  lastCall: string;
}

const API_SERVICES: APIService[] = [
  // Auth APIs
  { id: 'auth-google', name: 'Google OAuth', type: 'Auth', linkedModule: 'Users', status: 'running', payment: 'paid', usage: 95, cost: '$0', lastCall: '2 min ago' },
  { id: 'auth-fb', name: 'Facebook Auth', type: 'Auth', linkedModule: 'Users', status: 'running', payment: 'paid', usage: 45, cost: '$0', lastCall: '15 min ago' },
  
  // Payment APIs
  { id: 'stripe', name: 'Stripe', type: 'Payment', linkedModule: 'Billing', status: 'running', payment: 'paid', usage: 78, cost: '$0', lastCall: '1 min ago' },
  { id: 'paypal', name: 'PayPal', type: 'Payment', linkedModule: 'Billing', status: 'running', payment: 'paid', usage: 62, cost: '$0', lastCall: '5 min ago' },
  { id: 'razorpay', name: 'Razorpay/UPI', type: 'Payment', linkedModule: 'Billing', status: 'running', payment: 'paid', usage: 88, cost: '$0', lastCall: '30 sec ago' },
  
  // Messaging APIs
  { id: 'twilio', name: 'Twilio SMS', type: 'Messaging', linkedModule: 'Leads', status: 'running', payment: 'paid', usage: 55, cost: '$120', lastCall: '3 min ago' },
  { id: 'whatsapp', name: 'WhatsApp Business', type: 'Messaging', linkedModule: 'Leads', status: 'running', payment: 'paid', usage: 72, cost: '$85', lastCall: '1 min ago' },
  { id: 'sendgrid', name: 'SendGrid Email', type: 'Messaging', linkedModule: 'All', status: 'running', payment: 'paid', usage: 40, cost: '$50', lastCall: '10 min ago' },
  
  // CRM APIs
  { id: 'hubspot', name: 'HubSpot CRM', type: 'CRM', linkedModule: 'Leads', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$0', lastCall: '3 days ago' },
  { id: 'salesforce', name: 'Salesforce', type: 'CRM', linkedModule: 'Leads', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$0', lastCall: 'Never' },
  
  // SEO APIs
  { id: 'semrush', name: 'SEMrush', type: 'SEO', linkedModule: 'SEO', status: 'running', payment: 'paid', usage: 35, cost: '$200', lastCall: '1 hour ago' },
  { id: 'ahrefs', name: 'Ahrefs', type: 'SEO', linkedModule: 'SEO', status: 'running', payment: 'paid', usage: 28, cost: '$150', lastCall: '2 hours ago' },
  
  // AI APIs
  { id: 'openai', name: 'OpenAI API', type: 'AI', linkedModule: 'AI', status: 'running', payment: 'paid', usage: 85, cost: '$450', lastCall: '10 sec ago' },
  { id: 'google-ai', name: 'Google AI', type: 'AI', linkedModule: 'AI', status: 'running', payment: 'paid', usage: 65, cost: '$320', lastCall: '30 sec ago' },
  
  // Server APIs
  { id: 'aws', name: 'AWS EC2', type: 'Server', linkedModule: 'Server', status: 'running', payment: 'paid', usage: 72, cost: '$380', lastCall: 'Live' },
  { id: 'cloudflare', name: 'Cloudflare', type: 'Server', linkedModule: 'Server', status: 'running', payment: 'paid', usage: 90, cost: '$50', lastCall: 'Live' },
  
  // Analytics APIs
  { id: 'ga', name: 'Google Analytics', type: 'Analytics', linkedModule: 'All', status: 'running', payment: 'paid', usage: 100, cost: '$0', lastCall: 'Live' },
  { id: 'mixpanel', name: 'Mixpanel', type: 'Analytics', linkedModule: 'All', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$0', lastCall: 'Never' },
];

const API_TYPES = ['All', 'Auth', 'Payment', 'Messaging', 'CRM', 'SEO', 'AI', 'Server', 'Analytics', 'Third-Party', 'Internal'];

export const UnifiedAPIManagement = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [services, setServices] = useState(API_SERVICES);

  const filteredServices = selectedType === 'All' 
    ? services 
    : services.filter(s => s.type === selectedType);

  const toggleStatus = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, status: s.status === 'running' ? 'stopped' : 'running' } : s
    ));
  };

  const togglePayment = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, payment: s.payment === 'paid' ? 'unpaid' : 'paid' } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plug className="w-6 h-6 text-blue-400" />
            API Management
          </h1>
          <p className="text-muted-foreground">All API services in one place</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> Add API
          </Button>
          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {API_TYPES.map(type => (
          <Button
            key={type}
            size="sm"
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type)}
            className={selectedType === type ? "bg-blue-600" : ""}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{services.filter(s => s.status === 'running').length}</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{services.filter(s => s.status === 'stopped').length}</p>
            <p className="text-xs text-muted-foreground">Stopped</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{services.filter(s => s.payment === 'paid').length}</p>
            <p className="text-xs text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{services.filter(s => s.payment === 'unpaid').length}</p>
            <p className="text-xs text-muted-foreground">Unpaid</p>
          </CardContent>
        </Card>
      </div>

      {/* API Services Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">API Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Linked Module</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Payment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Usage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Cost</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Last Call</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredServices.map((service) => (
                  <motion.tr 
                    key={service.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Plug className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">{service.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{service.type}</Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{service.linkedModule}</td>
                    <td className="p-3">
                      <Badge className={service.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                        {service.status === 'running' ? '● RUN' : '○ STOP'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={service.payment === 'paid' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}>
                        {service.payment.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 w-24">
                      <div className="flex items-center gap-2">
                        <Progress value={service.usage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{service.usage}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm font-medium text-white">{service.cost}</td>
                    <td className="p-3 text-xs text-muted-foreground">{service.lastCall}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleStatus(service.id)}
                        >
                          {service.status === 'running' ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                          {service.status === 'running' ? 'Stop' : 'Run'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => togglePayment(service.id)}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          {service.payment === 'paid' ? 'Unpay' : 'Pay'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
