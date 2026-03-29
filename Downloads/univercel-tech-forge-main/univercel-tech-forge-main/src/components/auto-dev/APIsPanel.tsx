import { motion } from "framer-motion";
import { 
  Plug, Code2, Palette, Rocket, CreditCard, Mail, 
  BarChart3, CheckCircle2, AlertCircle, Loader2,
  Globe, Key, MessageSquare, Bell, Smartphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface APICategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  apis: {
    name: string;
    status: 'connected' | 'available' | 'error';
  }[];
}

const API_CATEGORIES: APICategory[] = [
  {
    id: 'development',
    name: 'Development APIs',
    icon: Code2,
    color: 'blue',
    apis: [
      { name: 'Code Templates', status: 'connected' },
      { name: 'Module Registry', status: 'connected' },
      { name: 'Build Pipeline', status: 'connected' },
      { name: 'Version Control', status: 'connected' },
    ]
  },
  {
    id: 'ui-ux',
    name: 'UI / UX APIs',
    icon: Palette,
    color: 'violet',
    apis: [
      { name: 'Theme Matcher', status: 'connected' },
      { name: 'Color Contrast', status: 'connected' },
      { name: 'Accessibility', status: 'connected' },
    ]
  },
  {
    id: 'deployment',
    name: 'Deployment APIs',
    icon: Rocket,
    color: 'emerald',
    apis: [
      { name: 'Domain Binding', status: 'connected' },
      { name: 'License Key', status: 'connected' },
      { name: 'Environment Switch', status: 'connected' },
    ]
  },
  {
    id: 'payment',
    name: 'Payment APIs',
    icon: CreditCard,
    color: 'amber',
    apis: [
      { name: 'PayPal', status: 'connected' },
      { name: 'Stripe', status: 'connected' },
      { name: 'Razorpay / UPI', status: 'connected' },
      { name: 'Wise', status: 'available' },
      { name: 'Binance Pay', status: 'available' },
      { name: 'Internal Wallet', status: 'connected' },
    ]
  },
  {
    id: 'communication',
    name: 'Communication APIs',
    icon: MessageSquare,
    color: 'cyan',
    apis: [
      { name: 'Email (Transactional)', status: 'connected' },
      { name: 'SMS / WhatsApp', status: 'connected' },
      { name: 'Push Notifications', status: 'connected' },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics APIs',
    icon: BarChart3,
    color: 'pink',
    apis: [
      { name: 'Usage Tracking', status: 'connected' },
      { name: 'Error Tracking', status: 'connected' },
      { name: 'Performance Metrics', status: 'connected' },
    ]
  },
];

export const APIsPanel = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
      case 'available':
        return <AlertCircle className="w-3 h-3 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return <Loader2 className="w-3 h-3 animate-spin" />;
    }
  };

  const totalAPIs = API_CATEGORIES.reduce((acc, cat) => acc + cat.apis.length, 0);
  const connectedAPIs = API_CATEGORIES.reduce(
    (acc, cat) => acc + cat.apis.filter(a => a.status === 'connected').length, 
    0
  );

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-zinc-900/80 border-blue-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Plug className="w-5 h-5 text-blue-400" />
            API Integrations
          </CardTitle>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/50">
            {connectedAPIs}/{totalAPIs} Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {API_CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "p-3 rounded-lg border transition-all",
                category.color === 'blue' && "bg-blue-500/5 border-blue-500/20",
                category.color === 'violet' && "bg-violet-500/5 border-violet-500/20",
                category.color === 'emerald' && "bg-emerald-500/5 border-emerald-500/20",
                category.color === 'amber' && "bg-amber-500/5 border-amber-500/20",
                category.color === 'cyan' && "bg-cyan-500/5 border-cyan-500/20",
                category.color === 'pink' && "bg-pink-500/5 border-pink-500/20",
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <category.icon className={cn(
                  "w-4 h-4",
                  category.color === 'blue' && "text-blue-400",
                  category.color === 'violet' && "text-violet-400",
                  category.color === 'emerald' && "text-emerald-400",
                  category.color === 'amber' && "text-amber-400",
                  category.color === 'cyan' && "text-cyan-400",
                  category.color === 'pink' && "text-pink-400",
                )} />
                <span className="text-xs font-medium text-white">{category.name}</span>
              </div>
              <div className="space-y-1">
                {category.apis.map((api) => (
                  <div key={api.name} className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{api.name}</span>
                    {getStatusIcon(api.status)}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
