import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Play, CheckCircle, Clock, Award, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const lessons = [
  { 
    id: 1, 
    title: 'How to Pitch POS System', 
    duration: '1:30', 
    category: 'POS System',
    completed: true,
    type: 'video'
  },
  { 
    id: 2, 
    title: 'School ERP Key Features', 
    duration: '2:00', 
    category: 'School ERP',
    completed: true,
    type: 'video'
  },
  { 
    id: 3, 
    title: 'Handling Price Objections', 
    duration: '1:45', 
    category: 'Sales Skills',
    completed: false,
    type: 'video'
  },
  { 
    id: 4, 
    title: 'Demo Best Practices', 
    duration: '2:15', 
    category: 'Demo Skills',
    completed: false,
    type: 'video'
  },
  { 
    id: 5, 
    title: 'Success Story: ₹5L in First Month', 
    duration: '3:00', 
    category: 'Case Study',
    completed: false,
    type: 'case-study'
  },
];

const categories = [
  { name: 'Product Knowledge', progress: 75, lessons: 8 },
  { name: 'Sales Skills', progress: 50, lessons: 6 },
  { name: 'Demo Techniques', progress: 25, lessons: 4 },
  { name: 'Success Stories', progress: 40, lessons: 5 },
];

const successTips = [
  'Always ask qualifying questions before sharing demo link',
  'Follow up within 24 hours of demo view',
  'Use local language for better connection',
  'Share customer success stories relevant to their industry',
];

export const MicroTrainingLessons = () => {
  const completedLessons = lessons.filter(l => l.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Micro Training</h2>
          <p className="text-sm text-muted-foreground">Short 1-minute lessons for quick learning</p>
        </div>
        <Badge variant="outline" className="border-neon-green/30 text-neon-green">
          {completedLessons}/{lessons.length} Completed
        </Badge>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">{cat.name}</p>
                <Progress value={cat.progress} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{cat.lessons} lessons</span>
                  <span className="text-xs text-neon-blue">{cat.progress}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lesson List */}
        <Card className="lg:col-span-2 glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <GraduationCap className="w-5 h-5 text-neon-blue" />
              Mini Lessons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:border-neon-blue/30 ${
                  lesson.completed 
                    ? 'bg-neon-green/5 border-neon-green/30' 
                    : 'bg-secondary/20 border-border/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    lesson.completed ? 'bg-neon-green/20' : 'bg-neon-blue/20'
                  }`}>
                    {lesson.completed ? (
                      <CheckCircle className="w-6 h-6 text-neon-green" />
                    ) : (
                      <Play className="w-6 h-6 text-neon-blue" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{lesson.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant={lesson.completed ? "ghost" : "outline"} 
                  size="sm"
                  className={lesson.completed ? "" : "border-neon-blue/30 text-neon-blue"}
                >
                  {lesson.completed ? 'Replay' : 'Start'}
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Success Tips */}
        <div className="space-y-6">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Award className="w-5 h-5 text-neon-orange" />
                Success Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {successTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
                >
                  <div className="w-6 h-6 rounded-full bg-neon-orange/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-neon-orange">{index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel border-neon-purple/30 bg-neon-purple/5">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-neon-purple" />
              <h3 className="font-mono font-bold text-foreground mb-2">Role Play Examples</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Practice with AI-generated customer scenarios
              </p>
              <Button className="bg-neon-purple text-background">
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
