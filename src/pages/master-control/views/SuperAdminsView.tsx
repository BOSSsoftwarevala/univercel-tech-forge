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
        <h2 className="text-lg font-semibold text-zinc-800">Super Admins</h2>
        <p className="text-sm text-zinc-500">Monitor all continent-level administrators</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-zinc-300">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Total Super Admins</p>
              <p className="text-xl font-bold text-zinc-800">6</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-zinc-300">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Currently Active</p>
              <p className="text-xl font-bold text-zinc-800">4</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-zinc-300">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Idle</p>
              <p className="text-xl font-bold text-zinc-800">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-zinc-300">
          <div className="flex items-center gap-3">
            <Globe2 className="w-5 h-5 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Offline</p>
              <p className="text-xl font-bold text-zinc-800">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Super Admins Table */}
      <Card className="bg-white border-zinc-300">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200">
              <TableHead className="text-zinc-600">Name</TableHead>
              <TableHead className="text-zinc-600">Continent</TableHead>
              <TableHead className="text-zinc-600">Status</TableHead>
              <TableHead className="text-zinc-600">Last Login</TableHead>
              <TableHead className="text-zinc-600">Actions Today</TableHead>
              <TableHead className="text-zinc-600">Countries</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {superAdmins.map((admin) => (
              <TableRow key={admin.name} className="border-zinc-200">
                <TableCell className="font-medium text-zinc-800">{admin.name}</TableCell>
                <TableCell className="text-zinc-700">{admin.continent}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    admin.status === 'Active' 
                      ? 'bg-zinc-200 text-zinc-700'
                      : admin.status === 'Idle'
                      ? 'bg-zinc-300 text-zinc-600'
                      : 'bg-zinc-800 text-white'
                  }`}>
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-700">{admin.lastLogin}</TableCell>
                <TableCell className="text-zinc-700">{admin.actionsToday}</TableCell>
                <TableCell className="text-zinc-700">{admin.countries}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SuperAdminsView;
