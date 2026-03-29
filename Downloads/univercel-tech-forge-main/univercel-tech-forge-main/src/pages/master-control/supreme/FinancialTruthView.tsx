import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DollarSign, Eye, TrendingUp, ArrowRight, PieChart,
  AlertTriangle, Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FinancialRecord {
  id: string;
  role: string;
  shown_cost: number;
  real_cost: number;
  margin: number;
  commission: number;
  beneficiary: string;
}

const FinancialTruthView = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [totalHiddenMargin, setTotalHiddenMargin] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    // Simulated financial truth data
    const mockData: FinancialRecord[] = [
      { id: '1', role: 'franchise', shown_cost: 10000, real_cost: 7500, margin: 2500, commission: 500, beneficiary: 'Platform' },
      { id: '2', role: 'reseller', shown_cost: 5000, real_cost: 3800, margin: 1200, commission: 300, beneficiary: 'Franchise-001' },
      { id: '3', role: 'influencer', shown_cost: 2000, real_cost: 1500, margin: 500, commission: 150, beneficiary: 'Platform' },
      { id: '4', role: 'prime_user', shown_cost: 500, real_cost: 400, margin: 100, commission: 50, beneficiary: 'Reseller-042' },
      { id: '5', role: 'developer', shown_cost: 8000, real_cost: 6000, margin: 2000, commission: 400, beneficiary: 'Platform' },
    ];

    setRecords(mockData);
    setTotalHiddenMargin(mockData.reduce((sum, r) => sum + r.margin, 0));
    setTotalCommission(mockData.reduce((sum, r) => sum + r.commission, 0));
  }, []);

  const marginData = [
    { month: 'Jan', shown: 45000, real: 32000, margin: 13000 },
    { month: 'Feb', shown: 52000, real: 38000, margin: 14000 },
    { month: 'Mar', shown: 48000, real: 35000, margin: 13000 },
    { month: 'Apr', shown: 61000, real: 44000, margin: 17000 },
    { month: 'May', shown: 55000, real: 40000, margin: 15000 },
    { month: 'Jun', shown: 67000, real: 48000, margin: 19000 },
  ];

  const benefitData = [
    { name: 'Platform', value: 45000 },
    { name: 'Franchises', value: 28000 },
    { name: 'Resellers', value: 15000 },
    { name: 'Influencers', value: 8000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-green-400" />
            Black Box Financial Truth
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Real cost vs shown cost engine - Internal visibility only
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 gap-2">
          <Lock className="w-4 h-4" />
          Master Only
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{totalHiddenMargin.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Hidden Margin</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{totalCommission.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Commission</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24.5%</p>
              <p className="text-xs text-gray-500">Avg Margin Rate</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{records.length}</p>
              <p className="text-xs text-gray-500">Active Streams</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Real vs Shown Cost Chart */}
        <div className="col-span-8">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[350px]">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Real Cost vs Shown Cost (Monthly)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={marginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="shown" fill="#4ade80" name="Shown Cost" radius={[4, 4, 0, 0]} />
                <Bar dataKey="real" fill="#22d3ee" name="Real Cost" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margin" fill="#a855f7" name="Margin" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Benefit Distribution */}
        <div className="col-span-4">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[350px]">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              Who Benefits Graph
            </h3>
            <div className="space-y-4">
              {benefitData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{item.name}</span>
                    <span className="text-sm text-white font-mono">₹{item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-cyan-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-amber-500'
                      }`}
                      style={{ width: `${(item.value / 45000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Records */}
      <Card className="p-4 bg-[#0a0a12] border-gray-800/50">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          Hidden Margin & Commission Monitor
        </h3>
        <ScrollArea className="h-[250px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0a0a12]">
              <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                <th className="pb-3">Role</th>
                <th className="pb-3">Shown Cost</th>
                <th className="pb-3">Real Cost</th>
                <th className="pb-3">Hidden Margin</th>
                <th className="pb-3">Commission</th>
                <th className="pb-3">Beneficiary</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-800/50">
                  <td className="py-3">
                    <Badge variant="outline" className="bg-gray-500/15 text-gray-400 text-xs">
                      {record.role}
                    </Badge>
                  </td>
                  <td className="py-3 text-sm text-gray-300">₹{record.shown_cost.toLocaleString()}</td>
                  <td className="py-3 text-sm text-green-400">₹{record.real_cost.toLocaleString()}</td>
                  <td className="py-3 text-sm text-purple-400 font-medium">+₹{record.margin.toLocaleString()}</td>
                  <td className="py-3 text-sm text-cyan-400">₹{record.commission.toLocaleString()}</td>
                  <td className="py-3 text-sm text-amber-400">{record.beneficiary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
        <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400">
              This data is strictly confidential and visible only to Master Admin.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialTruthView;
