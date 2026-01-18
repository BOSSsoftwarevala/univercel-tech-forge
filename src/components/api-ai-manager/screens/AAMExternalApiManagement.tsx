import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  CreditCard,
  MessageCircle,
  Mail,
  Phone,
  Map,
  Cloud,
  BarChart3,
  Key,
  RotateCcw,
  Power,
  Eye,
  Edit,
  History,
  AlertTriangle,
  Activity,
  DollarSign,
  Plug
} from "lucide-react";

interface AAMExternalApiManagementProps {
  activeSubSection: string;
}

const AAMExternalApiManagement = ({ activeSubSection }: AAMExternalApiManagementProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const externalApis = [
    {
      id: "payment",
      name: "Payment APIs",
      icon: <CreditCard className="w-5 h-5" />,
      providers: [
        { name: "Razorpay", status: "active", usage: "28,450", cost: "₹5,600", errorRate: "0.02%" },
        { name: "PhonePe", status: "active", usage: "15,200", cost: "₹3,100", errorRate: "0.01%" },
        { name: "Paytm", status: "inactive", usage: "0", cost: "₹0", errorRate: "N/A" },
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "sms",
      name: "SMS APIs",
      icon: <MessageCircle className="w-5 h-5" />,
      providers: [
        { name: "MSG91", status: "active", usage: "45,000", cost: "₹2,250", errorRate: "0.5%" },
        { name: "Twilio", status: "warning", usage: "12,000", cost: "₹1,800", errorRate: "1.2%" },
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "email",
      name: "Email APIs",
      icon: <Mail className="w-5 h-5" />,
      providers: [
        { name: "SendGrid", status: "warning", usage: "12,800", cost: "₹2,100", errorRate: "0.8%" },
        { name: "Mailgun", status: "active", usage: "8,500", cost: "₹1,200", errorRate: "0.1%" },
      ],
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "whatsapp",
      name: "WhatsApp APIs",
      icon: <Phone className="w-5 h-5" />,
      providers: [
        { name: "WhatsApp Business", status: "active", usage: "32,100", cost: "₹8,200", errorRate: "0.05%" },
        { name: "Interakt", status: "active", usage: "18,500", cost: "₹4,600", errorRate: "0.1%" },
      ],
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "maps",
      name: "Maps APIs",
      icon: <Map className="w-5 h-5" />,
      providers: [
        { name: "Google Maps", status: "active", usage: "25,000", cost: "₹6,250", errorRate: "0.01%" },
        { name: "Mapbox", status: "inactive", usage: "0", cost: "₹0", errorRate: "N/A" },
      ],
      color: "from-orange-500 to-amber-500"
    },
    {
      id: "cloud",
      name: "Cloud APIs",
      icon: <Cloud className="w-5 h-5" />,
      providers: [
        { name: "AWS S3", status: "active", usage: "150 GB", cost: "₹3,750", errorRate: "0.001%" },
        { name: "Firebase", status: "active", usage: "80 GB", cost: "₹2,000", errorRate: "0.01%" },
      ],
      color: "from-slate-500 to-slate-600"
    },
    {
      id: "analytics",
      name: "Analytics APIs",
      icon: <BarChart3 className="w-5 h-5" />,
      providers: [
        { name: "Google Analytics", status: "active", usage: "Unlimited", cost: "₹0", errorRate: "0%" },
        { name: "Mixpanel", status: "active", usage: "50,000", cost: "₹4,500", errorRate: "0.02%" },
      ],
      color: "from-pink-500 to-rose-500"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">External API Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all external APIs - payments, SMS, email, and more</p>
        </div>
        <Button
          size="sm"
          onClick={() => handleAction("Add New API")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plug className="w-4 h-4 mr-2" />
          Add External API
        </Button>
      </div>

      {/* API Categories */}
      <div className="space-y-6">
        {externalApis.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.providers.map((provider) => (
                    <div
                      key={provider.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={provider.status !== 'inactive'}
                          onCheckedChange={() => handleAction(`Toggle ${provider.name}`)}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{provider.name}</p>
                            <Badge
                              variant="outline"
                              className={
                                provider.status === 'active'
                                  ? 'text-green-400 border-green-400/30'
                                  : provider.status === 'warning'
                                  ? 'text-yellow-400 border-yellow-400/30'
                                  : 'text-slate-400 border-slate-400/30'
                              }
                            >
                              {provider.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {provider.usage} requests
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {provider.cost}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Error: {provider.errorRate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={() => handleAction(`View Key ${provider.name}`)}
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={() => handleAction(`Rotate Key ${provider.name}`)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={() => handleAction(`View ${provider.name}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={() => handleAction(`Edit ${provider.name}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={() => handleAction(`History ${provider.name}`)}
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AAMExternalApiManagement;
