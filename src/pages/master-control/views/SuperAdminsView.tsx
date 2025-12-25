import { Card } from '@/components/ui/card';
import { User, Clock, Activity, Globe2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const superAdmins = [
  { 
    name: 'John Doe', 
    continent: 'Africa', 
    status: 'Active', 
    lastLogin: '2 hours ago',
    actionsToday: 24,
    countries: 12
  },
  { 
    name: 'Jane Smith', 
    continent: 'Asia', 
    status: 'Active', 
    lastLogin: '30 min ago',
    actionsToday: 45,
    countries: 28
  },
  { 
    name: 'Hans Mueller', 
    continent: 'Europe', 
    status: 'Idle', 
    lastLogin: '4 hours ago',
    actionsToday: 12,
    countries: 22
  },
  { 
    name: 'Mike Johnson', 
    continent: 'North America', 
    status: 'Active', 
    lastLogin: '1 hour ago',
    actionsToday: 31,
    countries: 8
  },
  { 
    name: 'Carlos Rivera', 
    continent: 'South America', 
    status: 'Offline', 
    lastLogin: '1 day ago',
    actionsToday: 0,
    countries: 10
  },
  { 
    name: 'Sarah Williams', 
    continent: 'Oceania', 
    status: 'Active', 
    lastLogin: '15 min ago',
    actionsToday: 18,
    countries: 4
  },
];

const SuperAdminsView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Super Admins</h2>
        <p className="text-sm text-gray-500">Monitor all continent-level administrators</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Super Admins</p>
              <p className="text-xl font-bold text-white">6</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Currently Active</p>
              <p className="text-xl font-bold text-green-400">4</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Idle</p>
              <p className="text-xl font-bold text-amber-400">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Offline</p>
              <p className="text-xl font-bold text-gray-400">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Super Admins Table */}
      <Card className="bg-[#1a1a2e] border-gray-800/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800/50 hover:bg-transparent">
              <TableHead className="text-gray-500">Name</TableHead>
              <TableHead className="text-gray-500">Continent</TableHead>
              <TableHead className="text-gray-500">Status</TableHead>
              <TableHead className="text-gray-500">Last Login</TableHead>
              <TableHead className="text-gray-500">Actions Today</TableHead>
              <TableHead className="text-gray-500">Countries</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {superAdmins.map((admin) => (
              <TableRow key={admin.name} className="border-gray-800/30 hover:bg-gray-800/30">
                <TableCell className="font-medium text-white">{admin.name}</TableCell>
                <TableCell className="text-gray-400">{admin.continent}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    admin.status === 'Active' 
                      ? 'bg-green-500/15 text-green-400'
                      : admin.status === 'Idle'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-gray-500/15 text-gray-400'
                  }`}>
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400">{admin.lastLogin}</TableCell>
                <TableCell className="text-gray-400">{admin.actionsToday}</TableCell>
                <TableCell className="text-gray-400">{admin.countries}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SuperAdminsView;
