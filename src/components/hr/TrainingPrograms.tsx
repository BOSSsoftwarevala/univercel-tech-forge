import { motion } from 'framer-motion';
import { 
  GraduationCap, Clock, Users, Star, Play, CheckCircle,
  BookOpen, Award, Calendar, TrendingUp, BarChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const TrainingPrograms = () => {
  const programs = [
    { 
      id: 1, 
      title: 'React Advanced Patterns', 
      category: 'Technical', 
      duration: '8 hours', 
      enrolled: 23, 
      completion: 78,
      instructor: 'Senior Dev Team',
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Sales Excellence Bootcamp', 
      category: 'Sales', 
      duration: '12 hours', 
      enrolled: 15, 
      completion: 45,
      instructor: 'Sales Director',
      status: 'active'
    },
    { 
      id: 3, 
      title: 'Customer Success Mastery', 
      category: 'Support', 
      duration: '6 hours', 
      enrolled: 18, 
      completion: 92,
      instructor: 'CS Manager',
      status: 'active'
    },
    { 
      id: 4, 
      title: 'AWS Cloud Certification', 
      category: 'Technical', 
      duration: '20 hours', 
      enrolled: 12, 
      completion: 35,
      instructor: 'DevOps Lead',
      status: 'active'
    },
  ];

  const upcomingTraining = [
    { title: 'Leadership Workshop', date: '2024-01-25', time: '10:00 AM', attendees: 8 },
    { title: 'Product Demo Training', date: '2024-01-26', time: '2:00 PM', attendees: 15 },
    { title: 'Security Awareness', date: '2024-01-28', time: '11:00 AM', attendees: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Training Programs</h2>
          <p className="text-slate-400">Manage and track employee training initiatives</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <GraduationCap className="w-4 h-4 mr-2" />
          Create Program
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Programs', value: '12', icon: BookOpen, color: 'violet' },
          { label: 'Total Enrolled', value: '156', icon: Users, color: 'cyan' },
          { label: 'Certifications', value: '45', icon: Award, color: 'amber' },
          { label: 'Avg. Completion', value: '78%', icon: TrendingUp, color: 'emerald' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {programs.map((program, index) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 hover:border-violet-500/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-violet-500/30 text-violet-400">
                        {program.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                        Active
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{program.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">Instructor: {program.instructor}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-violet-400 hover:bg-violet-500/10">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{program.enrolled} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-400">{program.completion}%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-violet-400">{program.completion}%</span>
                  </div>
                  <Progress value={program.completion} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Training */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTraining.map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-violet-500/20">
                    <GraduationCap className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{session.title}</h4>
                    <p className="text-sm text-slate-400">
                      {session.date} at {session.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                    <Users className="w-3 h-3 mr-1" />
                    {session.attendees}
                  </Badge>
                  <Button size="sm" variant="outline" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingPrograms;
