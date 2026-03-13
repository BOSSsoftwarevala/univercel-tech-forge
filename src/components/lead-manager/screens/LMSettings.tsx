import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, GitBranch, Bell, Clock, Calendar,
  Save, Loader2, AlertCircle
} from 'lucide-react';
import { useLeadSettings, useUpdateLeadSetting } from '@/hooks/useLeadData';

const categoryIcons: Record<string, any> = {
  status: Settings, assignment: GitBranch, notifications: Bell, working_hours: Clock, expiry: Calendar, general: Settings,
};

const LMSettings = () => {
  const { data: settings, isLoading } = useLeadSettings();
  const updateSetting = useUpdateLeadSetting();

  const handleToggle = (id: string, current: boolean) => {
    updateSetting.mutate({ id, updates: { is_enabled: !current } });
  };

  // Group settings by category
  const grouped: Record<string, any[]> = {};
  (settings || []).forEach((s: any) => {
    const cat = s.category || 'general';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Settings</h1>
          <p className="text-muted-foreground">Configure lead management rules and policies</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {(settings || []).length} Settings
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>No settings configured yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, items], index) => {
            const Icon = categoryIcons[category] || Settings;
            return (
              <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-card border-border">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-base capitalize">{category.replace('_', ' ')}</span>
                        <p className="text-xs text-muted-foreground font-normal">{items.length} settings</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border">
                          <div>
                            <span className="text-sm text-foreground">{item.setting_key?.replace(/_/g, ' ')}</span>
                            {item.setting_value?.description && (
                              <p className="text-xs text-muted-foreground">{item.setting_value.description}</p>
                            )}
                          </div>
                          <Switch checked={item.is_enabled} onCheckedChange={() => handleToggle(item.id, item.is_enabled)} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LMSettings;
