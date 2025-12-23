import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, Link2, Key, Bell, Shield, Users, Database,
  Globe, Mail, Phone, CreditCard, RefreshCw, Check,
  X, Plus, ExternalLink, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsIntegrations = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    slack: false,
    sms: false,
  });

  const integrations = [
    { id: 1, name: "Google Search Console", icon: "🔍", status: "connected", lastSync: "2 min ago", category: "seo" },
    { id: 2, name: "Google Analytics 4", icon: "📊", status: "connected", lastSync: "5 min ago", category: "analytics" },
    { id: 3, name: "Meta Ads Manager", icon: "📘", status: "connected", lastSync: "10 min ago", category: "ads" },
    { id: 4, name: "Google Ads", icon: "🔗", status: "connected", lastSync: "15 min ago", category: "ads" },
    { id: 5, name: "Ahrefs", icon: "🔗", status: "pending", lastSync: "Never", category: "seo" },
    { id: 6, name: "SEMrush", icon: "📈", status: "disconnected", lastSync: "30 days ago", category: "seo" },
    { id: 7, name: "Mailchimp", icon: "✉️", status: "connected", lastSync: "1 hour ago", category: "email" },
    { id: 8, name: "HubSpot CRM", icon: "🧡", status: "connected", lastSync: "30 min ago", category: "crm" },
    { id: 9, name: "Slack", icon: "💬", status: "connected", lastSync: "Real-time", category: "communication" },
    { id: 10, name: "WhatsApp Business", icon: "📱", status: "pending", lastSync: "Setup required", category: "communication" },
  ];

  const apiKeys = [
    { id: 1, name: "Production API Key", prefix: "sv_live_", status: "active", created: "Nov 15, 2024", lastUsed: "2 min ago" },
    { id: 2, name: "Development API Key", prefix: "sv_dev_", status: "active", created: "Oct 20, 2024", lastUsed: "1 hour ago" },
    { id: 3, name: "Webhook Secret", prefix: "whsec_", status: "active", created: "Dec 1, 2024", lastUsed: "15 min ago" },
  ];

  const teamMembers = [
    { id: 1, name: "SEO Manager", email: "seo@softwarevala.com", role: "Admin", status: "active", lastActive: "Now" },
    { id: 2, name: "Content Writer", email: "content@softwarevala.com", role: "Editor", status: "active", lastActive: "2 hours ago" },
    { id: 3, name: "Marketing Lead", email: "marketing@softwarevala.com", role: "Viewer", status: "invited", lastActive: "Pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "disconnected": return "bg-red-500/20 text-red-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-slate-500/20 to-zinc-500/20 rounded-xl border border-slate-500/30">
              <Settings className="h-6 w-6 text-slate-400" />
            </div>
            Settings & Integrations
          </h1>
          <p className="text-muted-foreground mt-1">Manage connections, team, and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-cyan-500/20">
          <TabsTrigger value="integrations" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Link2 className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-cyan-300">Connected Services</CardTitle>
              <Button variant="outline" className="border-cyan-500/30 text-cyan-400">
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <motion.div
                    key={integration.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">{integration.name}</h4>
                          <p className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
                        {integration.status === "connected" ? (
                          <Button variant="ghost" size="sm" className="text-cyan-400">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-cyan-400">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-cyan-300">API Keys</CardTitle>
              <Button variant="outline" className="border-cyan-500/30 text-cyan-400">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Key
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 bg-slate-800/30 rounded-lg border border-cyan-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <Key className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{key.name}</h4>
                        <p className="text-sm text-muted-foreground font-mono">{key.prefix}••••••••••••</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Created: {key.created}</p>
                        <p className="text-muted-foreground">Last used: {key.lastUsed}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">{key.status}</Badge>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">Security Notice</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep your API keys secure. Never share them publicly or commit them to version control.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-cyan-300">Team Members</CardTitle>
              <Button variant="outline" className="border-cyan-500/30 text-cyan-400">
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 bg-slate-800/30 rounded-lg border border-cyan-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="font-medium text-cyan-400">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{member.role}</Badge>
                      <span className="text-sm text-muted-foreground">{member.lastActive}</span>
                      <Badge className={member.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-cyan-300">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-medium text-white">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive alerts and reports via email</p>
                    </div>
                  </div>
                  <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications({ ...notifications, email: v })} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-medium text-white">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Browser push notifications for real-time alerts</p>
                    </div>
                  </div>
                  <Switch checked={notifications.push} onCheckedChange={(v) => setNotifications({ ...notifications, push: v })} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-medium text-white">Slack Notifications</h4>
                      <p className="text-sm text-muted-foreground">Post alerts to your Slack channel</p>
                    </div>
                  </div>
                  <Switch checked={notifications.slack} onCheckedChange={(v) => setNotifications({ ...notifications, slack: v })} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-medium text-white">SMS Alerts</h4>
                      <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                    </div>
                  </div>
                  <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsIntegrations;
