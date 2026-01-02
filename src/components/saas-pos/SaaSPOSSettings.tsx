import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  CreditCard,
  Bell,
  Globe,
  Palette,
  Database,
  Save,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsTabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Backup', icon: Database },
];

export const SaaSPOSSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <Building2 className="w-10 h-10 text-violet-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Company Logo</h3>
                <p className="text-sm text-slate-500 mt-1">Upload your company logo (PNG, JPG, max 2MB)</p>
                <button className="mt-3 flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input type="text" defaultValue="Acme Retail Corp" className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>Retail</option>
                  <option>Restaurant</option>
                  <option>Cafe</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" defaultValue="admin@acmeretail.com" className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Address</label>
              <textarea rows={3} defaultValue="123 Business Ave, Suite 100, New York, NY 10001" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-200">Current Plan</p>
                  <h3 className="text-2xl font-bold mt-1">Enterprise</h3>
                </div>
                <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30">
                  Upgrade
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-violet-200 text-sm">Outlets</p>
                    <p className="font-semibold">12 / Unlimited</p>
                  </div>
                  <div>
                    <p className="text-violet-200 text-sm">Users</p>
                    <p className="font-semibold">72 / Unlimited</p>
                  </div>
                  <div>
                    <p className="text-violet-200 text-sm">Next Billing</p>
                    <p className="font-semibold">Jan 15, 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Payment Method</h4>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-slate-500">Expires 12/26</p>
                  </div>
                </div>
                <button className="text-sm text-violet-600 font-medium">Update</button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { title: 'Low Stock Alerts', desc: 'Get notified when inventory is low', enabled: true },
              { title: 'Sales Reports', desc: 'Daily sales summary via email', enabled: true },
              { title: 'New Order Alerts', desc: 'Real-time notifications for new orders', enabled: false },
              { title: 'Employee Activity', desc: 'Login/logout notifications', enabled: true },
              { title: 'Payment Failures', desc: 'Immediate alerts for failed transactions', enabled: true },
              { title: 'System Updates', desc: 'News about platform updates', enabled: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <button className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  item.enabled ? "bg-violet-600" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-1 transition-all",
                    item.enabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'localization':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>USD - US Dollar ($)</option>
                  <option>EUR - Euro (€)</option>
                  <option>GBP - British Pound (£)</option>
                  <option>INR - Indian Rupee (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Kolkata (IST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
                <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Changes to localization settings will affect all outlets. Individual outlet overrides can be configured in Outlet Management.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Select a settings category to configure</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Configure your POS platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-200 transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 h-fit">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors",
                    activeTab === tab.id 
                      ? "bg-violet-100 text-violet-700" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
