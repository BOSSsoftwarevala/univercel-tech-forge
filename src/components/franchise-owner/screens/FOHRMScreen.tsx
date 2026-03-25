import React from 'react';
import { Users, Clock, ClipboardList, TrendingUp, UserPlus, UserMinus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const employees = [
  { id: 1, name: 'Rahul Sharma', role: 'Sales', status: 'Active', tasks: 5, performance: 92 },
  { id: 2, name: 'Priya Patel', role: 'Support', status: 'Active', tasks: 3, performance: 88 },
  { id: 3, name: 'Amit Kumar', role: 'Field Agent', status: 'Active', tasks: 8, performance: 95 },
  { id: 4, name: 'Sneha Gupta', role: 'Sales', status: 'On Leave', tasks: 0, performance: 85 },
];

export function FOHRMScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            HRM Management
          </h1>
          <p className="text-muted-foreground">Employees • Attendance • Tasks • Performance</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Staff</span>
            </div>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Present Today</span>
            </div>
            <p className="text-2xl font-bold">10</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Active Tasks</span>
            </div>
            <p className="text-2xl font-bold">24</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" />
              <span className="text-sm text-muted-foreground">Avg Performance</span>
            </div>
            <p className="text-2xl font-bold">89%</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">{emp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={emp.status === 'Active' ? 'default' : 'secondary'}>
                    {emp.status}
                  </Badge>
                  <span className="text-sm">{emp.tasks} tasks</span>
                  <span className="text-sm text-emerald-500">{emp.performance}%</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Assign Task
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
        <Button variant="outline">
          <UserMinus className="h-4 w-4 mr-2" />
          Suspend
        </Button>
      </div>
    </div>
  );
}
