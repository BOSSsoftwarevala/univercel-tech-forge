/**
 * FRANCHISE OWNER EMPLOYEES SCREEN
 * Team management with role assignment
 * ALL ACTIONS LOGGED TO BOSS PANEL
 */

import React, { useState } from 'react';
import { 
  Users, Search, Plus, Eye, UserCheck, UserX, Activity,
  Target, TrendingUp, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useFranchiseActionLogger } from '@/hooks/useFranchiseActionLogger';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  leadsAssigned: number;
  performance: number;
  lastLogin?: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'raj***@franchise.com', role: 'Sales Executive', status: 'active', leadsAssigned: 15, performance: 85, lastLogin: '2 mins ago' },
  { id: '2', name: 'Priya Sharma', email: 'pri***@franchise.com', role: 'Lead Manager', status: 'active', leadsAssigned: 22, performance: 92, lastLogin: '10 mins ago' },
  { id: '3', name: 'Amit Patel', email: 'ami***@franchise.com', role: 'Sales Executive', status: 'active', leadsAssigned: 12, performance: 78, lastLogin: '1 hour ago' },
  { id: '4', name: 'Sneha Gupta', email: 'sne***@franchise.com', role: 'Support Staff', status: 'inactive', leadsAssigned: 0, performance: 65, lastLogin: '2 days ago' },
];

const ROLES = ['Sales Executive', 'Lead Manager', 'Support Staff', 'Marketing Staff'];

export function FOEmployeesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: '' });
  const { logAddEmployee } = useFranchiseActionLogger();

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) {
      toast.error('Please fill all fields');
      return;
    }
    
    // Log action - THIS WILL APPEAR ON BOSS PANEL
    await logAddEmployee(newEmployee.name, newEmployee.role);
    
    toast.success(`Employee ${newEmployee.name} added successfully`);
    setShowAddDialog(false);
    setNewEmployee({ name: '', email: '', role: '' });
  };

  const filteredEmployees = MOCK_EMPLOYEES.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Employees
          </h1>
          <p className="text-muted-foreground text-sm">Manage your team members</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  placeholder="Enter employee name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  placeholder="employee@franchise.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Role (Fixed)</Label>
                <Select value={newEmployee.role} onValueChange={(v) => setNewEmployee(prev => ({ ...prev, role: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAddEmployee}>Add Employee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500">
                <UserX className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">49</p>
                <p className="text-xs text-muted-foreground">Leads Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">80%</p>
                <p className="text-xs text-muted-foreground">Avg Performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search employees..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Employees List */}
      <div className="space-y-3">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{employee.name}</span>
                    <Badge className={employee.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'}>
                      {employee.status}
                    </Badge>
                    <Badge variant="outline">{employee.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Target className="h-3 w-3" />{employee.leadsAssigned} leads</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{employee.lastLogin}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Performance</span>
                      <span className="font-semibold">{employee.performance}%</span>
                    </div>
                    <Progress value={employee.performance} className="h-2" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
