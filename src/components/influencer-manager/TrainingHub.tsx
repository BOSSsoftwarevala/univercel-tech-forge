import { motion } from 'framer-motion';
import { 
  GraduationCap, Play, FileText, Award, Clock,
  CheckCircle, Star, BookOpen, Video, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const courses = [
  { 
    id: 1, 
    title: 'Effective Sales Pitches', 
    type: 'video', 
    duration: '45 min',
    lessons: 8,
    completion: 100,
    rating: 4.8
  },
  { 
    id: 2, 
    title: 'Product Demo Mastery', 
    type: 'video', 
    duration: '1h 20min',
    lessons: 12,
    completion: 75,
    rating: 4.9
  },
  { 
    id: 3, 
    title: 'Content Creation Guidelines', 
    type: 'document', 
    duration: '30 min',
    lessons: 5,
    completion: 50,
    rating: 4.7
  },
  { 
    id: 4, 
    title: 'Social Media Best Practices', 
    type: 'video', 
    duration: '55 min',
    lessons: 10,
    completion: 0,
    rating: 4.6
  },
];

const resources = [
  { id: 1, name: 'Sales Script - Tech Products', type: 'PDF', downloads: 1234 },
  { id: 2, name: 'Demo Presentation Deck', type: 'PPTX', downloads: 892 },
  { id: 3, name: 'Product Feature Highlights', type: 'PDF', downloads: 2156 },
  { id: 4, name: 'FAQ Reference Guide', type: 'PDF', downloads: 756 },
];

const nicheGuides = [
  { niche: 'Technology', guides: 12, icon: '💻' },
  { niche: 'Finance', guides: 8, icon: '💰' },
  { niche: 'Lifestyle', guides: 15, icon: '✨' },
  { niche: 'Health', guides: 10, icon: '🏥' },
  { niche: 'Education', guides: 6, icon: '📚' },
];

const TrainingHub = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Training & Resource Hub</h2>
          <p className="text-slate-400 mt-1">Access sales scripts, demo pitches, and best practice guides</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white">3 Certifications</span>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <GraduationCap className="w-4 h-4 mr-2" />
            My Learning Path
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-purple-500/20 border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Learning Progress</h3>
            <p className="text-sm text-slate-400">Complete all courses to become a Certified Influencer</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">56%</div>
            <div className="text-sm text-slate-400">Overall Completion</div>
          </div>
        </div>
        <div className="mt-4 h-3 bg-slate-900/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '56%' }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Courses */}
        <div className="col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Training Courses
            </h3>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      course.type === 'video' ? 'bg-red-500/20' : 'bg-blue-500/20'
                    }`}>
                      {course.type === 'video' ? (
                        <Video className="w-6 h-6 text-red-400" />
                      ) : (
                        <FileText className="w-6 h-6 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{course.title}</h4>
                        {course.completion === 100 ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : course.completion > 0 ? (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            In Progress
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                            Not Started
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                        <span>{course.lessons} lessons</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          {course.rating}
                        </span>
                      </div>
                      {course.completion > 0 && course.completion < 100 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-purple-400">{course.completion}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.completion}%` }}
                              className="h-full bg-purple-500"
                            />
                          </div>
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        className={course.completion === 100 
                          ? 'bg-slate-700 text-slate-300' 
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }
                      >
                        <Play className="w-3 h-3 mr-2" />
                        {course.completion === 100 ? 'Review' : course.completion > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-pink-400" />
              Downloadable Resources
            </h3>
            <div className="space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700/30 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-sm text-white">{resource.name}</div>
                      <div className="text-xs text-slate-400">{resource.type}</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 hover:text-purple-400" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Niche Guides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Niche Category Guides</h3>
            <div className="space-y-2">
              {nicheGuides.map((guide) => (
                <div
                  key={guide.niche}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{guide.icon}</span>
                    <span className="text-sm text-white">{guide.niche}</span>
                  </div>
                  <span className="text-xs text-slate-400">{guide.guides} guides</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certification Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-yellow-500/20 text-center"
          >
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Get Certified</h4>
            <p className="text-sm text-slate-400 mb-4">
              Complete all courses to earn your Certified Influencer badge
            </p>
            <Button variant="outline" className="border-yellow-500/30 text-yellow-400">
              View Requirements
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrainingHub;
