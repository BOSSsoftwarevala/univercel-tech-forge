import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Lock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PerformanceRecord {
  valaId: string;
  name: string;
  department: string;
  period: string;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
  categories: {
    name: string;
    score: number;
  }[];
}

const mockRecords: PerformanceRecord[] = [
  {
    valaId: 'EMP-1001',
    name: 'Employee A',
    department: 'Engineering',
    period: 'Q4 2024',
    overallScore: 88,
    trend: 'up',
    categories: [
      { name: 'Productivity', score: 90 },
      { name: 'Quality', score: 85 },
      { name: 'Teamwork', score: 88 },
      { name: 'Initiative', score: 89 },
    ]
  },
  {
    valaId: 'EMP-1002',
    name: 'Employee B',
    department: 'Design',
    period: 'Q4 2024',
    overallScore: 92,
    trend: 'stable',
    categories: [
      { name: 'Productivity', score: 91 },
      { name: 'Quality', score: 95 },
      { name: 'Teamwork', score: 90 },
      { name: 'Initiative', score: 92 },
    ]
  },
  {
    valaId: 'EMP-1005',
    name: 'Employee E',
    department: 'Engineering',
    period: 'Q4 2024',
    overallScore: 75,
    trend: 'down',
    categories: [
      { name: 'Productivity', score: 72 },
      { name: 'Quality', score: 78 },
      { name: 'Teamwork', score: 80 },
      { name: 'Initiative', score: 70 },
    ]
  },
];

const getTrendIcon = (trend: PerformanceRecord['trend']) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
    case 'stable': return <Minus className="w-4 h-4 text-zinc-400" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
};

export default function HRPerformanceRecords() {
  return (
    <div className="space-y-4">
      {/* READ-ONLY Notice */}
      <div className="flex items-center gap-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
        <Lock className="w-4 h-4 text-zinc-500" />
        <span className="text-xs text-zinc-500 font-mono">READ-ONLY VIEW • NO SCORING OR EDITING PERMITTED</span>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            PERFORMANCE SUMMARIES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockRecords.map((record, idx) => (
            <motion.div
              key={record.valaId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{record.name}</span>
                    <span className="font-mono text-xs text-zinc-500">{record.valaId}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{record.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    {record.period}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-mono font-bold ${getScoreColor(record.overallScore)}`}>
                      {record.overallScore}
                    </span>
                    {getTrendIcon(record.trend)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {record.categories.map(cat => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">{cat.name}</span>
                      <span className={`text-xs font-mono ${getScoreColor(cat.score)}`}>
                        {cat.score}
                      </span>
                    </div>
                    <Progress value={cat.score} className="h-1.5" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
