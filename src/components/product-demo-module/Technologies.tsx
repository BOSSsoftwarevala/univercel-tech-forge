/**
 * TECHNOLOGY TAGGING
 */
import React from 'react';
import { Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const techs = ['React', 'Vue.js', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Firebase', 'AWS'];

export const Technologies: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold flex items-center gap-2"><Cpu className="w-5 h-5 text-violet-400" />Technologies</h1>
      <p className="text-sm text-muted-foreground">Technology tags for products</p>
    </div>
    <Card className="bg-card/80 border-border/50">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {techs.map(t => <Badge key={t} variant="outline" className="px-3 py-1">{t}</Badge>)}
        </div>
      </CardContent>
    </Card>
  </div>
);
