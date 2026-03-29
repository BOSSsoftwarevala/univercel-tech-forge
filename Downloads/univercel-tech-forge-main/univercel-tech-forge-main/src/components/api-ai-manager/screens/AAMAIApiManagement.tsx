import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Brain,
  Eye,
  Mic,
  Image,
  Video,
  MessageSquare,
  Cpu,
  Power,
  DollarSign,
  Gauge,
  AlertTriangle,
  Settings,
  History,
  Lock,
  Edit,
  Zap
} from "lucide-react";

interface AAMAIApiManagementProps {
  activeSubSection: string;
}

const AAMAIApiManagement = ({ activeSubSection }: AAMAIApiManagementProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const aiApis = [
    {
      id: "openai",
      name: "OpenAI",
      icon: <Brain className="w-5 h-5" />,
      status: "active",
      dailyLimit: "10,000",
      dailyUsed: "8,500",
      monthlyLimit: "300,000",
      monthlyUsed: "245,000",
      costPerRequest: "₹0.15",
      costPerToken: "₹0.002",
      speedMode: "High",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "vision",
      name: "Vision AI",
      icon: <Eye className="w-5 h-5" />,
      status: "active",
      dailyLimit: "5,000",
      dailyUsed: "2,300",
      monthlyLimit: "150,000",
      monthlyUsed: "68,000",
      costPerRequest: "₹0.25",
      costPerToken: "₹0.003",
      speedMode: "Normal",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "voice",
      name: "Voice / TTS / STT",
      icon: <Mic className="w-5 h-5" />,
      status: "active",
      dailyLimit: "8,000",
      dailyUsed: "4,200",
      monthlyLimit: "240,000",
      monthlyUsed: "126,000",
      costPerRequest: "₹0.10",
      costPerToken: "₹0.001",
      speedMode: "Normal",
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "image",
      name: "Image Generation",
      icon: <Image className="w-5 h-5" />,
      status: "warning",
      dailyLimit: "2,000",
      dailyUsed: "1,850",
      monthlyLimit: "60,000",
      monthlyUsed: "55,500",
      costPerRequest: "₹0.50",
      costPerToken: "N/A",
      speedMode: "Low",
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "video",
      name: "Video AI",
      icon: <Video className="w-5 h-5" />,
      status: "inactive",
      dailyLimit: "500",
      dailyUsed: "0",
      monthlyLimit: "15,000",
      monthlyUsed: "0",
      costPerRequest: "₹2.00",
      costPerToken: "N/A",
      speedMode: "Low",
      color: "from-orange-500 to-amber-500"
    },
    {
      id: "nlp",
      name: "NLP / Chat AI",
      icon: <MessageSquare className="w-5 h-5" />,
      status: "active",
      dailyLimit: "15,000",
      dailyUsed: "9,800",
      monthlyLimit: "450,000",
      monthlyUsed: "294,000",
      costPerRequest: "₹0.08",
      costPerToken: "₹0.001",
      speedMode: "High",
      color: "from-teal-500 to-cyan-500"
    },
    {
      id: "custom",
      name: "Custom AI Models",
      icon: <Cpu className="w-5 h-5" />,
      status: "active",
      dailyLimit: "3,000",
      dailyUsed: "1,200",
      monthlyLimit: "90,000",
      monthlyUsed: "36,000",
      costPerRequest: "₹0.20",
      costPerToken: "₹0.002",
      speedMode: "Normal",
      color: "from-slate-500 to-slate-600"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI API Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all AI APIs with limits, costs, and controls</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Kill All AI APIs")}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Kill Switch
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction("Add New AI API")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Cpu className="w-4 h-4 mr-2" />
            Add AI API
          </Button>
        </div>
      </div>

      {/* AI API Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {aiApis.map((api, index) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10 hover:border-purple-500/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${api.color}`}>
                      {api.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{api.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          api.status === 'active'
                            ? 'text-green-400 border-green-400/30'
                            : api.status === 'warning'
                            ? 'text-yellow-400 border-yellow-400/30'
                            : 'text-slate-400 border-slate-400/30'
                        }
                      >
                        {api.status}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={api.status !== 'inactive'}
                    onCheckedChange={() => handleAction(`Toggle ${api.name}`)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Daily: {api.dailyUsed} / {api.dailyLimit}</span>
                      <span className="text-slate-400">
                        {Math.round((parseInt(api.dailyUsed.replace(/,/g, '')) / parseInt(api.dailyLimit.replace(/,/g, ''))) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (parseInt(api.dailyUsed.replace(/,/g, '')) / parseInt(api.dailyLimit.replace(/,/g, ''))) > 0.85
                            ? 'bg-red-500'
                            : 'bg-purple-500'
                        }`}
                        style={{
                          width: `${Math.min((parseInt(api.dailyUsed.replace(/,/g, '')) / parseInt(api.dailyLimit.replace(/,/g, ''))) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Monthly: {api.monthlyUsed} / {api.monthlyLimit}</span>
                      <span className="text-slate-400">
                        {Math.round((parseInt(api.monthlyUsed.replace(/,/g, '')) / parseInt(api.monthlyLimit.replace(/,/g, ''))) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (parseInt(api.monthlyUsed.replace(/,/g, '')) / parseInt(api.monthlyLimit.replace(/,/g, ''))) > 0.85
                            ? 'bg-yellow-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min((parseInt(api.monthlyUsed.replace(/,/g, '')) / parseInt(api.monthlyLimit.replace(/,/g, ''))) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Info */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  <div className="text-center p-2 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400">Cost/Request</p>
                    <p className="text-sm font-medium text-white">{api.costPerRequest}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400">Cost/Token</p>
                    <p className="text-sm font-medium text-white">{api.costPerToken}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400">Speed Mode</p>
                    <p className="text-sm font-medium text-white">{api.speedMode}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                    onClick={() => handleAction(`View ${api.name}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                    onClick={() => handleAction(`Edit ${api.name}`)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                    onClick={() => handleAction(`Set Limit ${api.name}`)}
                  >
                    <Gauge className="w-3 h-3 mr-1" />
                    Limit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                    onClick={() => handleAction(`View History ${api.name}`)}
                  >
                    <History className="w-3 h-3 mr-1" />
                    History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AAMAIApiManagement;
