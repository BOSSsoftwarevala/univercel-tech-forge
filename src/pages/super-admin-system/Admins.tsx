import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Plus, Eye, Edit, UserX, Lock, MoreVertical,
  UserCog, Globe, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

interface Admin {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "locked";
  scope: string;
  scopeType: "continent" | "country" | "region";
  createdAt: string;
  createdBy: string;
}

const mockAdmins: Admin[] = [
  { id: "ADM-001", name: "Sarah Johnson", email: "sarah@admin.com", status: "active", scope: "Africa", scopeType: "continent", createdAt: "2024-01-10", createdBy: "SA-001" },
  { id: "ADM-002", name: "Michael Chen", email: "michael@admin.com", status: "active", scope: "Europe/UK", scopeType: "country", createdAt: "2024-02-15", createdBy: "SA-001" },
  { id: "ADM-003", name: "Emily Davis", email: "emily@admin.com", status: "suspended", scope: "Asia/India", scopeType: "country", createdAt: "2024-01-20", createdBy: "SA-002" },
  { id: "ADM-004", name: "James Wilson", email: "james@admin.com", status: "active", scope: "Americas", scopeType: "continent", createdAt: "2024-03-01", createdBy: "SA-001" },
  { id: "ADM-005", name: "Lisa Brown", email: "lisa@admin.com", status: "locked", scope: "Africa/Nigeria", scopeType: "country", createdAt: "2024-02-28", createdBy: "SA-003" },
];

const SuperAdminAdmins = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const statusColors = {
    active: "bg-neon-green/20 text-neon-green border-neon-green/50",
    suspended: "bg-neon-orange/20 text-neon-orange border-neon-orange/50",
    locked: "bg-destructive/20 text-destructive border-destructive/50",
  };

  const scopeTypeIcons = {
    continent: Globe,
    country: Globe,
    region: Globe,
  };

  const filteredAdmins = mockAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SuperAdminWireframeLayout activeSection="admins">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Management</h1>
            <p className="text-muted-foreground">Create and manage administrators</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="Enter admin name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scope Type</label>
                  <Input placeholder="Select scope type" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned Scope</label>
                  <Input placeholder="Select scope" />
                </div>
                <Button className="w-full" onClick={() => setCreateDialogOpen(false)}>
                  Create Admin
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Admins Table */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />
              Administrators ({filteredAdmins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin, index) => {
                  const ScopeIcon = scopeTypeIcons[admin.scopeType];
                  return (
                    <motion.tr
                      key={admin.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary/30"
                    >
                      <TableCell className="font-mono text-sm">{admin.id}</TableCell>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[admin.status]} variant="outline">
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ScopeIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{admin.scope}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{admin.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" /> Edit Scope
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX className="w-4 h-4 mr-2" /> Suspend
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Lock className="w-4 h-4 mr-2" /> Lock
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminAdmins;
