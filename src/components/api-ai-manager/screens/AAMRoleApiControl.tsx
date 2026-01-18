import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Shield,
  Users,
  Cpu,
  Eye,
  Edit,
  Lock,
  History,
  AlertTriangle,
  DollarSign,
  Gauge
} from "lucide-react";

interface AAMRoleApiControlProps {
  activeSubSection: string;
}

const AAMRoleApiControl = ({ activeSubSection }: AAMRoleApiControlProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const roles = [
    {
      name: "Admin",
      icon: <Shield className="w-5 h-5" />,
      color: "from-red-500 to-pink-500",
      usageLimit: "100,000",
      usageUsed: "45,230",
      costCap: "₹25,000",
      costUsed: "₹11,308",
      blockOnOveruse: true,
      allowedApis: ["OpenAI GPT-4", "Vision AI", "Voice TTS/STT", "All Payment APIs", "All SMS APIs"],
      restrictedApis: ["Video AI"],
    },
    {
      name: "Reseller",
      icon: <Users className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      usageLimit: "50,000",
      usageUsed: "32,100",
      costCap: "₹15,000",
      costUsed: "₹8,025",
      blockOnOveruse: true,
      allowedApis: ["NLP / Chat AI", "SendGrid Email", "WhatsApp Business"],
      restrictedApis: ["OpenAI GPT-4", "Vision AI", "Video AI"],
    },
    {
      name: "Franchise",
      icon: <Users className="w-5 h-5" />,
      color: "from-purple-500 to-indigo-500",
      usageLimit: "30,000",
      usageUsed: "18,500",
      costCap: "₹10,000",
      costUsed: "₹4,625",
      blockOnOveruse: true,
      allowedApis: ["NLP / Chat AI", "SMS APIs", "Email APIs"],
      restrictedApis: ["All AI APIs except Chat", "Payment APIs"],
    },
    {
      name: "Developer",
      icon: <Cpu className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      usageLimit: "75,000",
      usageUsed: "28,450",
      costCap: "₹20,000",
      costUsed: "₹7,113",
      blockOnOveruse: false,
      allowedApis: ["All AI APIs", "All Cloud APIs", "Firebase", "Analytics APIs"],
      restrictedApis: ["Payment APIs", "Production SMS"],
    },
    {
      name: "User",
      icon: <Users className="w-5 h-5" />,
      color: "from-slate-500 to-slate-600",
      usageLimit: "5,000",
      usageUsed: "2,280",
      costCap: "₹1,000",
      costUsed: "₹570",
      blockOnOveruse: true,
      allowedApis: ["NLP / Chat AI (Limited)", "Basic Analytics"],
      restrictedApis: ["All other APIs"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Role-wise API Control</h1>
          <p className="text-slate-400 text-sm mt-1">Manage API access, limits, and costs per role</p>
        </div>
        <Button
          size="sm"
          onClick={() => handleAction("Add Role Config")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Users className="w-4 h-4 mr-2" />
          Add Role Config
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="space-y-4">
        {roles.map((role, index) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${role.color}`}>
                      {role.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{role.name} API Access</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-green-400 border-green-400/30">
                          {role.allowedApis.length} Allowed
                        </Badge>
                        <Badge variant="outline" className="text-red-400 border-red-400/30">
                          {role.restrictedApis.length} Restricted
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleAction(`View ${role.name}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleAction(`Edit ${role.name}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleAction(`Set Limit ${role.name}`)}
                    >
                      <Gauge className="w-4 h-4 mr-1" />
                      Limit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleAction(`History ${role.name}`)}
                    >
                      <History className="w-4 h-4 mr-1" />
                      History
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Usage Limit</span>
                      <Gauge className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">{role.usageUsed}</p>
                        <p className="text-xs text-slate-400">of {role.usageLimit}</p>
                      </div>
                      <div className="h-12 w-24">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{
                              width: `${(parseInt(role.usageUsed.replace(/,/g, '')) / parseInt(role.usageLimit.replace(/,/g, ''))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Cost Cap</span>
                      <DollarSign className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">{role.costUsed}</p>
                        <p className="text-xs text-slate-400">of {role.costCap}</p>
                      </div>
                      <div className="h-12 w-24">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${(parseInt(role.costUsed.replace(/[₹,]/g, '')) / parseInt(role.costCap.replace(/[₹,]/g, ''))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Block on Overuse</span>
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${role.blockOnOveruse ? 'text-green-400' : 'text-yellow-400'}`}>
                        {role.blockOnOveruse ? 'Enabled' : 'Disabled'}
                      </p>
                      <Switch
                        checked={role.blockOnOveruse}
                        onCheckedChange={() => handleAction(`Toggle Block ${role.name}`)}
                      />
                    </div>
                  </div>
                </div>

                {/* API Access */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-xs text-green-400 font-medium mb-2">Allowed APIs</p>
                    <div className="flex flex-wrap gap-2">
                      {role.allowedApis.map((api) => (
                        <Badge key={api} variant="outline" className="text-green-300 border-green-500/30 text-xs">
                          {api}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400 font-medium mb-2">Restricted APIs</p>
                    <div className="flex flex-wrap gap-2">
                      {role.restrictedApis.map((api) => (
                        <Badge key={api} variant="outline" className="text-red-300 border-red-500/30 text-xs">
                          {api}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AAMRoleApiControl;
