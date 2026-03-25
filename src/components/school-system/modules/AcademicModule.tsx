/**
 * Academic Management Module
 * Subjects, curriculum, timetable, and academic planning
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, Plus, Calendar, Clock, Users, GraduationCap,
  FileText, Edit, Trash2, Eye, Download, BarChart3, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchoolData } from "@/hooks/useSchoolData";
import { toast } from "sonner";

const SUBJECTS = [
  { id: 1, name: "Mathematics", code: "MATH", classes: "6-12", teachers: 12, periods: 6, color: "bg-blue-500" },
  { id: 2, name: "Physics", code: "PHY", classes: "9-12", teachers: 8, periods: 5, color: "bg-purple-500" },
  { id: 3, name: "Chemistry", code: "CHEM", classes: "9-12", teachers: 7, periods: 5, color: "bg-green-500" },
  { id: 4, name: "Biology", code: "BIO", classes: "9-12", teachers: 6, periods: 4, color: "bg-pink-500" },
  { id: 5, name: "English", code: "ENG", classes: "1-12", teachers: 15, periods: 6, color: "bg-amber-500" },
  { id: 6, name: "Hindi", code: "HIN", classes: "1-12", teachers: 10, periods: 4, color: "bg-orange-500" },
  { id: 7, name: "History", code: "HIST", classes: "6-12", teachers: 5, periods: 3, color: "bg-red-500" },
  { id: 8, name: "Geography", code: "GEO", classes: "6-12", teachers: 4, periods: 3, color: "bg-teal-500" },
  { id: 9, name: "Computer Science", code: "CS", classes: "6-12", teachers: 6, periods: 4, color: "bg-cyan-500" },
  { id: 10, name: "Physical Education", code: "PE", classes: "1-12", teachers: 4, periods: 2, color: "bg-indigo-500" },
];

const TIMETABLE = [
  { time: "8:00 - 8:45", mon: "Mathematics", tue: "Physics", wed: "Chemistry", thu: "English", fri: "Biology", sat: "Hindi" },
  { time: "8:45 - 9:30", mon: "Physics", tue: "Mathematics", wed: "English", thu: "Chemistry", fri: "History", sat: "Geography" },
  { time: "9:45 - 10:30", mon: "English", tue: "Biology", wed: "Mathematics", thu: "Physics", fri: "Computer", sat: "Mathematics" },
  { time: "10:30 - 11:15", mon: "Chemistry", tue: "English", wed: "Hindi", thu: "Biology", fri: "Mathematics", sat: "Sports" },
  { time: "11:30 - 12:15", mon: "Hindi", tue: "History", wed: "Physics", thu: "Geography", fri: "English", sat: "Library" },
  { time: "12:15 - 1:00", mon: "History", tue: "Hindi", wed: "Computer", thu: "Mathematics", fri: "Chemistry", sat: "" },
  { time: "2:00 - 2:45", mon: "Biology", tue: "Geography", wed: "History", thu: "Hindi", fri: "Physics", sat: "" },
  { time: "2:45 - 3:30", mon: "Sports", tue: "Computer", wed: "Sports", thu: "Library", fri: "Arts", sat: "" },
];

export const AcademicModule = () => {
  const { classes, stats } = useSchoolData();
  const [selectedClass, setSelectedClass] = useState("10A");
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-amber-500" />
            Academic Management
          </h2>
          <p className="text-slate-400">Manage subjects, curriculum, and class schedules</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300"
            onClick={() => {
              toast.success('Schedule exported', { description: 'academic_schedule.pdf downloaded' });
            }}
          >
            <Download className="w-4 h-4 mr-2" /> Export Schedule
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Subject
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Subjects", value: SUBJECTS.length.toString(), icon: BookOpen, color: "bg-blue-500" },
          { label: "Total Classes", value: classes.length.toString() || "24", icon: Users, color: "bg-green-500" },
          { label: "Weekly Periods", value: "48", icon: Clock, color: "bg-purple-500" },
          { label: "Teachers Assigned", value: stats.teachingStaff.toString(), icon: GraduationCap, color: "bg-amber-500" },
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

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subject Master List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {SUBJECTS.map((subject, idx) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{subject.name}</p>
                        <p className="text-sm text-slate-400">Code: {subject.code} • Classes: {subject.classes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-medium">{subject.teachers} Teachers</p>
                        <p className="text-sm text-slate-400">{subject.periods} periods/week</p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-slate-400 hover:text-white"
                          onClick={() => toast.info(`Editing ${subject.name}`, { description: 'Open subject editor' })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => toast.warning(`Delete ${subject.name}?`, { description: 'This action requires confirmation' })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timetable Tab */}
        <TabsContent value="timetable" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Class Timetable</CardTitle>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["10A", "10B", "10C", "11A", "11B", "12A", "12B"].map(cls => (
                    <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-400 font-medium">Time</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Monday</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Tuesday</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Wednesday</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Thursday</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Friday</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Saturday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIMETABLE.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-3">
                          <Badge className="bg-slate-600 text-white">{row.time}</Badge>
                        </td>
                        <td className="p-3 text-center text-white">{row.mon || "-"}</td>
                        <td className="p-3 text-center text-white">{row.tue || "-"}</td>
                        <td className="p-3 text-center text-white">{row.wed || "-"}</td>
                        <td className="p-3 text-center text-white">{row.thu || "-"}</td>
                        <td className="p-3 text-center text-white">{row.fri || "-"}</td>
                        <td className="p-3 text-center text-slate-400">{row.sat || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Curriculum Tab */}
        <TabsContent value="curriculum" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Curriculum Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SUBJECTS.slice(0, 6).map((subject, idx) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{subject.name}</span>
                      <span className="text-slate-400 text-sm">{70 + idx * 5}% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${70 + idx * 5}%` }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className={`h-full ${subject.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Subject Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Subject Name *</Label>
              <Input placeholder="e.g., Advanced Mathematics" className="bg-slate-700 border-slate-600" />
            </div>
            <div>
              <Label>Subject Code *</Label>
              <Input placeholder="e.g., ADV-MATH" className="bg-slate-700 border-slate-600" />
            </div>
            <div>
              <Label>Classes</Label>
              <Input placeholder="e.g., 9-12" className="bg-slate-700 border-slate-600" />
            </div>
            <div>
              <Label>Weekly Periods</Label>
              <Input type="number" placeholder="e.g., 6" className="bg-slate-700 border-slate-600" />
            </div>
            <Button 
              onClick={() => {
                toast.success('Subject added successfully');
                setIsAddOpen(false);
              }}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              Add Subject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
