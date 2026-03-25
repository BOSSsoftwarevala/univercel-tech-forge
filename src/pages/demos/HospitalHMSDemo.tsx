import React, { useState } from 'react';
import { 
  Stethoscope, Users, Calendar, FileText, Pill,
  UserPlus, Clock, Phone, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import softwareValaLogo from '@/assets/software-vala-logo.jpg';

// Sample data
const appointments = [
  { id: 1, patient: 'Rajesh Kumar', time: '10:00 AM', doctor: 'Dr. Sharma', status: 'waiting' },
  { id: 2, patient: 'Sunita Devi', time: '10:30 AM', doctor: 'Dr. Sharma', status: 'in-progress' },
  { id: 3, patient: 'Amit Patel', time: '11:00 AM', doctor: 'Dr. Sharma', status: 'scheduled' },
  { id: 4, patient: 'Priya Singh', time: '11:30 AM', doctor: 'Dr. Sharma', status: 'scheduled' },
];

const patients = [
  { id: 'P001', name: 'Rajesh Kumar', age: 45, phone: '98765-XXXXX', lastVisit: '2024-12-28' },
  { id: 'P002', name: 'Sunita Devi', age: 38, phone: '98765-XXXXX', lastVisit: '2024-12-30' },
  { id: 'P003', name: 'Amit Patel', age: 52, phone: '98765-XXXXX', lastVisit: '2025-01-01' },
];

const HospitalHMSDemo = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Today Appointments', value: '24', icon: Calendar, color: 'text-blue-500' },
    { label: 'Total Patients', value: '1,856', icon: Users, color: 'text-green-500' },
    { label: 'Doctors Available', value: '12', icon: Stethoscope, color: 'text-purple-500' },
    { label: 'Pharmacy Orders', value: '45', icon: Pill, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={softwareValaLogo} alt="Software Vala" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="font-bold text-lg">Hospital Management</h1>
              <p className="text-xs text-muted-foreground">Powered by Software Vala</p>
            </div>
          </div>
          <Button size="sm" className="gap-1">
            <UserPlus className="w-4 h-4" />
            New Patient
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="appointments" className="gap-1">
              <Calendar className="w-4 h-4" /> Appointments
            </TabsTrigger>
            <TabsTrigger value="patients" className="gap-1">
              <Users className="w-4 h-4" /> Patients
            </TabsTrigger>
            <TabsTrigger value="pharmacy" className="gap-1">
              <Pill className="w-4 h-4" /> Pharmacy
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1">
              <FileText className="w-4 h-4" /> Billing
            </TabsTrigger>
          </TabsList>

          {/* Appointments */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Today's Appointments - Dr. Sharma</CardTitle>
                  <Badge variant="outline">{appointments.length} patients</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map(apt => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <Clock className="w-4 h-4 text-muted-foreground mx-auto" />
                          <span className="text-xs font-medium">{apt.time}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{apt.patient}</p>
                          <p className="text-xs text-muted-foreground">{apt.doctor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          apt.status === 'in-progress' ? 'default' :
                          apt.status === 'waiting' ? 'secondary' : 'outline'
                        }>
                          {apt.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients */}
          <TabsContent value="patients">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-base">Patient Records</CardTitle>
                  <Input 
                    placeholder="Search patient..." 
                    className="max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {patient.id} • Age: {patient.age}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pharmacy */}
          <TabsContent value="pharmacy">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pharmacy Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Paracetamol 500mg', stock: 250, unit: 'strips' },
                    { name: 'Amoxicillin 250mg', stock: 85, unit: 'strips' },
                    { name: 'Cetirizine 10mg', stock: 120, unit: 'strips' },
                    { name: 'Omeprazole 20mg', stock: 45, unit: 'strips' },
                  ].map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Pill className="w-5 h-5 text-primary" />
                        <span className="font-medium text-sm">{med.name}</span>
                      </div>
                      <Badge variant={med.stock < 50 ? 'destructive' : 'secondary'}>
                        {med.stock} {med.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { patient: 'Rajesh Kumar', amount: 2500, status: 'paid' },
                    { patient: 'Sunita Devi', amount: 1800, status: 'pending' },
                    { patient: 'Amit Patel', amount: 3200, status: 'paid' },
                  ].map((bill, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{bill.patient}</p>
                        <p className="text-lg font-bold">₹{bill.amount.toLocaleString()}</p>
                      </div>
                      <Badge variant={bill.status === 'paid' ? 'default' : 'destructive'}>
                        {bill.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-medium">Software Vala</span> • The Name of Trust
        </p>
      </footer>
    </div>
  );
};

export default HospitalHMSDemo;
