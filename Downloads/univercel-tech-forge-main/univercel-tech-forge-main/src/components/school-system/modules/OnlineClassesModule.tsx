/**
 * Online Classes Module
 * Virtual classrooms, video conferencing, and e-learning
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Video, Plus, Play, Users, Calendar, Clock,
  Monitor, Mic, MicOff, Camera, CameraOff, Share,
  MessageSquare, Settings, Download, Upload, FileText,
  ExternalLink, CheckCircle, Circle, Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const LIVE_CLASSES = [
  { id: 1, subject: "Mathematics", teacher: "Mr. Verma", class: "10A", status: "live", students: 38, duration: "45 min", startTime: "10:00 AM" },
  { id: 2, subject: "Physics", teacher: "Mrs. Singh", class: "12A", status: "live", students: 35, duration: "45 min", startTime: "10:00 AM" },
  { id: 3, subject: "English", teacher: "Mr. Kumar", class: "9B", status: "upcoming", students: 0, duration: "45 min", startTime: "11:00 AM" },
  { id: 4, subject: "Chemistry", teacher: "Mrs. Gupta", class: "11A", status: "upcoming", students: 0, duration: "45 min", startTime: "11:45 AM" },
];

const RECORDED_CLASSES = [
  { id: 1, subject: "Mathematics - Quadratic Equations", teacher: "Mr. Verma", class: "10A", duration: "42:15", views: 156, date: "2026-01-17" },
  { id: 2, subject: "Physics - Newton's Laws", teacher: "Mrs. Singh", class: "12A", duration: "38:30", views: 189, date: "2026-01-17" },
  { id: 3, subject: "Chemistry - Organic Chemistry Basics", teacher: "Mrs. Gupta", class: "11A", duration: "45:00", views: 134, date: "2026-01-16" },
  { id: 4, subject: "Biology - Cell Structure", teacher: "Mr. Sharma", class: "9A", duration: "40:20", views: 112, date: "2026-01-16" },
  { id: 5, subject: "English - Shakespeare's Sonnets", teacher: "Mr. Kumar", class: "10B", duration: "35:45", views: 98, date: "2026-01-15" },
];

const ASSIGNMENTS = [
  { id: 1, title: "Math Assignment 5", subject: "Mathematics", class: "10A", dueDate: "2026-01-20", submitted: 28, total: 40, status: "active" },
  { id: 2, title: "Physics Lab Report", subject: "Physics", class: "12A", dueDate: "2026-01-22", submitted: 15, total: 35, status: "active" },
  { id: 3, title: "English Essay", subject: "English", class: "9B", dueDate: "2026-01-18", submitted: 38, total: 42, status: "closing" },
  { id: 4, title: "Chemistry Worksheet", subject: "Chemistry", class: "11A", dueDate: "2026-01-15", submitted: 40, total: 40, status: "completed" },
];

export const OnlineClassesModule = () => {
  const [selectedClass, setSelectedClass] = useState<typeof LIVE_CLASSES[0] | null>(null);

  const liveCount = LIVE_CLASSES.filter(c => c.status === 'live').length;
  const totalStudentsOnline = LIVE_CLASSES.filter(c => c.status === 'live').reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-7 h-7 text-amber-500" />
            Online Classes
          </h2>
          <p className="text-slate-400">Virtual classrooms, recordings, and e-learning</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => toast.info('Schedule class')}>
            <Calendar className="w-4 h-4 mr-2" /> Schedule
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Start instant class')}>
            <Plus className="w-4 h-4 mr-2" /> Start Class
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Live Now", value: liveCount.toString(), icon: Video, color: "bg-red-500", pulse: true },
          { label: "Students Online", value: totalStudentsOnline.toString(), icon: Users, color: "bg-green-500" },
          { label: "Recorded", value: RECORDED_CLASSES.length.toString(), icon: Play, color: "bg-blue-500" },
          { label: "Assignments", value: ASSIGNMENTS.filter(a => a.status !== 'completed').length.toString(), icon: FileText, color: "bg-purple-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center relative`}>
                <stat.icon className="w-6 h-6 text-white" />
                {stat.pulse && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="live" className="relative">
            Live Classes
            {liveCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
          </TabsTrigger>
          <TabsTrigger value="recorded">Recorded</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Live Classes Tab */}
        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {LIVE_CLASSES.map((cls, idx) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors ${cls.status === 'live' ? 'ring-2 ring-red-500/50' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {cls.status === 'live' && (
                            <span className="flex items-center gap-1 text-red-400 text-sm">
                              <Circle className="w-2 h-2 fill-current animate-pulse" /> LIVE
                            </span>
                          )}
                          <Badge className="bg-slate-600 text-white">Class {cls.class}</Badge>
                        </div>
                        <h3 className="text-white font-bold text-lg">{cls.subject}</h3>
                        <p className="text-sm text-slate-400">{cls.teacher}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{cls.startTime}</p>
                        <p className="text-sm text-slate-400">{cls.duration}</p>
                      </div>
                    </div>
                    
                    {cls.status === 'live' && (
                      <div className="flex items-center gap-4 mb-4 p-3 bg-slate-700/50 rounded-lg">
                        <Users className="w-5 h-5 text-green-400" />
                        <span className="text-white">{cls.students} students attending</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {cls.status === 'live' ? (
                        <>
                          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => toast.info('Joining class...')}>
                            <Video className="w-4 h-4 mr-2" /> Join Now
                          </Button>
                          <Button variant="outline" size="icon" className="border-slate-600 text-slate-300">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" className="flex-1 border-slate-600 text-slate-300">
                          <Clock className="w-4 h-4 mr-2" /> Starts at {cls.startTime}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Recorded Classes Tab */}
        <TabsContent value="recorded" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recorded Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECORDED_CLASSES.map((recording, idx) => (
                  <motion.div
                    key={recording.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{recording.subject}</p>
                        <p className="text-sm text-slate-400">{recording.teacher} • Class {recording.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white">{recording.duration}</p>
                        <p className="text-sm text-slate-400">{recording.views} views</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Play className="w-4 h-4 mr-1" /> Watch
                      </Button>
                      <Button size="icon" variant="ghost" className="text-slate-400">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Assignments</CardTitle>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Create assignment')}>
                <Plus className="w-4 h-4 mr-2" /> New Assignment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ASSIGNMENTS.map((assignment, idx) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{assignment.title}</h4>
                          <Badge className={
                            assignment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            assignment.status === 'closing' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }>
                            {assignment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{assignment.subject} • Class {assignment.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                        <p className="text-sm text-slate-400">{assignment.submitted}/{assignment.total} submitted</p>
                      </div>
                    </div>
                    <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-500" />
                  Upload Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-1">Drag & drop files here</p>
                  <p className="text-sm text-slate-400">or click to browse</p>
                  <p className="text-xs text-slate-500 mt-2">PDF, DOC, PPT, Video up to 500MB</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  Recent Uploads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Chapter 5 Notes.pdf", size: "2.4 MB", type: "PDF" },
                    { name: "Physics Formulas.pptx", size: "5.1 MB", type: "PPT" },
                    { name: "Sample Questions.docx", size: "1.2 MB", type: "DOC" },
                    { name: "Lab Demo Video.mp4", size: "45 MB", type: "Video" },
                  ].map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-white text-sm">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <Badge className="bg-slate-600 text-white">{file.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
