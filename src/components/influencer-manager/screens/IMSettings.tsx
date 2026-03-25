import { motion } from 'framer-motion';
import { Settings, DollarSign, ShieldAlert, UserX, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const settingsSections = [
  {
    title: 'Default Payout Rules',
    icon: DollarSign,
    color: 'emerald',
    settings: [
      { label: 'Auto-calculate payout', value: true },
      { label: 'Include performance bonus', value: true },
      { label: 'Deduct penalties automatically', value: true },
      { label: 'Minimum payout threshold: ₹1,000', value: true },
    ]
  },
  {
    title: 'Fraud Threshold',
    icon: ShieldAlert,
    color: 'red',
    settings: [
      { label: 'Auto-flag at 70% risk score', value: true },
      { label: 'Auto-suspend at 90% risk score', value: true },
      { label: 'Bot detection enabled', value: true },
      { label: 'Geo mismatch alerts', value: true },
    ]
  },
  {
    title: 'Auto-Suspension Rules',
    icon: UserX,
    color: 'orange',
    settings: [
      { label: 'Suspend on 3+ fraud alerts', value: true },
      { label: 'Suspend on policy violation', value: true },
      { label: 'Require approval for reinstatement', value: true },
      { label: 'Auto-escalate to Boss after 48h', value: false },
    ]
  },
  {
    title: 'Country Restrictions',
    icon: Globe,
    color: 'blue',
    settings: [
      { label: 'Restrict high-risk countries', value: true },
      { label: 'Require extra verification for new regions', value: true },
      { label: 'Geo-lock campaign assignments', value: true },
      { label: 'Allow cross-border campaigns', value: false },
    ]
  },
];

const IMSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Influencer Settings</h1>
        <span className="text-sm text-yellow-400">(Limited Access)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className={`p-6 rounded-xl bg-slate-800/50 border border-${section.color}-500/20`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${section.color}-500/20 flex items-center justify-center`}>
                <section.icon className={`w-5 h-5 text-${section.color}-400`} />
              </div>
              <h3 className="font-bold text-white">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.settings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{setting.label}</span>
                  <Switch checked={setting.value} disabled />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-sm text-yellow-400">
          Note: Settings changes require Boss/Super Admin approval. Contact your supervisor for modifications.
        </p>
      </div>
    </div>
  );
};

export default IMSettings;
