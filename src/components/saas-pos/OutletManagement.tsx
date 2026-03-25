import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Search, 
  MoreVertical,
  MapPin,
  Users,
  Clock,
  Wifi,
  WifiOff,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Outlet {
  id: string;
  name: string;
  address: string;
  manager: string;
  employees: number;
  status: 'online' | 'offline';
  todaySales: number;
  lastSync: string;
}

const outlets: Outlet[] = [
  { id: '1', name: 'Downtown Store', address: '123 Main St, Downtown', manager: 'John Smith', employees: 8, status: 'online', todaySales: 4580, lastSync: '2 mins ago' },
  { id: '2', name: 'Mall Outlet', address: 'City Mall, Floor 2', manager: 'Sarah Johnson', employees: 6, status: 'online', todaySales: 3240, lastSync: '1 min ago' },
  { id: '3', name: 'Airport Kiosk', address: 'Terminal 3, Gate B', manager: 'Mike Brown', employees: 4, status: 'offline', todaySales: 1890, lastSync: '45 mins ago' },
  { id: '4', name: 'Beach Front', address: '45 Ocean Drive', manager: 'Lisa Davis', employees: 5, status: 'online', todaySales: 2650, lastSync: '30 secs ago' },
  { id: '5', name: 'University Campus', address: 'Building C, Ground Floor', manager: 'Tom Wilson', employees: 3, status: 'online', todaySales: 1230, lastSync: '5 mins ago' },
];

export const OutletManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOutlets = outlets.filter(outlet => 
    outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Outlet Management</h1>
          <p className="text-slate-500">Manage your store locations and assign managers</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-200 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Outlet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{outlets.length}</p>
              <p className="text-sm text-slate-500">Total Outlets</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{outlets.filter(o => o.status === 'online').length}</p>
              <p className="text-sm text-slate-500">Online</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{outlets.filter(o => o.status === 'offline').length}</p>
              <p className="text-sm text-slate-500">Offline</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{outlets.reduce((acc, o) => acc + o.employees, 0)}</p>
              <p className="text-sm text-slate-500">Total Staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search outlets..."
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOutlets.map((outlet) => (
          <div key={outlet.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    outlet.status === 'online' ? "bg-emerald-100" : "bg-red-100"
                  )}>
                    <Store className={cn(
                      "w-6 h-6",
                      outlet.status === 'online' ? "text-emerald-600" : "text-red-600"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{outlet.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {outlet.address}
                    </div>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Manager</span>
                <span className="text-sm font-medium text-slate-900">{outlet.manager}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Employees</span>
                <span className="text-sm font-medium text-slate-900">{outlet.employees}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Today's Sales</span>
                <span className="text-sm font-semibold text-emerald-600">${outlet.todaySales.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <span className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  outlet.status === 'online' ? "text-emerald-600" : "text-red-500"
                )}>
                  {outlet.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {outlet.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last sync: {outlet.lastSync}
                </span>
              </div>
            </div>

            {/* Card Actions */}
            <div className="px-5 py-3 bg-slate-50 flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-violet-600 hover:bg-violet-100 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Outlet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 m-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Outlet</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Outlet Name</label>
                <input type="text" className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter outlet name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input type="text" className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter full address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Manager</label>
                <select className="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>Select manager</option>
                  <option>John Smith</option>
                  <option>Sarah Johnson</option>
                  <option>Mike Brown</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg">
                  Add Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
