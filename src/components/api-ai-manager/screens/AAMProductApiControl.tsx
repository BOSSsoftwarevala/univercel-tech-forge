import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Package,
  Plug,
  Power,
  DollarSign,
  BarChart3,
  Eye,
  Edit,
  History,
  Settings
} from "lucide-react";

interface AAMProductApiControlProps {
  activeSubSection: string;
}

const AAMProductApiControl = ({ activeSubSection }: AAMProductApiControlProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const products = [
    {
      name: "CRM System",
      status: "active",
      apis: [
        { name: "OpenAI GPT-4", enabled: true, requests: "15,230", cost: "₹3,808" },
        { name: "SendGrid Email", enabled: true, requests: "8,450", cost: "₹1,690" },
        { name: "Twilio SMS", enabled: true, requests: "5,200", cost: "₹1,560" },
        { name: "Google Maps", enabled: false, requests: "0", cost: "₹0" },
      ],
      totalCost: "₹7,058",
      totalRequests: "28,880"
    },
    {
      name: "E-Commerce App",
      status: "active",
      apis: [
        { name: "Razorpay", enabled: true, requests: "18,450", cost: "₹3,690" },
        { name: "WhatsApp Business", enabled: true, requests: "12,300", cost: "₹3,075" },
        { name: "Vision AI", enabled: true, requests: "4,500", cost: "₹1,125" },
        { name: "Firebase", enabled: true, requests: "25,000", cost: "₹625" },
      ],
      totalCost: "₹8,515",
      totalRequests: "60,250"
    },
    {
      name: "Analytics Dashboard",
      status: "active",
      apis: [
        { name: "Google Analytics", enabled: true, requests: "Unlimited", cost: "₹0" },
        { name: "Mixpanel", enabled: true, requests: "35,000", cost: "₹3,150" },
        { name: "OpenAI GPT-4", enabled: true, requests: "8,200", cost: "₹2,050" },
      ],
      totalCost: "₹5,200",
      totalRequests: "43,200+"
    },
    {
      name: "Mobile App",
      status: "warning",
      apis: [
        { name: "Firebase", enabled: true, requests: "45,000", cost: "₹1,125" },
        { name: "Google Maps", enabled: true, requests: "18,500", cost: "₹4,625" },
        { name: "Twilio SMS", enabled: true, requests: "8,900", cost: "₹2,670" },
        { name: "OpenAI GPT-4", enabled: false, requests: "0", cost: "₹0" },
      ],
      totalCost: "₹8,420",
      totalRequests: "72,400"
    },
    {
      name: "Support Portal",
      status: "active",
      apis: [
        { name: "NLP / Chat AI", enabled: true, requests: "12,500", cost: "₹1,000" },
        { name: "SendGrid Email", enabled: true, requests: "6,800", cost: "₹1,360" },
        { name: "Voice TTS/STT", enabled: true, requests: "3,200", cost: "₹320" },
      ],
      totalCost: "₹2,680",
      totalRequests: "22,500"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product-wise API Control</h1>
          <p className="text-slate-400 text-sm mt-1">Manage API access and costs per product</p>
        </div>
        <Button
          size="sm"
          onClick={() => handleAction("Add Product Mapping")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Package className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge
                          variant="outline"
                          className={
                            product.status === 'active'
                              ? 'text-green-400 border-green-400/30'
                              : 'text-yellow-400 border-yellow-400/30'
                          }
                        >
                          {product.status}
                        </Badge>
                        <span className="text-xs text-slate-400">{product.apis.length} APIs</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{product.totalCost}</p>
                      <p className="text-xs text-slate-400">{product.totalRequests} requests</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={() => handleAction(`View ${product.name}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={() => handleAction(`Edit ${product.name}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={() => handleAction(`View Graph ${product.name}`)}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {product.apis.map((api) => (
                    <div
                      key={api.name}
                      className={`p-3 rounded-lg border ${
                        api.enabled
                          ? 'bg-slate-800/50 border-white/5'
                          : 'bg-slate-900/50 border-slate-700/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{api.name}</p>
                        <Switch
                          checked={api.enabled}
                          onCheckedChange={() => handleAction(`Toggle ${api.name} for ${product.name}`)}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{api.requests}</span>
                        <span>{api.cost}</span>
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

export default AAMProductApiControl;
