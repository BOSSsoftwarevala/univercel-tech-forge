// ============================================
// PEOPLE — META BUSINESS MANAGER STYLE
// Manage admins, managers, and team members
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Shield, Clock, CheckCircle2, 
  Search, MoreHorizontal, ChevronDown, Filter,
  Mail, Globe2, Building2, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  region: string;
  status: 'active' | 'pending' | 'suspended';
  lastActive: string;
  avatar: string;
}

const mockPeople: TeamMember[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'r****@softwarewala.net', role: 'Country Admin', region: 'India', status: 'active', lastActive: '2m ago', avatar: 'RK' },
  { id: '2', name: 'Amina Okafor', email: 'a****@softwarewala.net', role: 'Country Admin', region: 'Nigeria', status: 'active', lastActive: '15m ago', avatar: 'AO' },
  { id: '3', name: 'Hans Weber', email: 'h****@softwarewala.net', role: 'Area Manager', region: 'Germany', status: 'active', lastActive: '1h ago', avatar: 'HW' },
  { id: '4', name: 'Maria Santos', email: 'm****@softwarewala.net', role: 'Country Admin', region: 'Brazil', status: 'pending', lastActive: 'Never', avatar: 'MS' },
  { id: '5', name: 'James Cook', email: 'j****@softwarewala.net', role: 'Area Manager', region: 'Australia', status: 'active', lastActive: '3h ago', avatar: 'JC' },
  { id: '6', name: 'Li Wei', email: 'l****@softwarewala.net', role: 'Country Admin', region: 'China', status: 'suspended', lastActive: '7d ago', avatar: 'LW' },
];

const PeopleView = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockPeople.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    active: { color: '#42b72a', bg: '#42b72a15', label: 'Active' },
    pending: { color: '#f5a623', bg: '#f5a62315', label: 'Pending' },
    suspended: { color: '#e41e3f', bg: '#e41e3f15', label: 'Suspended' },
  };

  const stats = [
    { label: 'Total People', value: mockPeople.length },
    { label: 'Active', value: mockPeople.filter(p => p.status === 'active').length },
    { label: 'Pending', value: mockPeople.filter(p => p.status === 'pending').length },
    { label: 'Suspended', value: mockPeople.filter(p => p.status === 'suspended').length },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1c1e21]">People</h1>
          <p className="text-[14px] text-[#65676b] mt-0.5">Manage team members across all business accounts</p>
        </div>
        <Button 
          onClick={() => toast.info('Invite flow — coming soon')}
          className="bg-[#1877F2] hover:bg-[#166fe5] text-white text-[13px] font-medium h-9 px-4 rounded-md"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add People
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-5 py-4 bg-white rounded-lg border border-[#dddfe2]">
        {stats.map((stat, i) => (
          <div key={i} className={`flex items-center gap-2 ${i > 0 ? 'pl-6 border-l border-[#e4e6eb]' : ''}`}>
            <span className="text-[22px] font-bold text-[#1c1e21]">{stat.value}</span>
            <span className="text-[13px] text-[#65676b]">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-[#dddfe2] rounded-lg overflow-hidden">
          {(['all', 'active', 'pending', 'suspended'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-[13px] capitalize transition-colors ${
                filter === tab 
                  ? 'bg-[#e7f3ff] text-[#1877F2] font-medium' 
                  : 'text-[#65676b] hover:bg-[#f0f2f5]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#dddfe2] rounded-lg min-w-[240px]">
          <Search className="w-4 h-4 text-[#65676b]" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[13px] text-[#1c1e21] placeholder:text-[#bec3c9] outline-none"
          />
        </div>
      </div>

      {/* People Table */}
      <div className="bg-white rounded-lg border border-[#dddfe2] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e6eb] text-[12px] text-[#65676b] font-semibold uppercase tracking-wider">
          <div className="col-span-4">Person</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Region</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Last Active</div>
        </div>

        {filtered.map((person, i) => {
          const config = statusConfig[person.status];
          return (
            <motion.div
              key={person.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[#f7f8fa] transition-colors cursor-pointer ${
                i < filtered.length - 1 ? 'border-b border-[#f0f2f5]' : ''
              }`}
            >
              {/* Person */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e4e6eb] flex items-center justify-center text-[12px] font-bold text-[#65676b]">
                  {person.avatar}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#1c1e21]">{person.name}</p>
                  <p className="text-[12px] text-[#65676b]">{person.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="col-span-2">
                <span className="text-[13px] text-[#1c1e21]">{person.role}</span>
              </div>

              {/* Region */}
              <div className="col-span-2">
                <span className="text-[13px] text-[#65676b]">{person.region}</span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span 
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                  {config.label}
                </span>
              </div>

              {/* Last Active */}
              <div className="col-span-2 text-right flex items-center justify-end gap-2">
                <span className="text-[12px] text-[#65676b]">{person.lastActive}</span>
                <button className="p-1 rounded hover:bg-[#e4e6eb] transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-[#65676b]" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Users className="w-10 h-10 text-[#bec3c9] mx-auto mb-3" />
            <p className="text-[14px] text-[#65676b]">No people found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleView;
