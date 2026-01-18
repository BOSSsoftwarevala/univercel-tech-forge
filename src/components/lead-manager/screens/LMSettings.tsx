import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, GitBranch, Bell, Clock, Calendar,
  Save, Eye, Edit
} from 'lucide-react';

const settingsSections = [
  { 
    id: 'status', 
    name: 'Lead Status Rules', 
    icon: Settings, 
    description: 'Configure lead status transitions',
    items: [
      { label: 'Auto-move to Contacted after first call', enabled: true },
      { label: 'Require note for Lost status', enabled: true },
      { label: 'Lock Won leads from editing', enabled: false },
    ]
  },
  { 
    id: 'assignment', 
    name: 'Auto Assignment Rules', 
    icon: GitBranch, 
    description: 'Configure automatic lead assignment',
    items: [
      { label: 'Round Robin assignment', enabled: true },
      { label: 'Geo-based routing', enabled: true },
      { label: 'Skill-based matching', enabled: false },
    ]
  },
  { 
    id: 'notifications', 
    name: 'Notification Settings', 
    icon: Bell, 
    description: 'Configure alert preferences',
    items: [
      { label: 'New lead notifications', enabled: true },
      { label: 'SLA breach alerts', enabled: true },
      { label: 'Daily summary email', enabled: true },
    ]
  },
  { 
    id: 'working', 
    name: 'Working Hours', 
    icon: Clock, 
    description: 'Set team availability hours',
    items: [
      { label: 'Enforce working hours', enabled: true },
      { label: 'Weekend handling', enabled: false },
      { label: 'Holiday calendar', enabled: true },
    ]
  },
  { 
    id: 'expiry', 
    name: 'Lead Expiry Policy', 
    icon: Calendar, 
    description: 'Configure lead lifecycle rules',
    items: [
      { label: 'Auto-archive after 90 days', enabled: true },
      { label: 'Idle lead alerts', enabled: true },
      { label: 'Expired lead cleanup', enabled: false },
    ]
  },
];

const LMSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Settings</h1>
          <p className="text-muted-foreground">Configure lead management rules and policies</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-base">{section.name}</span>
                      <p className="text-xs text-muted-foreground font-normal">{section.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <Switch checked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Config */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Quick Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Lead Status</Label>
              <Input defaultValue="New" />
            </div>
            <div className="space-y-2">
              <Label>Lead Expiry Days</Label>
              <Input type="number" defaultValue="90" />
            </div>
            <div className="space-y-2">
              <Label>SLA Response Time (hours)</Label>
              <Input type="number" defaultValue="24" />
            </div>
            <div className="space-y-2">
              <Label>Max Leads Per Agent</Label>
              <Input type="number" defaultValue="50" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border">
        <div>
          <p className="font-semibold text-foreground">Need Help?</p>
          <p className="text-xs text-muted-foreground">Contact support for advanced configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Reset to Defaults</Button>
          <Button size="sm">Contact Support</Button>
        </div>
      </div>
    </div>
  );
};

export default LMSettings;
