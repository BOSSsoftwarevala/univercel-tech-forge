import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Filter, Eye, UserX, Lock, Unlock, MoreVertical,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";
import UserDetailPanel from "@/components/super-admin-wireframe/UserDetailPanel";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "locked";
  region: string;
  lastLogin: string;
  riskScore: number;
}

const mockUsers: User[] = [
  { id: "USR-001", name: "John Smith", email: "john@example.com", status: "active", region: "Africa/Nigeria", lastLogin: "2 hours ago", riskScore: 12 },
  { id: "USR-002", name: "Jane Doe", email: "jane@example.com", status: "active", region: "Europe/UK", lastLogin: "1 day ago", riskScore: 5 },
  { id: "USR-003", name: "Bob Wilson", email: "bob@example.com", status: "suspended", region: "Asia/India", lastLogin: "5 days ago", riskScore: 78 },
  { id: "USR-004", name: "Alice Brown", email: "alice@example.com", status: "locked", region: "Americas/USA", lastLogin: "1 hour ago", riskScore: 45 },
  { id: "USR-005", name: "Charlie Davis", email: "charlie@example.com", status: "active", region: "Africa/Kenya", lastLogin: "30 min ago", riskScore: 8 },
  { id: "USR-006", name: "Diana Evans", email: "diana@example.com", status: "active", region: "Europe/Germany", lastLogin: "3 hours ago", riskScore: 15 },
  { id: "USR-007", name: "Edward Foster", email: "edward@example.com", status: "suspended", region: "Asia/Japan", lastLogin: "2 weeks ago", riskScore: 92 },
  { id: "USR-008", name: "Fiona Green", email: "fiona@example.com", status: "active", region: "Oceania/Australia", lastLogin: "45 min ago", riskScore: 3 },
];

const SuperAdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const statusColors = {
    active: "bg-neon-green/20 text-neon-green border-neon-green/50",
    suspended: "bg-neon-orange/20 text-neon-orange border-neon-orange/50",
    locked: "bg-destructive/20 text-destructive border-destructive/50",
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-neon-green";
    if (score < 60) return "text-neon-orange";
    return "text-destructive";
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRegion = regionFilter === "all" || user.region.includes(regionFilter);
    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <SuperAdminWireframeLayout
      activeSection="users"
      rightPanelOpen={!!selectedUser}
      rightPanelContent={selectedUser ? <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} /> : null}
      onRightPanelClose={() => setSelectedUser(null)}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View and manage all users in your scope</p>
        </div>

        {/* Filters */}
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Africa">Africa</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="Americas">Americas</SelectItem>
                  <SelectItem value="Oceania">Oceania</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer hover:bg-secondary/30"
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell className="font-mono text-sm">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]} variant="outline">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.region}</TableCell>
                    <TableCell>
                      <span className={`font-mono font-bold ${getRiskColor(user.riskScore)}`}>
                        {user.riskScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}>
                            <Eye className="w-4 h-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <UserX className="w-4 h-4 mr-2" /> Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Lock className="w-4 h-4 mr-2" /> Lock
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Unlock className="w-4 h-4 mr-2" /> Unlock
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing 1-{filteredUsers.length} of {filteredUsers.length} users
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled={currentPage === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-3">Page {currentPage}</span>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminUsers;
