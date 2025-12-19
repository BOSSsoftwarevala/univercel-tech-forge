import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Play, CheckCircle, Clock, Award, 
  Star, Lock, BookOpen, Video, FileText, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  progress: number;
  status: 'completed' | 'in_progress' | 'locked' | 'available';
  type: 'video' | 'reading' | 'quiz';
  certificate: boolean;
}

const FranchiseTrainingCenter = () => {
  const [activeTab, setActiveTab] = useState('all');

  const courses: Course[] = [
    { id: '1', title: 'Franchise Onboarding', description: 'Learn the basics of being a franchise partner', duration: '2 hours', modules: 8, progress: 100, status: 'completed', type: 'video', certificate: true },
    { id: '2', title: 'Lead Management Mastery', description: 'Master the art of lead conversion', duration: '3 hours', modules: 12, progress: 75, status: 'in_progress', type: 'video', certificate: true },
    { id: '3', title: 'Demo Presentation Skills', description: 'Effective demo presentation techniques', duration: '1.5 hours', modules: 6, progress: 40, status: 'in_progress', type: 'video', certificate: true },
    { id: '4', title: 'Sales Techniques Advanced', description: 'Advanced sales and negotiation strategies', duration: '4 hours', modules: 15, progress: 0, status: 'available', type: 'video', certificate: true },
    { id: '5', title: 'Product Knowledge Base', description: 'Deep dive into all product features', duration: '5 hours', modules: 20, progress: 0, status: 'available', type: 'reading', certificate: false },
    { id: '6', title: 'Territory Management', description: 'Optimize your territory operations', duration: '2.5 hours', modules: 10, progress: 0, status: 'locked', type: 'video', certificate: true },
  ];

  const achievements = [
    { title: 'Quick Learner', description: 'Complete 3 courses in first month', achieved: true, icon: Star },
    { title: 'Sales Champion', description: 'Score 90%+ on Sales Techniques', achieved: true, icon: Trophy },
    { title: 'Demo Expert', description: 'Complete Demo Presentation course', achieved: false, icon: Award },
    { title: 'Knowledge Master', description: 'Complete all product training', achieved: false, icon: GraduationCap },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', label: 'Completed', icon: CheckCircle };
      case 'in_progress': return { color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', label: 'In Progress', icon: Clock };
      case 'available': return { color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30', label: 'Start Now', icon: Play };
      case 'locked': return { color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', label: 'Locked', icon: Lock };
      default: return { color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', label: status, icon: Clock };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'reading': return BookOpen;
      case 'quiz': return FileText;
      default: return BookOpen;
    }
  };

  const stats = {
    totalCourses: courses.length,
    completed: courses.filter(c => c.status === 'completed').length,
    inProgress: courses.filter(c => c.status === 'in_progress').length,
    overallProgress: Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length),
  };

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(c => c.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Training Center</h1>
          <p className="text-slate-400">Enhance your skills and earn certifications</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2">
          <Award className="w-4 h-4" />
          View Certificates
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.overallProgress}%</p>
              <p className="text-xs text-slate-400">Overall Progress</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
              <p className="text-xs text-slate-400">In Progress</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
              <p className="text-xs text-slate-400">Total Courses</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-indigo-500">All</TabsTrigger>
              <TabsTrigger value="in_progress" className="data-[state=active]:bg-indigo-500">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-indigo-500">Completed</TabsTrigger>
              <TabsTrigger value="available" className="data-[state=active]:bg-indigo-500">Available</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredCourses.map((course, index) => {
              const statusConfig = getStatusConfig(course.status);
              const StatusIcon = statusConfig.icon;
              const TypeIcon = getTypeIcon(course.type);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30 transition-all ${course.status === 'locked' ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <TypeIcon className="w-7 h-7 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{course.title}</h3>
                            {course.certificate && (
                              <Award className="w-4 h-4 text-amber-400" title="Certificate available" />
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{course.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {course.modules} modules
                            </span>
                          </div>
                          {course.status !== 'locked' && course.status !== 'available' && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Progress</span>
                                <span className="text-indigo-400">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                          {course.status !== 'locked' && (
                            <Button 
                              size="sm" 
                              className={course.status === 'completed' ? 'bg-slate-700' : 'bg-indigo-500 hover:bg-indigo-600'}
                            >
                              {course.status === 'completed' ? 'Review' : course.status === 'in_progress' ? 'Continue' : 'Start'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <Card className="bg-slate-800/50 border-slate-700/50 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-amber-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    achievement.achieved 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-slate-900/50 border-slate-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      achievement.achieved ? 'bg-amber-500/20' : 'bg-slate-700/50'
                    }`}>
                      <Icon className={`w-5 h-5 ${achievement.achieved ? 'text-amber-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${achievement.achieved ? 'text-white' : 'text-slate-400'}`}>
                        {achievement.title}
                      </p>
                      <p className="text-xs text-slate-500">{achievement.description}</p>
                    </div>
                    {achievement.achieved && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FranchiseTrainingCenter;
