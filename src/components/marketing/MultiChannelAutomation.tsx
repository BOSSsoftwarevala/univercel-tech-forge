import { motion } from "framer-motion";
import { Zap, Mail, MessageSquare, Bell, Globe, Play, Pause, Settings, TrendingUp, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

const MultiChannelAutomation = () => {
  const automations = [
    {
      id: 1,
      name: "Welcome Sequence",
      channel: "Email",
      icon: Mail,
      status: "active",
      triggered: 1247,
      opened: 892,
      converted: 156,
      schedule: "On signup",
    },
    {
      id: 2,
      name: "Demo Follow-up",
      channel: "WhatsApp",
      icon: MessageSquare,
      status: "active",
      triggered: 456,
      opened: 423,
      converted: 89,
      schedule: "24h after demo",
    },
    {
      id: 3,
      name: "Cart Abandonment",
      channel: "Push",
      icon: Bell,
      status: "active",
      triggered: 892,
      opened: 567,
      converted: 124,
      schedule: "1h after abandon",
    },
    {
      id: 4,
      name: "Regional Offer",
      channel: "SMS",
      icon: MessageSquare,
      status: "paused",
      triggered: 2340,
      opened: 1890,
      converted: 312,
      schedule: "Festival seasons",
    },
  ];

  const channelPerformance = [
    { channel: "Email", sent: 45000, opened: 18000, clicked: 5400, color: "cyan" },
    { channel: "WhatsApp", sent: 12000, delivered: 11800, read: 9400, color: "emerald" },
    { channel: "Push", sent: 28000, delivered: 26500, clicked: 8900, color: "amber" },
    { channel: "SMS", sent: 8500, delivered: 8200, clicked: 2100, color: "pink" },
  ];

  const regionLanguages = [
    { region: "India (Hindi)", active: true, campaigns: 8 },
    { region: "India (English)", active: true, campaigns: 12 },
    { region: "Middle East (Arabic)", active: true, campaigns: 4 },
    { region: "Europe (English)", active: false, campaigns: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-100 flex items-center gap-2">
          <Zap className="w-6 h-6 text-teal-400" />
          Multi-Channel Automation
        </h2>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-600">
          + Create Automation
        </Button>
      </div>

      {/* Channel Performance */}
      <div className="grid grid-cols-4 gap-4">
        {channelPerformance.map((channel, index) => (
          <motion.div
            key={channel.channel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium text-${channel.color}-400`}>{channel.channel}</h4>
                  <Badge className={`bg-${channel.color}-500/20 text-${channel.color}-400`}>
                    {((channel.clicked || channel.read || 0) / channel.sent * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Sent</span>
                    <span className="text-slate-300">{(channel.sent / 1000).toFixed(1)}K</span>
                  </div>
                  <Progress value={100} className={`h-1 bg-slate-800`} />
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{channel.opened ? "Opened" : "Delivered"}</span>
                    <span className="text-slate-300">{((channel.opened || channel.delivered || 0) / 1000).toFixed(1)}K</span>
                  </div>
                  <Progress value={((channel.opened || channel.delivered || 0) / channel.sent) * 100} className="h-1 bg-slate-800" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Automations List */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-teal-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-teal-100">Active Automations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {automations.map((automation, index) => {
                const Icon = automation.icon;
                return (
                  <motion.div
                    key={automation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          automation.status === "active" ? "bg-teal-500/20" : "bg-slate-700/50"
                        }`}>
                          <Icon className={`w-5 h-5 ${automation.status === "active" ? "text-teal-400" : "text-slate-500"}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-200">{automation.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{automation.channel}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{automation.schedule}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-200">{automation.triggered}</p>
                          <p className="text-xs text-slate-500">Triggered</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-cyan-400">{automation.opened}</p>
                          <p className="text-xs text-slate-500">Opened</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-400">{automation.converted}</p>
                          <p className="text-xs text-slate-500">Converted</p>
                        </div>
                        <Switch checked={automation.status === "active"} />
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-teal-400">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Regional Languages */}
        <Card className="bg-slate-900/50 border-teal-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-teal-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-400" />
              Regional Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {regionLanguages.map((region, index) => (
              <motion.div
                key={region.region}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">{region.region}</p>
                  <p className="text-xs text-slate-500">{region.campaigns} campaigns</p>
                </div>
                <Switch checked={region.active} />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-4 p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium text-teal-300">AI Language Adaptation</span>
              </div>
              <p className="text-xs text-slate-400">
                Automatically translates and adapts campaign content for each region while maintaining brand voice.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiChannelAutomation;
