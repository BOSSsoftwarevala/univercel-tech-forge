import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Lock, Bell, Palette, Code2, Globe, Clock,
  Keyboard, Sun, Moon, Monitor, Save, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const DeveloperSettingsSection = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile Settings
  const [profile, setProfile] = useState({
    displayName: 'John Developer',
    email: 'john***@example.com',
    timezone: 'Asia/Kolkata',
    language: 'en',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    bugAssigned: true,
    reviewComplete: true,
    deadlineReminder: true,
    chatMessages: false,
    emailDigest: true,
  });

  // Theme Settings
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  // Editor Preferences
  const [editorPrefs, setEditorPrefs] = useState({
    fontSize: '14',
    tabSize: '2',
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
    formatOnSave: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'editor', label: 'Editor', icon: Code2 },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  ];

  const shortcuts = [
    { action: 'Toggle Timer', keys: ['Ctrl', 'T'] },
    { action: 'Submit Code', keys: ['Ctrl', 'Enter'] },
    { action: 'Open AI Assistant', keys: ['Ctrl', 'K'] },
    { action: 'Mark Task Complete', keys: ['Ctrl', 'Shift', 'C'] },
    { action: 'Search Tasks', keys: ['Ctrl', 'F'] },
    { action: 'Navigate Tasks', keys: ['↑', '↓'] },
    { action: 'View Details', keys: ['Enter'] },
    { action: 'Close Modal', keys: ['Esc'] },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-cyan-400" />
          Settings
        </h1>
        <p className="text-slate-400 mt-1">Customize your developer experience</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Display Name</label>
                  <Input
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Email (Masked)</label>
                  <Input
                    value={profile.email}
                    disabled
                    className="bg-slate-900/50 border-slate-700 text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </label>
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </motion.div>
          )}

          {/* Password Settings */}
          {activeTab === 'password' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      className="bg-slate-900 border-slate-700 pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">New Password</label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-sm text-slate-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </motion.div>
          )}

          {/* Theme Settings */}
          {activeTab === 'theme' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">Theme Settings</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id as any)}
                    className={`p-4 rounded-xl border transition-all ${
                      theme === option.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <option.icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">{option.label}</p>
                  </button>
                ))}
              </div>

              <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
                <Save className="w-4 h-4 mr-2" />
                Apply Theme
              </Button>
            </motion.div>
          )}

          {/* Editor Preferences */}
          {activeTab === 'editor' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">Editor Preferences</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Font Size</label>
                  <select
                    value={editorPrefs.fontSize}
                    onChange={(e) => setEditorPrefs({ ...editorPrefs, fontSize: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Tab Size</label>
                  <select
                    value={editorPrefs.tabSize}
                    onChange={(e) => setEditorPrefs({ ...editorPrefs, tabSize: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'wordWrap', label: 'Word Wrap' },
                  { key: 'minimap', label: 'Show Minimap' },
                  { key: 'lineNumbers', label: 'Show Line Numbers' },
                  { key: 'formatOnSave', label: 'Format on Save' },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-sm text-slate-300">{pref.label}</span>
                    <Switch
                      checked={editorPrefs[pref.key as keyof typeof editorPrefs] as boolean}
                      onCheckedChange={(checked) => 
                        setEditorPrefs({ ...editorPrefs, [pref.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </motion.div>
          )}

          {/* Keyboard Shortcuts */}
          {activeTab === 'shortcuts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
              
              <div className="space-y-2">
                {shortcuts.map((shortcut, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                  >
                    <span className="text-sm text-slate-300">{shortcut.action}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-400"
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettingsSection;
