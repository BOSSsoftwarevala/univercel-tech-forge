import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  Shield,
  Zap,
  Users,
  Code,
  Wallet,
  MessageSquare,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Clock,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmergencyBuzzerControls = () => {
  const [masterFreeze, setMasterFreeze] = useState(false);
  const [buzzerSettings, setBuzzerSettings] = useState({
    leadBuzzer: true,
    devBuzzer: true,
    payoutBuzzer: true,
    escalationBuzzer: true,
  });

  const freezeControls = [
    { 
      id: "lead_freeze", 
      name: "Lead Flow Freeze", 
      description: "Stop all new lead assignments",
      icon: Users,
      status: false,
      severity: "high"
    },
    { 
      id: "payout_freeze", 
      name: "Payout Freeze", 
      description: "Halt all wallet withdrawals",
      icon: Wallet,
      status: false,
      severity: "critical"
    },
    { 
      id: "reseller_freeze", 
      name: "Reseller Freeze", 
      description: "Suspend reseller activities",
      icon: Users,
      status: false,
      severity: "high"
    },
    { 
      id: "comm_freeze", 
      name: "Communication Freeze", 
      description: "Pause all masked chats",
      icon: MessageSquare,
      status: false,
      severity: "medium"
    },
  ];

  const buzzerRules = [
    { 
      type: "Lead Buzzer",
      icon: Users,
      rules: [
        { name: "New Hot Lead", timeout: "5 min", escalation: "Franchise → Admin" },
        { name: "Idle Lead Alert", timeout: "6 hours", escalation: "Reseller → Franchise" },
        { name: "Urgent Lead", timeout: "2 min", escalation: "Direct to Admin" },
      ]
    },
    { 
      type: "Developer Buzzer",
      icon: Code,
      rules: [
        { name: "SLA Warning", timeout: "30 min before", escalation: "Dev → Manager" },
        { name: "SLA Breach", timeout: "Immediate", escalation: "Manager → Admin" },
        { name: "Task Pause > 30min", timeout: "After 30 min", escalation: "Justification Required" },
      ]
    },
    { 
      type: "Payment Buzzer",
      icon: Wallet,
      rules: [
        { name: "High Value Payout", timeout: "Immediate", escalation: "Finance → Admin" },
        { name: "Fraud Detection", timeout: "Instant Block", escalation: "Auto-freeze + Alert" },
        { name: "Duplicate Request", timeout: "Immediate", escalation: "Auto-reject + Log" },
      ]
    },
  ];

  const alertLevels = [
    { level: 1, name: "Info", color: "bg-blue-500/20 text-blue-400", description: "Normal notifications" },
    { level: 2, name: "Warning", color: "bg-yellow-500/20 text-yellow-400", description: "Requires attention" },
    { level: 3, name: "Urgent", color: "bg-orange-500/20 text-orange-400", description: "Immediate action needed" },
    { level: 4, name: "Critical", color: "bg-red-500/20 text-red-400", description: "System-wide alert" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-500/50 bg-red-500/10";
      case "high": return "border-orange-500/50 bg-orange-500/10";
      case "medium": return "border-yellow-500/50 bg-yellow-500/10";
      default: return "border-white/10 bg-background/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
            Emergency Mode & Buzzer Controls
          </h1>
          <p className="text-muted-foreground mt-1">System-wide freeze controls & alert routing</p>
        </div>
        <Button 
          className={`${masterFreeze ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          onClick={() => setMasterFreeze(!masterFreeze)}
        >
          {masterFreeze ? (
            <>
              <Unlock className="w-4 h-4 mr-2" />
              Release Master Freeze
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Activate Master Freeze
            </>
          )}
        </Button>
      </div>

      {/* Master Freeze Warning */}
      {masterFreeze && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="font-bold text-red-400 text-lg">MASTER FREEZE ACTIVE</div>
                  <div className="text-sm text-muted-foreground">
                    All system operations are halted. Only Super Admin can release.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Freeze Controls */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Emergency Freeze Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freezeControls.map((control, index) => (
              <motion.div
                key={control.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getSeverityColor(control.severity)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                      <control.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{control.name}</div>
                      <div className="text-sm text-muted-foreground">{control.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs capitalize">{control.severity}</Badge>
                    <Button 
                      size="sm" 
                      variant={control.status ? "destructive" : "outline"}
                      className={control.status ? "" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}
                    >
                      {control.status ? "Unfreeze" : "Freeze"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Buzzer Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {buzzerRules.map((category, index) => (
          <motion.div
            key={category.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <category.icon className="w-5 h-5 text-primary" />
                  {category.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.rules.map((rule, ruleIndex) => (
                    <div 
                      key={ruleIndex}
                      className="p-3 rounded-lg bg-background/50 border border-white/5"
                    >
                      <div className="font-medium text-sm mb-1">{rule.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {rule.timeout}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-primary mt-1">
                        <Zap className="w-3 h-3" />
                        {rule.escalation}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alert Levels & Sound Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Alert Level Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertLevels.map((level, index) => (
                <div 
                  key={level.level}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={level.color}>Level {level.level}</Badge>
                    <div>
                      <div className="font-medium text-sm">{level.name}</div>
                      <div className="text-xs text-muted-foreground">{level.description}</div>
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                      <SelectItem value="managers">Managers</SelectItem>
                      <SelectItem value="silent">Silent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-neon-teal" />
              Sound & Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(buzzerSettings).map(([key, value]) => (
                <div 
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    {value ? (
                      <Volume2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-red-400" />
                    )}
                    <span className="capitalize font-medium">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <Switch 
                    checked={value}
                    onCheckedChange={(checked) => 
                      setBuzzerSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <Button variant="outline" className="w-full border-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Sound Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyBuzzerControls;
