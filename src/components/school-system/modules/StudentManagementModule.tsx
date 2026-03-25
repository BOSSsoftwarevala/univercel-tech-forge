/**
 * Student Management Module
 * CRUD operations for students with real data
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Plus, Search, Filter, Download, 
  Edit, Trash2, Eye, MoreVertical, User,
  GraduationCap, Phone, Mail, MapPin, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchoolData, useSchoolCRUD } from "@/hooks/useSchoolData";
import { toast } from "sonner";

export const StudentManagementModule = () => {
  const { students, classes, institution, refresh, loading } = useSchoolData();
  const { addStudent, updateStudent, deleteStudent, loading: crudLoading } = useSchoolCRUD();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    admission_number: '',
    roll_number: '',
    gender: 'male',
    current_class_id: ''
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.admission_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.roll_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || student.current_class_id === selectedClass;
    return matchesSearch && matchesClass && student.is_active;
  });

  const handleAddStudent = async () => {
    if (!institution?.id || !newStudent.admission_number) {
      toast.error('Please fill required fields');
      return;
    }

    const { error } = await addStudent({
      ...newStudent,
      institution_id: institution.id,
      is_active: true,
      status: 'active'
    });

    if (error) {
      toast.error('Failed to add student: ' + error.message);
    } else {
      toast.success('Student added successfully');
      setIsAddDialogOpen(false);
      setNewStudent({ admission_number: '', roll_number: '', gender: 'male', current_class_id: '' });
      refresh();
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const { error } = await deleteStudent(id);
    if (error) {
      toast.error('Failed to delete student');
    } else {
      toast.success('Student removed');
      refresh();
    }
  };

  const getClassName = (classId: string | null) => {
    if (!classId) return 'Not Assigned';
    const cls = classes.find(c => c.id === classId);
    return cls?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-amber-500" />
            Student Management
          </h2>
          <p className="text-slate-400">Manage student admissions, profiles, and records</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Admission Number *</Label>
                  <Input 
                    value={newStudent.admission_number}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, admission_number: e.target.value }))}
                    placeholder="e.g., ADM-2025-001"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label>Roll Number</Label>
                  <Input 
                    value={newStudent.roll_number}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, roll_number: e.target.value }))}
                    placeholder="e.g., 101"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label>Class</Label>
                  <Select 
                    value={newStudent.current_class_id} 
                    onValueChange={(val) => setNewStudent(prev => ({ ...prev, current_class_id: val }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select 
                    value={newStudent.gender} 
                    onValueChange={(val) => setNewStudent(prev => ({ ...prev, gender: val }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAddStudent} 
                  disabled={crudLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  {crudLoading ? 'Adding...' : 'Add Student'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by admission no. or roll no..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: students.filter(s => s.is_active).length, color: "bg-blue-500" },
          { label: "Male", value: students.filter(s => s.gender === 'male' && s.is_active).length, color: "bg-cyan-500" },
          { label: "Female", value: students.filter(s => s.gender === 'female' && s.is_active).length, color: "bg-pink-500" },
          { label: "New Admissions", value: students.filter(s => s.status === 'active' && s.is_active).length, color: "bg-green-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Student Records ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No students found</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4 bg-amber-500">
                <Plus className="w-4 h-4 mr-2" /> Add First Student
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student, idx) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-amber-500 text-white">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">Student-{student.admission_number}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Roll: {student.roll_number || 'N/A'}</span>
                        <span>•</span>
                        <span>{getClassName(student.current_class_id)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={student.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {student.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
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
