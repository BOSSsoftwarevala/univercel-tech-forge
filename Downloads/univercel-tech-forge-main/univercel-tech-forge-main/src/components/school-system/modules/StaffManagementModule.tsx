/**
 * Staff Management Module
 * Manage teachers, admin staff, and support personnel
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, Plus, Search, Filter, Download, 
  Edit, Trash2, Eye, User, Users, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchoolData } from "@/hooks/useSchoolData";
import { toast } from "sonner";

const STAFF_TYPES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'principal', label: 'Principal' },
  { value: 'vice_principal', label: 'Vice Principal' },
  { value: 'admin_office', label: 'Admin Office' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'class_teacher', label: 'Class Teacher' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'transport_manager', label: 'Transport Manager' },
  { value: 'hostel_manager', label: 'Hostel Manager' },
  { value: 'exam_controller', label: 'Exam Controller' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'support_staff', label: 'Support Staff' },
];

export const StaffManagementModule = () => {
  const { staff, stats, loading } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.employee_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || member.staff_type === selectedType;
    return matchesSearch && matchesType && member.is_active;
  });

  const getStaffTypeLabel = (type: string) => {
    return STAFF_TYPES.find(t => t.value === type)?.label || type;
  };

  const getStaffTypeColor = (type: string) => {
    switch(type) {
      case 'principal':
      case 'vice_principal':
        return 'bg-purple-500/20 text-purple-400';
      case 'teacher':
      case 'class_teacher':
        return 'bg-green-500/20 text-green-400';
      case 'accountant':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-amber-500" />
            Staff Management
          </h2>
          <p className="text-slate-400">Manage teachers, administrators, and support staff</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Add staff form')}>
            <Plus className="w-4 h-4 mr-2" /> Add Staff
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by employee ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-56 bg-slate-700 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {STAFF_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: stats.totalStaff, icon: Users, color: "bg-blue-500" },
          { label: "Teaching", value: stats.teachingStaff, icon: GraduationCap, color: "bg-green-500" },
          { label: "Non-Teaching", value: stats.nonTeachingStaff, icon: Briefcase, color: "bg-purple-500" },
          { label: "Active Today", value: stats.totalStaff, icon: User, color: "bg-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Staff Directory ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No staff members found</p>
              <Button className="mt-4 bg-amber-500" onClick={() => toast.info('Add staff form')}>
                <Plus className="w-4 h-4 mr-2" /> Add Staff Member
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStaff.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-green-500 text-white">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">Staff-{member.employee_id}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{member.department || 'General'}</span>
                        <span>•</span>
                        <span>{member.designation || member.staff_type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStaffTypeColor(member.staff_type)}>
                      {getStaffTypeLabel(member.staff_type)}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
