import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Clock, CheckCircle, XCircle,
  Star, FileText, MessageSquare, MoreVertical, ChevronRight,
  Briefcase, MapPin, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  stage: 'applied' | 'screening' | 'interview' | 'technical' | 'offer' | 'hired' | 'rejected';
  score: number;
  appliedDate: string;
  location: string;
  experience: string;
  skills: string[];
}

const stages = [
  { id: 'applied', label: 'Applied', color: 'slate' },
  { id: 'screening', label: 'Screening', color: 'cyan' },
  { id: 'interview', label: 'Interview', color: 'amber' },
  { id: 'technical', label: 'Technical', color: 'violet' },
  { id: 'offer', label: 'Offer', color: 'emerald' },
  { id: 'hired', label: 'Hired', color: 'green' },
];

const candidates: Candidate[] = [
  { id: '1', name: 'Rahul Sharma', email: 'r***@gmail.com', position: 'Senior Developer', stage: 'technical', score: 92, appliedDate: '2024-01-15', location: 'Mumbai', experience: '5 years', skills: ['React', 'Node.js', 'TypeScript'] },
  { id: '2', name: 'Priya Patel', email: 'p***@outlook.com', position: 'UI/UX Designer', stage: 'interview', score: 88, appliedDate: '2024-01-14', location: 'Delhi', experience: '3 years', skills: ['Figma', 'Adobe XD', 'CSS'] },
  { id: '3', name: 'Amit Kumar', email: 'a***@yahoo.com', position: 'Backend Developer', stage: 'screening', score: 75, appliedDate: '2024-01-13', location: 'Bangalore', experience: '4 years', skills: ['Python', 'Django', 'PostgreSQL'] },
  { id: '4', name: 'Sneha Reddy', email: 's***@gmail.com', position: 'Project Manager', stage: 'offer', score: 95, appliedDate: '2024-01-10', location: 'Hyderabad', experience: '7 years', skills: ['Agile', 'Scrum', 'JIRA'] },
  { id: '5', name: 'Vikram Singh', email: 'v***@gmail.com', position: 'DevOps Engineer', stage: 'applied', score: 70, appliedDate: '2024-01-16', location: 'Pune', experience: '2 years', skills: ['AWS', 'Docker', 'Kubernetes'] },
];

const HiringPipeline = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const getCandidatesByStage = (stage: string) => candidates.filter(c => c.stage === stage);

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      applied: 'from-slate-500/20 to-slate-600/20 border-slate-500/30',
      screening: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
      interview: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
      technical: 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
      offer: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
      hired: 'from-green-500/20 to-green-600/20 border-green-500/30',
    };
    return colors[stage] || colors.applied;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Hiring Pipeline</h2>
          <p className="text-slate-400">Manage candidates through the recruitment process</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-violet-500/30 text-violet-400">
            {candidates.length} Active Candidates
          </Badge>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-[250px]">
            <div className={`p-3 rounded-t-xl bg-gradient-to-r ${getStageColor(stage.id)} border border-b-0`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{stage.label}</span>
                <Badge variant="secondary" className="bg-slate-800/50 text-white">
                  {getCandidatesByStage(stage.id).length}
                </Badge>
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-b-xl border border-t-0 border-slate-700/50 p-2 min-h-[400px] space-y-2">
              <AnimatePresence>
                {getCandidatesByStage(stage.id).map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCandidate(candidate)}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/50 cursor-pointer hover:border-violet-500/50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-violet-500/20 text-violet-400 text-sm">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{candidate.name}</h4>
                        <p className="text-xs text-slate-400 truncate">{candidate.position}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            <span className="text-xs text-amber-400">{candidate.score}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="text-xs text-slate-500">{candidate.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px] bg-slate-800 text-slate-400">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 2 && (
                        <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-400">
                          +{candidate.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-violet-500/30 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xl">
                        {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedCandidate.name}</h3>
                      <p className="text-violet-400">{selectedCandidate.position}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedCandidate.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {selectedCandidate.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-center px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
                      <div className="text-2xl font-bold text-violet-400">{selectedCandidate.score}%</div>
                      <div className="text-xs text-slate-400">Match Score</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <Badge key={skill} className="bg-slate-800 text-white border-slate-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email (Masked)</span>
                    </div>
                    <p className="text-white font-medium">{selectedCandidate.email}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Applied Date</span>
                    </div>
                    <p className="text-white font-medium">{selectedCandidate.appliedDate}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Move to Next Stage
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiringPipeline;
