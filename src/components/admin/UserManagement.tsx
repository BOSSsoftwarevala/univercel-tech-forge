import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal,
  Shield,
  Mail,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Lock,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  joinedDate: string;
  tasks: number;
}

const users: User[] = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh@softwarevala.com", role: "Super Admin", status: "active", lastActive: "2 min ago", joinedDate: "Jan 2024", tasks: 0 },
  { id: "2", name: "Priya Sharma", email: "priya@softwarevala.com", role: "Finance Manager", status: "active", lastActive: "5 min ago", joinedDate: "Feb 2024", tasks: 12 },
  { id: "3", name: "Amit Patel", email: "amit@softwarevala.com", role: "Developer", status: "active", lastActive: "1 hour ago", joinedDate: "Mar 2024", tasks: 8 },
  { id: "4", name: "Sneha Reddy", email: "sneha@softwarevala.com", role: "Support Agent", status: "active", lastActive: "30 min ago", joinedDate: "Mar 2024", tasks: 23 },
  { id: "5", name: "Vikram Singh", email: "vikram@softwarevala.com", role: "Sales Manager", status: "active", lastActive: "15 min ago", joinedDate: "Apr 2024", tasks: 15 },
  { id: "6", name: "Ananya Gupta", email: "ananya@softwarevala.com", role: "SEO Specialist", status: "pending", lastActive: "Never", joinedDate: "Dec 2024", tasks: 0 },
  { id: "7", name: "Rahul Mehta", email: "rahul@softwarevala.com", role: "Franchise Owner", status: "active", lastActive: "3 hours ago", joinedDate: "Jan 2024", tasks: 7 },
  { id: "8", name: "Kavitha Nair", email: "kavitha@softwarevala.com", role: "Reseller", status: "inactive", lastActive: "2 days ago", joinedDate: "Feb 2024", tasks: 4 },
  { id: "9", name: "Deepak Joshi", email: "deepak@softwarevala.com", role: "Developer", status: "active", lastActive: "45 min ago", joinedDate: "May 2024", tasks: 19 },
  { id: "10", name: "Maya Pillai", email: "maya@softwarevala.com", role: "Influencer", status: "active", lastActive: "20 min ago", joinedDate: "Jun 2024", tasks: 11 },
];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-muted text-muted-foreground border-border">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-neon-orange/20 text-neon-orange border-neon-orange/50">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      "Super Admin": "text-primary",
      "Finance Manager": "text-neon-teal",
      "Developer": "text-neon-purple",
      "Support Agent": "text-neon-red",
      "Sales Manager": "text-neon-orange",
      "SEO Specialist": "text-neon-blue",
      "Franchise Owner": "text-neon-cyan",
      "Reseller": "text-neon-green",
      "Influencer": "text-neon-purple",
    };
    return colors[role] || "text-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all system users and their access</p>
        </div>
        <Button className="command-button-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "248", icon: Users, color: "text-primary" },
          { label: "Active Now", value: "89", icon: Activity, color: "text-neon-green" },
          { label: "Pending Approval", value: "12", icon: Clock, color: "text-neon-orange" },
          { label: "Inactive", value: "23", icon: XCircle, color: "text-muted-foreground" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48 bg-secondary/50 border-border/50">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Super Admin">Super Admin</SelectItem>
            <SelectItem value="Finance Manager">Finance Manager</SelectItem>
            <SelectItem value="Developer">Developer</SelectItem>
            <SelectItem value="Support Agent">Support Agent</SelectItem>
            <SelectItem value="Sales Manager">Sales Manager</SelectItem>
            <SelectItem value="SEO Specialist">SEO Specialist</SelectItem>
            <SelectItem value="Franchise Owner">Franchise Owner</SelectItem>
            <SelectItem value="Reseller">Reseller</SelectItem>
            <SelectItem value="Influencer">Influencer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-secondary/50 border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="font-mono">User</TableHead>
              <TableHead className="font-mono">Role</TableHead>
              <TableHead className="font-mono">Status</TableHead>
              <TableHead className="font-mono">Last Active</TableHead>
              <TableHead className="font-mono">Joined</TableHead>
              <TableHead className="font-mono text-center">Tasks</TableHead>
              <TableHead className="font-mono text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-border/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/50 to-neon-purple/50 flex items-center justify-center">
                      <span className="text-sm font-mono font-bold text-foreground">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${getRoleColor(user.role)}`} />
                    <span className={`font-mono text-sm ${getRoleColor(user.role)}`}>{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    {user.lastActive}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {user.joinedDate}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-mono text-primary">{user.tasks}</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="w-4 h-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default UserManagement;
