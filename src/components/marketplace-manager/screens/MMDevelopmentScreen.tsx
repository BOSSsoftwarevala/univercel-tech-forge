import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Code, 
  TestTube, 
  Rocket,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';

interface DevelopmentProject {
  id: string;
  productName: string;
  orderNumber: string;
  stage: 'setup' | 'development' | 'testing' | 'deployment' | 'completed';
  progress: number;
  startDate: string;
  estimatedEnd: string;
  developer: string;
  updates: { date: string; message: string }[];
}

const projects: DevelopmentProject[] = [
  {
    id: '1',
    productName: 'CRM Pro Suite',
    orderNumber: 'ORD-2024-001',
    stage: 'development',
    progress: 65,
    startDate: '2024-01-16',
    estimatedEnd: '2024-01-30',
    developer: 'Vala AI Team',
    updates: [
      { date: '2024-01-18', message: 'Core modules completed. Working on custom fields.' },
      { date: '2024-01-17', message: 'Database setup and base configuration done.' },
      { date: '2024-01-16', message: 'Project initiated. Requirements analyzed.' },
    ]
  },
  {
    id: '2',
    productName: 'Lead Magnet Pro',
    orderNumber: 'ORD-2024-004',
    stage: 'setup',
    progress: 15,
    startDate: '2024-01-18',
    estimatedEnd: '2024-02-01',
    developer: 'Vala AI Team',
    updates: [
      { date: '2024-01-18', message: 'Project setup initiated. Analyzing requirements.' },
    ]
  },
];

const stageConfig = {
  setup: { label: 'Setup', icon: Clock, color: 'text-slate-400' },
  development: { label: 'Development', icon: Code, color: 'text-purple-400' },
  testing: { label: 'Testing', icon: TestTube, color: 'text-amber-400' },
  deployment: { label: 'Deployment', icon: Rocket, color: 'text-blue-400' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-emerald-400' },
};

const stages = ['setup', 'development', 'testing', 'deployment', 'completed'];

export function MMDevelopmentScreen() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-purple-400" />
          Development Progress
        </h1>
        <p className="text-slate-400 mt-1">Track your software development in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-slate-400">Setup</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 mx-auto text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-purple-400">1</p>
            <p className="text-xs text-purple-400">In Development</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <TestTube className="h-8 w-8 mx-auto text-amber-400 mb-2" />
            <p className="text-2xl font-bold text-amber-400">0</p>
            <p className="text-xs text-amber-400">Testing</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-emerald-400">0</p>
            <p className="text-xs text-emerald-400">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <div className="space-y-6">
        {projects.map(project => {
          const currentStageIndex = stages.indexOf(project.stage);
          
          return (
            <Card key={project.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{project.productName}</CardTitle>
                    <p className="text-sm text-slate-400">{project.orderNumber}</p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {project.progress}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>

                {/* Stages */}
                <div className="flex justify-between relative">
                  {/* Connection Line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700" style={{ zIndex: 0 }} />
                  <div 
                    className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" 
                    style={{ 
                      width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                      zIndex: 1 
                    }} 
                  />
                  
                  {stages.map((stage, index) => {
                    const config = stageConfig[stage as keyof typeof stageConfig];
                    const Icon = config.icon;
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    
                    return (
                      <div key={stage} className="flex flex-col items-center relative z-10">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-purple-500' : 'bg-slate-700'}
                        `}>
                          <Icon className={`h-4 w-4 ${isCompleted || isCurrent ? 'text-white' : 'text-slate-400'}`} />
                        </div>
                        <span className={`text-xs mt-2 ${isCurrent ? 'text-purple-400 font-medium' : 'text-slate-400'}`}>
                          {config.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Info */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Started</p>
                      <p className="text-sm font-medium">{project.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Est. End</p>
                      <p className="text-sm font-medium">{project.estimatedEnd}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Developer</p>
                      <p className="text-sm font-medium">{project.developer}</p>
                    </div>
                  </div>
                </div>

                {/* Updates */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                    Recent Updates
                  </h4>
                  <div className="space-y-3">
                    {project.updates.map((update, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-slate-500 whitespace-nowrap">{update.date}</span>
                        <span className="text-slate-300">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full border-slate-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
