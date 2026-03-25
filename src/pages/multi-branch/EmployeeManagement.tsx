import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Building2,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const employees = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@company.com",
    phone: "+91 98765 43210",
    role: "Branch Admin",
    branch: "Mumbai - HQ",
    status: "active",
    joinDate: "2022-03-15",
    permissions: ["full_access"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    phone: "+91 98765 43211",
    role: "Branch Admin",
    branch: "Delhi Branch",
    status: "active",
    joinDate: "2022-05-20",
    permissions: ["full_access"],
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@company.com",
    phone: "+91 98765 43212",
    role: "Manager",
    branch: "Bangalore Branch",
    status: "active",
    joinDate: "2022-08-10",
    permissions: ["billing", "inventory"],
  },
  {
    id: 4,
    name: "Sunita Reddy",
    email: "sunita.reddy@company.com",
    phone: "+91 98765 43213",
    role: "Cashier",
    branch: "Chennai Branch",
    status: "active",
    joinDate: "2023-01-05",
    permissions: ["billing"],
  },
  {
    id: 5,
    name: "Debashish Roy",
    email: "debashish.roy@company.com",
    phone: "+91 98765 43214",
    role: "Inventory Manager",
    branch: "Kolkata Branch",
    status: "inactive",
    joinDate: "2023-03-22",
    permissions: ["inventory"],
  },
  {
    id: 6,
    name: "Neha Gupta",
    email: "neha.gupta@company.com",
    phone: "+91 98765 43215",
    role: "Accountant",
    branch: "Mumbai - HQ",
    status: "active",
    joinDate: "2022-11-18",
    permissions: ["billing", "reports"],
  },
];

const roles = [
  {
    name: "Super Admin",
    description: "Full system access across all branches",
    permissions: ["All Permissions"],
    count: 2,
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Branch Admin",
    description: "Full access to assigned branch",
    permissions: ["Branch Management", "Employees", "Billing", "Inventory", "Reports"],
    count: 5,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Manager",
    description: "Manage daily operations",
    permissions: ["Billing", "Inventory", "Reports"],
    count: 8,
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Cashier",
    description: "Handle billing and payments",
    permissions: ["Billing", "View Reports"],
    count: 12,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Inventory Manager",
    description: "Manage stock and inventory",
    permissions: ["Inventory", "Stock Alerts"],
    count: 6,
    color: "bg-amber-100 text-amber-700",
  },
];

export default function EmployeeManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === "all" || emp.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
          <p className="text-slate-500 mt-1">Manage employees and their access levels</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fname">First Name</Label>
                  <Input id="fname" placeholder="First name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input id="lname" placeholder="Last name" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="employee@company.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+91..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="admin">Branch Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="cashier">Cashier</SelectItem>
                      <SelectItem value="inventory">Inventory Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="mumbai">Mumbai - HQ</SelectItem>
                      <SelectItem value="delhi">Delhi Branch</SelectItem>
                      <SelectItem value="bangalore">Bangalore Branch</SelectItem>
                      <SelectItem value="chennai">Chennai Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Add Employee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="employees">All Employees</TabsTrigger>
          <TabsTrigger value="roles">Roles & Access</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50"
                  />
                </div>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="Mumbai - HQ">Mumbai - HQ</SelectItem>
                    <SelectItem value="Delhi Branch">Delhi Branch</SelectItem>
                    <SelectItem value="Bangalore Branch">Bangalore Branch</SelectItem>
                    <SelectItem value="Chennai Branch">Chennai Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employee Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Employee
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Contact
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Role
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Branch
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Status
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                {emp.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{emp.name}</p>
                              <p className="text-sm text-slate-500">
                                Joined {new Date(emp.joinDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              {emp.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              {emp.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium">{emp.role}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{emp.branch}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              emp.status === "active"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                            }
                          >
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white z-50" align="end">
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Edit className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer text-red-600">
                                <Trash2 className="h-4 w-4" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.name} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge className={role.color}>{role.name}</Badge>
                      <p className="text-sm text-slate-500 mt-2">{role.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{role.count}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-2">
                      Permissions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
