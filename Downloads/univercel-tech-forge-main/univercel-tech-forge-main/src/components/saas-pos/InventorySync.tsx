import React, { useState } from 'react';
import { 
  Warehouse, 
  AlertTriangle, 
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  Package,
  ArrowRight,
  Bell,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  centralStock: number;
  outlets: { id: string; name: string; stock: number; threshold: number }[];
  lastSync: string;
  status: 'ok' | 'low' | 'critical';
}

const inventory: InventoryItem[] = [
  { 
    id: '1', 
    name: 'Premium Coffee Blend', 
    sku: 'COF-001', 
    centralStock: 450,
    outlets: [
      { id: '1', name: 'Downtown', stock: 120, threshold: 30 },
      { id: '2', name: 'Mall', stock: 85, threshold: 25 },
      { id: '3', name: 'Airport', stock: 15, threshold: 20 },
    ],
    lastSync: '2 mins ago',
    status: 'low'
  },
  { 
    id: '2', 
    name: 'Organic Green Tea', 
    sku: 'TEA-002', 
    centralStock: 320,
    outlets: [
      { id: '1', name: 'Downtown', stock: 90, threshold: 25 },
      { id: '2', name: 'Mall', stock: 75, threshold: 25 },
      { id: '3', name: 'Airport', stock: 45, threshold: 20 },
    ],
    lastSync: '5 mins ago',
    status: 'ok'
  },
  { 
    id: '3', 
    name: 'Chocolate Croissant', 
    sku: 'BAK-003', 
    centralStock: 50,
    outlets: [
      { id: '1', name: 'Downtown', stock: 8, threshold: 15 },
      { id: '2', name: 'Mall', stock: 5, threshold: 10 },
      { id: '3', name: 'Airport', stock: 3, threshold: 10 },
    ],
    lastSync: '1 min ago',
    status: 'critical'
  },
  { 
    id: '4', 
    name: 'Avocado Toast', 
    sku: 'FOD-004', 
    centralStock: 95,
    outlets: [
      { id: '1', name: 'Downtown', stock: 25, threshold: 10 },
      { id: '2', name: 'Mall', stock: 20, threshold: 10 },
      { id: '3', name: 'Airport', stock: 12, threshold: 8 },
    ],
    lastSync: '8 mins ago',
    status: 'ok'
  },
];

const lowStockAlerts = [
  { product: 'Chocolate Croissant', outlet: 'Airport Kiosk', currentStock: 3, threshold: 10 },
  { product: 'Premium Coffee Blend', outlet: 'Airport Kiosk', currentStock: 15, threshold: 20 },
  { product: 'Chocolate Croissant', outlet: 'Mall Outlet', currentStock: 5, threshold: 10 },
  { product: 'Chocolate Croissant', outlet: 'Downtown Store', currentStock: 8, threshold: 15 },
];

export const InventorySync: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  const stats = [
    { label: 'Total SKUs', value: '248', icon: Package, color: 'bg-violet-100 text-violet-600' },
    { label: 'Low Stock Items', value: '12', icon: TrendingDown, color: 'bg-amber-100 text-amber-600' },
    { label: 'Critical Alerts', value: '4', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    { label: 'Last Full Sync', value: '2 min', icon: RefreshCw, color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Sync</h1>
          <p className="text-slate-500">Central stock view and outlet inventory management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
          >
            <ArrowRight className="w-4 h-4" />
            Transfer Stock
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-200 transition-all">
            <RefreshCw className="w-4 h-4" />
            Sync All Outlets
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Central Inventory</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 h-9 pl-9 pr-4 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Product</th>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Central</th>
                  {['Downtown', 'Mall', 'Airport'].map((outlet) => (
                    <th key={outlet} className="text-left py-3 px-5 text-sm font-semibold text-slate-600">{outlet}</th>
                  ))}
                  <th className="text-left py-3 px-5 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-5">
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-900">{item.centralStock}</span>
                    </td>
                    {item.outlets.map((outlet) => (
                      <td key={outlet.id} className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-medium",
                            outlet.stock <= outlet.threshold ? "text-red-600" : "text-slate-900"
                          )}>
                            {outlet.stock}
                          </span>
                          {outlet.stock <= outlet.threshold && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                    ))}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        item.status === 'ok' ? "bg-emerald-100 text-emerald-700" :
                        item.status === 'low' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      )}>
                        {item.status === 'ok' ? 'In Stock' : item.status === 'low' ? 'Low Stock' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-slate-900">Low Stock Alerts</h3>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                {lowStockAlerts.length} alerts
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockAlerts.map((alert, index) => (
              <div key={index} className="p-4 hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{alert.product}</p>
                    <p className="text-sm text-slate-500">{alert.outlet}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{alert.currentStock}</p>
                    <p className="text-xs text-slate-500">Min: {alert.threshold}</p>
                  </div>
                </div>
                <button className="mt-3 w-full py-2 text-sm font-medium text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors">
                  Restock Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 m-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Transfer Stock</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>Select product</option>
                  {inventory.map((item) => (
                    <option key={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                  <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                    <option>Central Warehouse</option>
                    <option>Downtown Store</option>
                    <option>Mall Outlet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                  <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                    <option>Select outlet</option>
                    <option>Downtown Store</option>
                    <option>Mall Outlet</option>
                    <option>Airport Kiosk</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input type="number" className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter quantity" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg">
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
