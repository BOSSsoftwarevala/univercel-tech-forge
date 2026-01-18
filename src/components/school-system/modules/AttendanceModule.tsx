/**
 * Attendance Module
 * Mark and track student/staff attendance
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, CheckCircle, XCircle, Clock, Users,
  Filter, Download, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchoolData } from "@/hooks/useSchoolData";
import { toast } from "sonner";

export const AttendanceModule = () => {
  const { students, classes, stats, attendance } = useSchoolData();
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});

  const filteredStudents = students.filter(s => 
    s.is_active && (selectedClass === "all" || s.current_class_id === selectedClass)
  );

  const handleMarkAttendance = (studentId: string, status: string) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    toast.success(`Attendance saved for ${Object.keys(attendanceMap).length} students`);
  };

  const presentCount = Object.values(attendanceMap).filter(s => s === 'present').length;
  const absentCount = Object.values(attendanceMap).filter(s => s === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-amber-500" />
            Attendance Management
          </h2>
          <p className="text-slate-400">Mark and manage daily attendance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleSaveAttendance}
            disabled={Object.keys(attendanceMap).length === 0}
          >
            <Save className="w-4 h-4 mr-2" /> Save Attendance
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: filteredStudents.length, icon: Users, color: "bg-blue-500" },
          { label: "Present", value: presentCount, icon: CheckCircle, color: "bg-green-500" },
          { label: "Absent", value: absentCount, icon: XCircle, color: "bg-red-500" },
          { label: "Pending", value: filteredStudents.length - presentCount - absentCount, icon: Clock, color: "bg-amber-500" },
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

      {/* Attendance List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Mark Attendance - {selectedDate}</span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-green-500 text-green-400"
                onClick={() => {
                  const newMap: Record<string, string> = {};
                  filteredStudents.forEach(s => newMap[s.id] = 'present');
                  setAttendanceMap(newMap);
                  toast.success('All marked present');
                }}
              >
                Mark All Present
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No students in selected class</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student, idx) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 w-8">{idx + 1}.</span>
                    <div>
                      <p className="text-white font-medium">Student-{student.admission_number}</p>
                      <p className="text-sm text-slate-400">Roll: {student.roll_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={attendanceMap[student.id] === 'present' ? 'default' : 'outline'}
                      className={attendanceMap[student.id] === 'present' ? 'bg-green-500 hover:bg-green-600' : 'border-green-500 text-green-400'}
                      onClick={() => handleMarkAttendance(student.id, 'present')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Present
                    </Button>
                    <Button
                      size="sm"
                      variant={attendanceMap[student.id] === 'absent' ? 'default' : 'outline'}
                      className={attendanceMap[student.id] === 'absent' ? 'bg-red-500 hover:bg-red-600' : 'border-red-500 text-red-400'}
                      onClick={() => handleMarkAttendance(student.id, 'absent')}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Absent
                    </Button>
                    <Button
                      size="sm"
                      variant={attendanceMap[student.id] === 'late' ? 'default' : 'outline'}
                      className={attendanceMap[student.id] === 'late' ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-500 text-amber-400'}
                      onClick={() => handleMarkAttendance(student.id, 'late')}
                    >
                      <Clock className="w-4 h-4 mr-1" /> Late
                    </Button>
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
