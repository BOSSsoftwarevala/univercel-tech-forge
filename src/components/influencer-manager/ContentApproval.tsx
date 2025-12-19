import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, CheckCircle, XCircle, Clock, Image,
  Video, FileText, AlertTriangle, Eye, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const pendingContent = [
  { 
    id: 1, 
    influencer: 'Priya Sharma', 
    type: 'image', 
    title: 'Product Banner - Summer Sale',
    status: 'pending',
    compliance: 92,
    plagiarism: 0,
    submitted: '2 hours ago'
  },
  { 
    id: 2, 
    influencer: 'Rahul Verma', 
    type: 'video', 
    title: 'Product Review Reel',
    status: 'pending',
    compliance: 78,
    plagiarism: 5,
    submitted: '4 hours ago'
  },
  { 
    id: 3, 
    influencer: 'Sneha Patel', 
    type: 'text', 
    title: 'Blog Post - Tech Features',
    status: 'revision',
    compliance: 65,
    plagiarism: 12,
    submitted: '1 day ago'
  },
];

const approvedTemplates = [
  { id: 1, name: 'Product Banner Template', type: 'image', uses: 234 },
  { id: 2, name: 'Promo Video Script', type: 'video', uses: 156 },
  { id: 3, name: 'Social Media Caption', type: 'text', uses: 892 },
  { id: 4, name: 'Story Template Pack', type: 'image', uses: 445 },
];

const ContentApproval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<number | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Approval Workspace</h2>
          <p className="text-slate-400 mt-1">Review content with AI compliance checks and plagiarism detection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Brand Guidelines
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <FileCheck className="w-4 h-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: '24', icon: Clock, color: 'yellow' },
          { label: 'Approved Today', value: '156', icon: CheckCircle, color: 'emerald' },
          { label: 'Needs Revision', value: '8', icon: AlertTriangle, color: 'orange' },
          { label: 'Rejected', value: '3', icon: XCircle, color: 'red' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending Content */}
        <div className="col-span-2 space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600/50"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Content List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Pending Content Review</h3>
            <div className="space-y-4">
              {pendingContent.map((content, index) => {
                const TypeIcon = getTypeIcon(content.type);
                return (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedContent === content.id 
                        ? 'bg-purple-500/10 border-purple-500/50' 
                        : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50'
                    }`}
                    onClick={() => setSelectedContent(content.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        content.type === 'image' ? 'bg-blue-500/20' :
                        content.type === 'video' ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}>
                        <TypeIcon className={`w-6 h-6 ${
                          content.type === 'image' ? 'text-blue-400' :
                          content.type === 'video' ? 'text-red-400' : 'text-green-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{content.title}</h4>
                          <Badge className={
                            content.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-orange-500/20 text-orange-400'
                          }>
                            {content.status === 'pending' ? 'Pending' : 'Needs Revision'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                          By {content.influencer} • {content.submitted}
                        </p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">AI Compliance:</span>
                            <span className={`text-sm font-medium ${getComplianceColor(content.compliance)}`}>
                              {content.compliance}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Plagiarism:</span>
                            <span className={`text-sm font-medium ${
                              content.plagiarism === 0 ? 'text-emerald-400' :
                              content.plagiarism < 10 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {content.plagiarism}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedContent === content.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2"
                      >
                        <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Request Revision
                        </Button>
                        <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Approved Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              Brand-Approved Templates
            </h3>
            <div className="space-y-3">
              {approvedTemplates.map((template) => {
                const TypeIcon = getTypeIcon(template.type);
                return (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700/30 hover:border-purple-500/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <TypeIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">{template.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{template.uses} uses</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Compliance Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <h3 className="text-lg font-semibold text-white mb-4">AI Compliance Checks</h3>
            <div className="space-y-2">
              {[
                { rule: 'Brand Logo Usage', status: 'active' },
                { rule: 'Disclosure Statement', status: 'active' },
                { rule: 'Color Guidelines', status: 'active' },
                { rule: 'Prohibited Claims', status: 'active' },
                { rule: 'Regional Compliance', status: 'active' },
              ].map((rule) => (
                <div
                  key={rule.rule}
                  className="flex items-center justify-between p-2 rounded bg-slate-900/30"
                >
                  <span className="text-sm text-slate-300">{rule.rule}</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Language Variants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Regional Adaptations</h3>
            <div className="grid grid-cols-2 gap-2">
              {['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map((lang) => (
                <div
                  key={lang}
                  className="px-3 py-2 rounded-lg bg-slate-900/30 border border-slate-700/30 text-center text-sm text-slate-300"
                >
                  {lang}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContentApproval;
