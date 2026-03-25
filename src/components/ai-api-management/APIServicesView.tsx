import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plug, CreditCard, MessageSquare, Shield, Database, BarChart3, Server,
  Play, Square, Plus, Trash2, AlertTriangle, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface APIService {
  id: string;
  name: string;
  type: 'payment' | 'messaging' | 'auth' | 'storage' | 'analytics' | 'server';
  provider: string;
  status: 'running' | 'stopped';
  payment: 'paid' | 'unpaid';
  usage: number;
  cost: string;
}

const API_SERVICES: APIService[] = [
  { id: '1', name: 'Stripe', type: 'payment', provider: 'Stripe', status: 'running', payment: 'paid', usage: 85, cost: '$45' },
  { id: '2', name: 'PayPal', type: 'payment', provider: 'PayPal', status: 'running', payment: 'paid', usage: 45, cost: '$32' },
  { id: '3', name: 'Razorpay', type: 'payment', provider: 'Razorpay', status: 'running', payment: 'unpaid', usage: 30, cost: '$28' },
  { id: '4', name: 'Twilio SMS', type: 'messaging', provider: 'Twilio', status: 'running', payment: 'paid', usage: 72, cost: '$56' },
  { id: '5', name: 'SendGrid Email', type: 'messaging', provider: 'SendGrid', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$18' },
  { id: '6', name: 'WhatsApp Business', type: 'messaging', provider: 'Meta', status: 'running', payment: 'paid', usage: 55, cost: '$34' },
  { id: '7', name: 'Firebase Auth', type: 'auth', provider: 'Google', status: 'running', payment: 'paid', usage: 90, cost: '$0' },
  { id: '8', name: 'Auth0', type: 'auth', provider: 'Auth0', status: 'stopped', payment: 'paid', usage: 0, cost: '$23' },
  { id: '9', name: 'AWS S3', type: 'storage', provider: 'AWS', status: 'running', payment: 'paid', usage: 68, cost: '$89' },
  { id: '10', name: 'Cloudinary', type: 'storage', provider: 'Cloudinary', status: 'running', payment: 'paid', usage: 42, cost: '$45' },
  { id: '11', name: 'Mixpanel', type: 'analytics', provider: 'Mixpanel', status: 'running', payment: 'paid', usage: 55, cost: '$67' },
  { id: '12', name: 'Sentry', type: 'analytics', provider: 'Sentry', status: 'running', payment: 'paid', usage: 38, cost: '$29' },
];

const TYPE_ICONS = {
  payment: CreditCard,
  messaging: MessageSquare,
  auth: Shield,
  storage: Database,
  analytics: BarChart3,
  server: Server,
};

const TYPE_COLORS = {
  payment: 'emerald',
  messaging: 'blue',
  auth: 'violet',
  storage: 'amber',
  analytics: 'cyan',
  server: 'orange',
};

export const APIServicesView = () => {
  const [services, setServices] = useState(API_SERVICES);

  const handleToggleStatus = (id: string) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'running' ? 'stopped' : 'running' } : s
    ));
    const service = services.find(s => s.id === id);
    toast.success(`${service?.name} ${service?.status === 'running' ? 'stopped' : 'started'}`);
  };

  const handleTogglePayment = (id: string) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, payment: s.payment === 'paid' ? 'unpaid' : 'paid' } : s
    ));
    const service = services.find(s => s.id === id);
    toast.success(`${service?.name} marked as ${service?.payment === 'paid' ? 'unpaid' : 'paid'}`);
  };

  const handleDelete = (id: string) => {
    const service = services.find(s => s.id === id);
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success(`${service?.name} deleted`);
  };

  const categories = ['payment', 'messaging', 'auth', 'storage', 'analytics', 'server'] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plug className="w-6 h-6 text-blue-400" />
            API Services
          </h1>
          <p className="text-sm text-muted-foreground">Manage all API integrations</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add API Service
        </Button>
      </div>

      {/* Category Sections */}
      {categories.map((category) => {
        const categoryServices = services.filter(s => s.type === category);
        if (categoryServices.length === 0) return null;
        
        const Icon = TYPE_ICONS[category];
        const color = TYPE_COLORS[category];

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={cn(
                "w-5 h-5",
                color === 'emerald' && "text-emerald-400",
                color === 'blue' && "text-blue-400",
                color === 'violet' && "text-violet-400",
                color === 'amber' && "text-amber-400",
                color === 'cyan' && "text-cyan-400",
                color === 'orange' && "text-orange-400",
              )} />
              <span className="text-sm font-medium text-white capitalize">{category} APIs</span>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                {categoryServices.length}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {categoryServices.map((service) => (
                <motion.div key={service.id} whileHover={{ scale: 1.01 }}>
                  <Card className={cn(
                    "bg-slate-900/50 border transition-all",
                    service.status === 'running' ? "border-emerald-500/30" : "border-border/50"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white text-sm">{service.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{service.provider}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className={cn(
                            "text-[9px] px-1.5",
                            service.status === 'running' 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50" 
                              : "bg-slate-500/10 text-slate-400 border-slate-500/50"
                          )}>
                            {service.status === 'running' ? 'RUN' : 'STOP'}
                          </Badge>
                          <Badge variant="outline" className={cn(
                            "text-[9px] px-1.5",
                            service.payment === 'paid' 
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/50" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/50"
                          )}>
                            {service.payment === 'paid' ? 'PAID' : 'UNPAID'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Progress value={service.usage} className="flex-1 h-1" />
                        <span className="text-[10px] text-muted-foreground">{service.usage}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-emerald-400">{service.cost}/mo</span>
                        <div className="flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6",
                              service.status === 'running' 
                                ? "text-amber-400 hover:bg-amber-500/20" 
                                : "text-emerald-400 hover:bg-emerald-500/20"
                            )}
                            onClick={() => handleToggleStatus(service.id)}
                          >
                            {service.status === 'running' ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-blue-400 hover:bg-blue-500/20"
                            onClick={() => handleTogglePayment(service.id)}
                          >
                            <CreditCard className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-400 hover:bg-red-500/20"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
