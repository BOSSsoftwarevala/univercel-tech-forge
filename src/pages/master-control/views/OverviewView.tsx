import { Globe2, Users, AlertTriangle, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const summaryCards = [
  { label: 'Total Continents', value: '6', icon: Globe2 },
  { label: 'Active Super Admins', value: '5', icon: Users },
  { label: 'Pending Critical Approvals', value: '12', icon: AlertTriangle },
  { label: 'Global Risk Level', value: 'Low', icon: Shield },
];

const continentData = [
  { name: 'Africa', admin: 'John Doe', countries: 12, trend: '↑', issues: 3, status: 'Normal' },
  { name: 'Asia', admin: 'Jane Smith', countries: 28, trend: '↑', issues: 8, status: 'Attention' },
  { name: 'Europe', admin: 'Hans Mueller', countries: 22, trend: '↓', issues: 2, status: 'Normal' },
  { name: 'North America', admin: 'Mike Johnson', countries: 8, trend: '↑', issues: 1, status: 'Normal' },
  { name: 'South America', admin: 'Carlos Rivera', countries: 10, trend: '↓', issues: 5, status: 'Attention' },
  { name: 'Oceania', admin: 'Sarah Williams', countries: 4, trend: '↑', issues: 0, status: 'Normal' },
];

const OverviewView = () => {
  return (
    <div className="space-y-6">
      {/* Section A: Global Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Global Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="p-4 bg-white border border-neutral-200 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">{card.label}</p>
                  <p className="text-2xl font-bold text-neutral-800 mt-1">{card.value}</p>
                </div>
                <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-neutral-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Continent Snapshot Table */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Continent Snapshot</h2>
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 border-neutral-200">
                <TableHead className="text-neutral-600 font-medium">Continent Name</TableHead>
                <TableHead className="text-neutral-600 font-medium">Super Admin</TableHead>
                <TableHead className="text-neutral-600 font-medium">Active Countries</TableHead>
                <TableHead className="text-neutral-600 font-medium">Revenue Trend</TableHead>
                <TableHead className="text-neutral-600 font-medium">Open Issues</TableHead>
                <TableHead className="text-neutral-600 font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {continentData.map((row) => (
                <TableRow 
                  key={row.name} 
                  className="border-neutral-100 cursor-pointer hover:bg-neutral-50"
                >
                  <TableCell className="font-medium text-neutral-800">{row.name}</TableCell>
                  <TableCell className="text-neutral-600">{row.admin}</TableCell>
                  <TableCell className="text-neutral-600">{row.countries}</TableCell>
                  <TableCell className="text-neutral-600 text-lg">{row.trend}</TableCell>
                  <TableCell className="text-neutral-600">{row.issues}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      row.status === 'Normal' 
                        ? 'bg-neutral-100 text-neutral-600' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-neutral-500 mt-2">Click row to view continent detail (read-only)</p>
      </div>
    </div>
  );
};

export default OverviewView;
