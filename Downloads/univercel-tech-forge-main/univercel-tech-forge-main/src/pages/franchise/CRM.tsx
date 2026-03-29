import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, UserPlus, Phone, Mail, Calendar, Building2,
  Filter, Download, MoreVertical, Eye, Edit, Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CRM = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const customers = [
    { 
      id: 1, name: 'TechCorp Solutions', contact: 'Rajesh Gupta', 
      email: 'rajesh@techcorp.com', phone: '+91 98765 12345',
      status: 'active', value: '₹5,00,000', lastContact: '2 days ago'
    },
    { 
      id: 2, name: 'Digital Innovations', contact: 'Meera Shah', 
      email: 'meera@digitalinno.com', phone: '+91 98765 12346',
      status: 'negotiation', value: '₹3,50,000', lastContact: '1 week ago'
    },
    { 
      id: 3, name: 'StartUp Hub', contact: 'Vikram Singh', 
      email: 'vikram@startuphub.io', phone: '+91 98765 12347',
      status: 'prospect', value: '₹2,00,000', lastContact: '3 days ago'
    },
    { 
      id: 4, name: 'E-Commerce Plus', contact: 'Anita Desai', 
      email: 'anita@ecomplus.com', phone: '+91 98765 12348',
      status: 'active', value: '₹8,00,000', lastContact: 'Today'
    },
  ];

  const deals = [
    { name: 'Enterprise ERP System', company: 'TechCorp Solutions', value: '₹15,00,000', stage: 'proposal', probability: 75 },
    { name: 'Mobile App Development', company: 'StartUp Hub', value: '₹4,50,000', stage: 'discovery', probability: 40 },
    { name: 'Cloud Migration', company: 'E-Commerce Plus', value: '₹6,00,000', stage: 'negotiation', probability: 85 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'negotiation': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'prospect': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM</h1>
          <p className="text-slate-400 mt-1">Customer Relationship Management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-indigo-500/30 text-indigo-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Customers</p>
                <p className="text-xl font-bold text-white">248</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Accounts</p>
                <p className="text-xl font-bold text-white">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Meetings Today</p>
                <p className="text-xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Follow-ups Due</p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-indigo-500/20">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="deals">Deals Pipeline</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Customer Directory</CardTitle>
                  <CardDescription>Manage your customer relationships</CardDescription>
                </div>
                <div className="flex gap-3">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-slate-900/50 border-indigo-500/30">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-indigo-500/30">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="Search customers..." 
                    className="w-64 bg-slate-900/50 border-indigo-500/30"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div 
                    key={customer.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{customer.name}</p>
                        <p className="text-slate-400 text-sm">{customer.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden md:block">
                        <p className="text-slate-400 text-sm">{customer.email}</p>
                      </div>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-white font-bold">{customer.value}</p>
                        <p className="text-slate-400 text-xs">{customer.lastContact}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-indigo-500/30">
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            <Phone className="w-4 h-4 mr-2" /> Call
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Deals Pipeline</CardTitle>
              <CardDescription>Track your sales opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deals.map((deal, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-lg bg-slate-900/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white font-medium">{deal.name}</p>
                        <p className="text-slate-400 text-sm">{deal.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{deal.value}</p>
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                          {deal.stage}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Win Probability</span>
                        <span className="text-indigo-400">{deal.probability}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Activities</CardTitle>
              <CardDescription>Your customer interaction history</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <p className="text-slate-400">Activity timeline coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
