import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Mail, FileText, Clock, Shield } from 'lucide-react';

const BillingSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <Settings className="w-6 h-6 text-emerald-400" />
        Billing Settings
      </h2>
      <p className="text-slate-400">Configure billing preferences and automation</p>
    </div>

    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader><CardTitle className="text-lg text-white">Automation</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {[
          { icon: FileText, title: 'Auto Invoice Generation', desc: 'Generate invoices automatically', enabled: true },
          { icon: Clock, title: 'Auto Payment Reminders', desc: 'Send reminders before due date', enabled: true },
          { icon: Bell, title: 'Overdue Alerts', desc: 'Notify for overdue invoices', enabled: true },
          { icon: Mail, title: 'Email Receipts', desc: 'Send receipts after payment', enabled: false },
        ].map((setting) => (
          <div key={setting.title} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <div className="flex items-center gap-3">
              <setting.icon className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-medium text-white">{setting.title}</p>
                <p className="text-xs text-slate-400">{setting.desc}</p>
              </div>
            </div>
            <Switch defaultChecked={setting.enabled} />
          </div>
        ))}
      </CardContent>
    </Card>

    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader><CardTitle className="text-lg text-white">Security</CardTitle></CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400">
            <Shield className="w-5 h-5" />
            <span className="font-medium">All billing actions are logged and audit-ready</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default BillingSettings;
