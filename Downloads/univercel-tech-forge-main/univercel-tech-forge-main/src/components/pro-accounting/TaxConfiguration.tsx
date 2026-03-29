import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Save,
  MapPin,
  Percent,
  Info,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const taxSlabs = [
  { id: 1, rate: 0, description: 'Nil Rated / Exempt', hsnRange: 'Various', examples: 'Fresh produce, Books' },
  { id: 2, rate: 5, description: 'Essential Goods', hsnRange: '0101-2309', examples: 'Sugar, Tea, Edible Oil' },
  { id: 3, rate: 12, description: 'Standard Goods I', hsnRange: '2310-5999', examples: 'Processed Food, Apparel' },
  { id: 4, rate: 18, description: 'Standard Goods II', hsnRange: '6000-8999', examples: 'IT Services, Electronics' },
  { id: 5, rate: 28, description: 'Luxury / Sin Goods', hsnRange: '9000+', examples: 'Automobiles, Aerated drinks' },
];

const stateRules = [
  { id: 1, state: 'Karnataka', code: '29', igst: true, utgst: false, cess: false, notes: 'E-invoicing mandatory above ₹5Cr' },
  { id: 2, state: 'Maharashtra', code: '27', igst: true, utgst: false, cess: false, notes: 'Quarterly filing for small taxpayers' },
  { id: 3, state: 'Tamil Nadu', code: '33', igst: true, utgst: false, cess: true, notes: 'Additional cess on luxury cars' },
  { id: 4, state: 'Delhi', code: '07', igst: true, utgst: true, cess: false, notes: 'UTGST applicable' },
  { id: 5, state: 'Gujarat', code: '24', igst: true, utgst: false, cess: false, notes: 'SEZ exemptions available' },
];

const TaxConfiguration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('slabs');
  const [isAddSlabOpen, setIsAddSlabOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">GST / Tax Configuration</h2>
          <p className="text-slate-500">Configure tax slabs, rates, and state-wise rules</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Save className="w-4 h-4" />
          Save Configuration
        </Button>
      </div>

      {/* Alert */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Tax Rate Updates</p>
            <p className="text-sm text-amber-700 mt-1">
              GST Council has announced rate changes effective from January 1, 2025. Review and update your configuration accordingly.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="slabs" className="gap-2">
            <Percent className="w-4 h-4" />
            Tax Slabs
          </TabsTrigger>
          <TabsTrigger value="states" className="gap-2">
            <MapPin className="w-4 h-4" />
            State-wise Rules
          </TabsTrigger>
          <TabsTrigger value="cess" className="gap-2">
            <Info className="w-4 h-4" />
            Cess & Surcharge
          </TabsTrigger>
        </TabsList>

        {/* Tax Slabs */}
        <TabsContent value="slabs" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">GST Tax Slabs</CardTitle>
                <CardDescription>Configure applicable GST rates for your business</CardDescription>
              </div>
              <Dialog open={isAddSlabOpen} onOpenChange={setIsAddSlabOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Custom Slab
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Tax Slab</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tax Rate (%)</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>HSN Range</Label>
                        <Input placeholder="e.g., 8471-8479" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="Tax slab description" />
                    </div>
                    <div className="space-y-2">
                      <Label>Examples</Label>
                      <Input placeholder="Example items" />
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Add Tax Slab
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[100px]">Rate</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>HSN Range</TableHead>
                    <TableHead>Examples</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxSlabs.map((slab) => (
                    <TableRow key={slab.id}>
                      <TableCell>
                        <Badge className={`font-bold ${
                          slab.rate === 0 ? 'bg-slate-100 text-slate-700' :
                          slab.rate === 5 ? 'bg-emerald-100 text-emerald-700' :
                          slab.rate === 12 ? 'bg-blue-100 text-blue-700' :
                          slab.rate === 18 ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {slab.rate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{slab.description}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">{slab.hsnRange}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{slab.examples}</TableCell>
                      <TableCell className="text-center">
                        <Switch defaultChecked />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="w-4 h-4 text-slate-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* State-wise Rules */}
        <TabsContent value="states" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">State-wise Tax Rules</CardTitle>
                  <CardDescription>Configure GST rules for different states</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search states..." className="pl-9 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>State</TableHead>
                    <TableHead className="text-center">Code</TableHead>
                    <TableHead className="text-center">IGST</TableHead>
                    <TableHead className="text-center">UTGST</TableHead>
                    <TableHead className="text-center">Cess</TableHead>
                    <TableHead>Special Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stateRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium text-slate-900">{rule.state}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">{rule.code}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                          rule.igst ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {rule.igst ? '✓' : '–'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                          rule.utgst ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {rule.utgst ? '✓' : '–'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                          rule.cess ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {rule.cess ? '✓' : '–'}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm max-w-[200px] truncate">
                        {rule.notes}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600">
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cess & Surcharge */}
        <TabsContent value="cess" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Compensation Cess</CardTitle>
                <CardDescription>Configure cess rates for specific goods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Automobiles</p>
                      <p className="text-sm text-slate-500">HSN 8703</p>
                    </div>
                    <Input type="number" className="w-24 text-right" defaultValue="15" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Aerated Beverages</p>
                      <p className="text-sm text-slate-500">HSN 2202</p>
                    </div>
                    <Input type="number" className="w-24 text-right" defaultValue="12" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Tobacco Products</p>
                      <p className="text-sm text-slate-500">HSN 2401-2403</p>
                    </div>
                    <Input type="number" className="w-24 text-right" defaultValue="290" />
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Add Cess Item
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">TDS/TCS Settings</CardTitle>
                <CardDescription>Configure TDS/TCS applicability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">TDS under GST</p>
                    <p className="text-sm text-slate-500">1% deduction on supplies above ₹2.5 Lakhs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">TCS on E-commerce</p>
                    <p className="text-sm text-slate-500">1% collection on net value of supplies</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Auto TDS Calculation</p>
                    <p className="text-sm text-slate-500">Automatically calculate TDS on invoices</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxConfiguration;
