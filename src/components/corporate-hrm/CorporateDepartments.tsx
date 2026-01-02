import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Plus, Users, UserCog, ChevronRight, Edit2, Trash2,
  GitBranch, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Department {
  id: string;
  name: string;
  code: string;
  headCount: number;
  manager: string;
  budget: string;
  status: 'active' | 'inactive';
}

interface Role {
  id: string;
  title: string;
  department: string;
  level: string;
  reportsTo: string;
  headCount: number;
  permissions: string[];
}

const departments: Department[] = [
  { id: '1', name: 'Engineering', code: 'ENG', headCount: 320, manager: 'Rajesh Kumar', budget: '₹4.5Cr', status: 'active' },
  { id: '2', name: 'Sales', code: 'SAL', headCount: 180, manager: 'Priya Sharma', budget: '₹2.8Cr', status: 'active' },
  { id: '3', name: 'Marketing', code: 'MKT', headCount: 120, manager: 'Amit Verma', budget: '₹1.5Cr', status: 'active' },
  { id: '4', name: 'Human Resources', code: 'HR', headCount: 45, manager: 'Neha Singh', budget: '₹0.8Cr', status: 'active' },
  { id: '5', name: 'Finance', code: 'FIN', headCount: 85, manager: 'Vikram Patel', budget: '₹1.2Cr', status: 'active' },
  { id: '6', name: 'Operations', code: 'OPS', headCount: 210, manager: 'Sunita Rao', budget: '₹3.2Cr', status: 'active' },
];

const roles: Role[] = [
  { id: '1', title: 'Chief Technology Officer', department: 'Engineering', level: 'C-Level', reportsTo: 'CEO', headCount: 1, permissions: ['full_access'] },
  { id: '2', title: 'Engineering Manager', department: 'Engineering', level: 'Manager', reportsTo: 'CTO', headCount: 8, permissions: ['team_manage', 'hire'] },
  { id: '3', title: 'Senior Developer', department: 'Engineering', level: 'Senior', reportsTo: 'Engineering Manager', headCount: 45, permissions: ['code_review'] },
  { id: '4', title: 'Software Developer', department: 'Engineering', level: 'Mid', reportsTo: 'Senior Developer', headCount: 120, permissions: ['basic'] },
  { id: '5', title: 'Sales Director', department: 'Sales', level: 'Director', reportsTo: 'CEO', headCount: 1, permissions: ['sales_manage'] },
  { id: '6', title: 'Sales Manager', department: 'Sales', level: 'Manager', reportsTo: 'Sales Director', headCount: 5, permissions: ['team_manage'] },
  { id: '7', title: 'HR Director', department: 'Human Resources', level: 'Director', reportsTo: 'CEO', headCount: 1, permissions: ['hr_full'] },
];

const levelColors: Record<string, string> = {
  'C-Level': 'bg-violet-100 text-violet-700',
  'Director': 'bg-blue-100 text-blue-700',
  'Manager': 'bg-emerald-100 text-emerald-700',
  'Senior': 'bg-amber-100 text-amber-700',
  'Mid': 'bg-slate-100 text-slate-700',
  'Junior': 'bg-gray-100 text-gray-700',
};

export default function CorporateDepartments() {
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="departments" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="departments" className="gap-2">
              <Building2 className="w-4 h-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <UserCog className="w-4 h-4" />
              Roles & Hierarchy
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
                  <Plus className="w-4 h-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Department Name</Label>
                    <Input placeholder="e.g., Research & Development" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department Code</Label>
                    <Input placeholder="e.g., R&D" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department Head</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Rajesh Kumar</SelectItem>
                        <SelectItem value="2">Priya Sharma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Budget</Label>
                    <Input placeholder="e.g., ₹1,00,00,000" />
                  </div>
                  <Button className="w-full">Create Department</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Role Title</Label>
                    <Input placeholder="e.g., Product Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c-level">C-Level</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reports To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reporting role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>{role.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Create Role</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Code</TableHead>
                    <TableHead className="font-semibold">Head Count</TableHead>
                    <TableHead className="font-semibold">Manager</TableHead>
                    <TableHead className="font-semibold">Budget</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept, index) => (
                    <motion.tr
                      key={dept.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-slate-900">{dept.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dept.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{dept.headCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{dept.manager}</TableCell>
                      <TableCell className="font-medium text-slate-900">{dept.budget}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Role Title</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Level</TableHead>
                    <TableHead className="font-semibold">Reports To</TableHead>
                    <TableHead className="font-semibold">Head Count</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role, index) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <UserCog className="w-5 h-5 text-slate-600" />
                          </div>
                          <span className="font-medium text-slate-900">{role.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{role.department}</TableCell>
                      <TableCell>
                        <Badge className={levelColors[role.level]}>{role.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600">
                          <GitBranch className="w-4 h-4" />
                          {role.reportsTo}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{role.headCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
