import { motion } from 'framer-motion';
import { Bot, Sparkles, Clock, AlertTriangle, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface AIAssistantCardProps {
  taskId: string | null;
  taskTitle: string | null;
  onAnalyze: () => Promise<string>;
  onEstimate: () => Promise<string>;
  onDetectRisk: () => Promise<string>;
  onOptimize: () => Promise<string>;
}

const AIAssistantCard = ({ 
  taskId, 
  taskTitle,
  onAnalyze,
  onEstimate,
  onDetectRisk,
  onOptimize 
}: AIAssistantCardProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');

  const handleAction = async (action: string, handler: () => Promise<string>) => {
    if (!taskId) {
      toast.error('No active task. AI responds only within task context.');
      return;
    }
    
    setLoading(action);
    try {
      const response = await handler();
      setResult(response);
    } catch (error) {
      toast.error('AI analysis failed');
    } finally {
      setLoading(null);
    }
  };

  const actions = [
    { id: 'analyze', label: 'Analyze My Task', icon: Sparkles, handler: onAnalyze },
    { id: 'estimate', label: 'Estimate Completion', icon: Clock, handler: onEstimate },
    { id: 'risk', label: 'Detect Risk', icon: AlertTriangle, handler: onDetectRisk },
    { id: 'optimize', label: 'Optimize Code', icon: Zap, handler: onOptimize },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900/80 backdrop-blur-xl rounded-2xl border p-6 ${
        taskId ? 'border-violet-500/30' : 'border-slate-700/30'
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${taskId ? 'bg-violet-500/20' : 'bg-slate-700/50'}`}>
          <Bot className={`w-5 h-5 ${taskId ? 'text-violet-400' : 'text-slate-500'}`} />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${taskId ? 'text-white' : 'text-slate-500'}`}>
            AI Assistant
          </h3>
          <p className="text-xs text-slate-400">Task-bound responses only</p>
        </div>
      </div>

      {!taskId ? (
        <div className="text-center py-8 text-slate-500">
          <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Accept a task to enable AI assistance</p>
          <p className="text-xs mt-2 text-slate-600">AI responds only within task context</p>
        </div>
      ) : (
        <>
          {/* Current Task Context */}
          <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 mb-4">
            <p className="text-xs text-violet-400 mb-1">Active Context:</p>
            <p className="text-sm text-white">{taskTitle}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleAction(action.id, action.handler)}
                disabled={loading !== null}
                className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 justify-start"
              >
                {loading === action.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <action.icon className="w-4 h-4 mr-2" />
                )}
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Result Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 max-h-[200px] overflow-y-auto"
            >
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{result}</p>
            </motion.div>
          )}
        </>
      )}

      {/* Rule Notice */}
      <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <p className="text-xs text-slate-400 text-center">
          ⚠️ AI responds ONLY within current task context
        </p>
      </div>
    </motion.div>
  );
};

export default AIAssistantCard;
