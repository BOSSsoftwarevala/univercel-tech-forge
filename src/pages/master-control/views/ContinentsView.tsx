import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const continents = [
  { id: 'africa', name: 'Africa', admin: 'John Doe' },
  { id: 'asia', name: 'Asia', admin: 'Jane Smith' },
  { id: 'europe', name: 'Europe', admin: 'Hans Mueller' },
  { id: 'north-america', name: 'North America', admin: 'Mike Johnson' },
  { id: 'south-america', name: 'South America', admin: 'Carlos Rivera' },
  { id: 'oceania', name: 'Oceania', admin: 'Sarah Williams' },
];

const countryData = [
  { country: 'Nigeria', manager: 'Adebayo Ola', revenue: '$45,200', issues: 2, growth: '+12%' },
  { country: 'Kenya', manager: 'James Mwangi', revenue: '$32,100', issues: 1, growth: '+8%' },
  { country: 'South Africa', manager: 'Pieter van Zyl', revenue: '$89,500', issues: 0, growth: '+15%' },
  { country: 'Egypt', manager: 'Ahmed Hassan', revenue: '$28,300', issues: 3, growth: '-2%' },
  { country: 'Ghana', manager: 'Kwame Asante', revenue: '$18,900', issues: 1, growth: '+5%' },
];

const ContinentsView = () => {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  if (selectedContinent) {
    const continent = continents.find(c => c.id === selectedContinent);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedContinent(null)}
            className="border-zinc-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">{continent?.name}</h2>
            <p className="text-sm text-zinc-500">Super Admin: {continent?.admin}</p>
          </div>
        </div>

        {/* Super Admin Activity */}
        <Card className="p-4 bg-white border-zinc-300">
          <h3 className="font-medium text-zinc-800 mb-4">Super Admin Activity</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500">Last Login</p>
                <p className="text-sm font-medium text-zinc-800">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500">Current Status</p>
                <p className="text-sm font-medium text-zinc-800">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500">Actions Today</p>
                <p className="text-sm font-medium text-zinc-800">24</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Country Summary Table */}
        <Card className="bg-white border-zinc-300">
          <div className="p-4 border-b border-zinc-200">
            <h3 className="font-medium text-zinc-800">Country Summary</h3>
            <p className="text-xs text-zinc-500">Read-only view — no drill-down</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200">
                <TableHead className="text-zinc-600">Country</TableHead>
                <TableHead className="text-zinc-600">Area Manager</TableHead>
                <TableHead className="text-zinc-600">Revenue</TableHead>
                <TableHead className="text-zinc-600">Issues</TableHead>
                <TableHead className="text-zinc-600">Growth %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countryData.map((row) => (
                <TableRow key={row.country} className="border-zinc-200">
                  <TableCell className="font-medium text-zinc-800">{row.country}</TableCell>
                  <TableCell className="text-zinc-700">{row.manager}</TableCell>
                  <TableCell className="text-zinc-700">{row.revenue}</TableCell>
                  <TableCell className="text-zinc-700">{row.issues}</TableCell>
                  <TableCell className={row.growth.startsWith('+') ? 'text-zinc-800' : 'text-zinc-500'}>
                    {row.growth}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-800">Continents</h2>
        <p className="text-sm text-zinc-500">Select a continent to view details</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {continents.map((continent) => (
          <Card 
            key={continent.id}
            className="p-4 bg-white border-zinc-300 cursor-pointer hover:bg-zinc-50 transition-colors"
            onClick={() => setSelectedContinent(continent.id)}
          >
            <h3 className="font-medium text-zinc-800">{continent.name}</h3>
            <p className="text-sm text-zinc-500 mt-1">Super Admin: {continent.admin}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContinentsView;
