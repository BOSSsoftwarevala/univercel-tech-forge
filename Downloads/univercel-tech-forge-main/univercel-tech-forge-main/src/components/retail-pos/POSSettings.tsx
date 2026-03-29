import React, { useState } from 'react';
import { 
  Store, 
  Receipt, 
  Percent, 
  Printer,
  Bell,
  Shield,
  Database,
  Save,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const POSSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const [taxEnabled, setTaxEnabled] = useState(true);

  const tabs = [
    { id: 'shop', label: 'Shop Profile', icon: Store },
    { id: 'tax', label: 'Tax Settings', icon: Percent },
    { id: 'receipt', label: 'Receipt', icon: Receipt },
    { id: 'printer', label: 'Printer', icon: Printer },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Configure your POS system</p>
      </div>

      <div className="flex gap-6">
        {/* Settings Tabs */}
        <div className="w-64 bg-white rounded-xl border border-slate-200 p-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-colors text-left",
                  activeTab === tab.id 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          {activeTab === 'shop' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Shop Profile</h2>
              
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Store className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <Button variant="outline" className="rounded-xl mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-slate-500">PNG or JPG, max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Shop Name</label>
                  <Input defaultValue="Sharma General Store" className="h-12 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                  <Input defaultValue="9876543210" className="h-12 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                  <Input defaultValue="shop@example.com" className="h-12 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">GST Number</label>
                  <Input defaultValue="27AABCU9603R1ZM" className="h-12 rounded-xl" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Address</label>
                  <Input defaultValue="123, Main Road, City - 400001" className="h-12 rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button size="lg" className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 rounded-xl">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Tax Settings</h2>
              
              <div className="space-y-6">
                {/* Tax Toggle */}
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-slate-800">Enable Tax</h3>
                    <p className="text-sm text-slate-500">Apply tax on all transactions</p>
                  </div>
                  <button
                    onClick={() => setTaxEnabled(!taxEnabled)}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors relative",
                      taxEnabled ? "bg-emerald-500" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 bg-white rounded-full shadow absolute top-1 transition-all",
                      taxEnabled ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>

                {taxEnabled && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Default Tax Rate (%)</label>
                        <Input type="number" defaultValue="5" className="h-12 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Tax Name</label>
                        <Input defaultValue="GST" className="h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5">
                      <h3 className="font-semibold text-slate-800 mb-4">Category-wise Tax Rates</h3>
                      <div className="space-y-3">
                        {[
                          { category: 'Grocery', rate: 5 },
                          { category: 'Dairy', rate: 0 },
                          { category: 'Beverages', rate: 12 },
                          { category: 'Bakery', rate: 5 },
                        ].map((item) => (
                          <div key={item.category} className="flex items-center justify-between">
                            <span className="text-slate-600">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="number" 
                                defaultValue={item.rate} 
                                className="w-20 h-10 rounded-lg text-center"
                              />
                              <span className="text-slate-500">%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <Button size="lg" className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 rounded-xl">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'receipt' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Receipt Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Header Text</label>
                  <Input defaultValue="Thank you for shopping with us!" className="h-12 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Footer Text</label>
                  <Input defaultValue="Visit again soon!" className="h-12 rounded-xl" />
                </div>
                
                <div className="bg-slate-50 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">Receipt Options</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Show Shop Logo', checked: true },
                      { label: 'Show GST Number', checked: true },
                      { label: 'Show Customer Name', checked: false },
                      { label: 'Show Barcode', checked: true },
                      { label: 'Auto Print Receipt', checked: true },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={item.checked}
                          className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-slate-600">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Receipt Preview */}
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-6">
                  <div className="max-w-xs mx-auto text-center text-sm">
                    <p className="font-bold text-lg mb-1">Sharma General Store</p>
                    <p className="text-slate-500 mb-3">123, Main Road, City</p>
                    <p className="text-slate-500 mb-1">GST: 27AABCU9603R1ZM</p>
                    <div className="border-t border-dashed border-slate-300 my-3" />
                    <p className="text-left">Rice (1kg) x 2 ................ ₹110</p>
                    <p className="text-left">Oil (1L) x 1 ................... ₹140</p>
                    <div className="border-t border-dashed border-slate-300 my-3" />
                    <p className="text-right font-bold">Total: ₹262.50</p>
                    <div className="border-t border-dashed border-slate-300 my-3" />
                    <p className="text-slate-500">Thank you for shopping!</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button size="lg" className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 rounded-xl">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'printer' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Printer Settings</h2>
              
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <Printer className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Thermal Printer</h3>
                      <p className="text-sm text-slate-500">USB Connected</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium">
                    Connected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Paper Width</label>
                    <select className="w-full h-12 rounded-xl border border-slate-200 px-4">
                      <option>58mm</option>
                      <option>80mm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Print Copies</label>
                    <Input type="number" defaultValue="1" className="h-12 rounded-xl" />
                  </div>
                </div>

                <Button variant="outline" className="rounded-xl">
                  Print Test Page
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Notifications</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Low Stock Alert', description: 'Notify when stock falls below threshold', checked: true },
                  { label: 'Daily Sales Summary', description: 'End of day sales report', checked: true },
                  { label: 'New Customer Registration', description: 'When a new customer is added', checked: false },
                  { label: 'Large Transaction Alert', description: 'For transactions above ₹10,000', checked: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-slate-800">{item.label}</h3>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked={item.checked}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Backup & Data</h2>
              
              <div className="space-y-6">
                <div className="p-5 bg-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">Last Backup</h3>
                  </div>
                  <p className="text-emerald-700">Today at 6:00 AM (Automatic)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button size="lg" className="h-14 rounded-xl bg-slate-700 hover:bg-slate-800">
                    <Database className="w-5 h-5 mr-2" />
                    Backup Now
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 rounded-xl">
                    <Upload className="w-5 h-5 mr-2" />
                    Restore Backup
                  </Button>
                </div>

                <div className="bg-slate-50 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">Auto Backup Schedule</h3>
                  <select className="w-full h-12 rounded-xl border border-slate-200 px-4">
                    <option>Daily at 6:00 AM</option>
                    <option>Daily at 12:00 AM</option>
                    <option>Weekly on Sunday</option>
                    <option>Manual Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
