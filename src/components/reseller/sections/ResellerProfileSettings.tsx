import { Card, CardContent } from '@/components/ui/card';
import { Users, Bell, Settings, Globe } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0' };

export default function ResellerProfileSettings({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    set_profile: 'Profile Settings', set_notifications: 'Notification Preferences',
    set_security: 'Security Settings', set_api: 'API Access',
  };
  const icons: Record<string, React.ElementType> = {
    set_profile: Users, set_notifications: Bell, set_security: Settings, set_api: Globe,
  };
  const Icon = icons[activeView] || Settings;

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Settings'}</h2>
      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <Icon className="w-12 h-12 mb-3 opacity-20" style={{ color: W.gray }} />
            <p className="text-[13px]" style={{ color: W.gray }}>Settings panel coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
