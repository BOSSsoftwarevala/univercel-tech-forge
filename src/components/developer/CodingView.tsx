import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, FileCode, GitBranch, Terminal, CheckCircle2, 
  XCircle, Lightbulb, FolderTree, Clock, Zap
} from 'lucide-react';

const codeLines = [
  'import { useState, useEffect } from "react";',
  'import { motion } from "framer-motion";',
  '',
  'const Dashboard = () => {',
  '  const [data, setData] = useState([]);',
  '  const [loading, setLoading] = useState(true);',
  '',
  '  useEffect(() => {',
  '    fetchDashboardData()',
  '      .then(res => setData(res))',
  '      .finally(() => setLoading(false));',
  '  }, []);',
  '',
  '  return (',
  '    <motion.div',
  '      initial={{ opacity: 0 }}',
  '      animate={{ opacity: 1 }}',
  '    >',
  '      {/* Dashboard Content */}',
  '    </motion.div>',
  '  );',
  '};',
];

const logs = [
  { type: 'success', message: 'Module compiled successfully', time: '10:23:45' },
  { type: 'info', message: 'Watching for file changes...', time: '10:23:46' },
  { type: 'success', message: 'API endpoint connected', time: '10:24:12' },
  { type: 'warning', message: 'Deprecated function detected', time: '10:24:30' },
  { type: 'success', message: 'Tests passed: 24/24', time: '10:25:01' },
];

const CodingView = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [visibleCode, setVisibleCode] = useState<string[]>([]);

  useEffect(() => {
    if (currentLine < codeLines.length) {
      const timer = setTimeout(() => {
        setVisibleCode(prev => [...prev, codeLines[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Sandbox & Preview</h2>
          <p className="text-slate-400 mt-1">Live coding environment</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-emerald-400 rounded-full"
            />
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 overflow-hidden"
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">Dashboard.tsx</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <GitBranch className="w-3 h-3" />
                  main
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 font-mono text-sm overflow-auto max-h-96">
              {visibleCode.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex"
                >
                  <span className="w-8 text-slate-600 select-none">{index + 1}</span>
                  <pre className="text-slate-300">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/(import|from|const|return|useEffect|useState)/g, '<span class="text-purple-400">$1</span>')
                          .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
                          .replace(/(\/\/.*)/g, '<span class="text-slate-500">$1</span>')
                          .replace(/(\{\/\*.*\*\/\})/g, '<span class="text-slate-500">$1</span>')
                      }}
                    />
                  </pre>
                </motion.div>
              ))}
              {currentLine < codeLines.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-cyan-400 ml-8"
                />
              )}
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-slate-950 border border-slate-700/50 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/50">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Terminal</span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1 max-h-48 overflow-auto">
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 }}
                  className="flex items-start gap-2"
                >
                  {log.type === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />}
                  {log.type === 'error' && <XCircle className="w-3 h-3 text-red-400 mt-0.5" />}
                  {log.type === 'warning' && <span className="text-amber-400">⚠</span>}
                  {log.type === 'info' && <span className="text-blue-400">ℹ</span>}
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={`${
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {log.message}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* AI Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">AI Co-Developer Tips</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Zap className="w-3 h-3 text-amber-400 mt-1" />
                Consider memoizing the data fetch
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-3 h-3 text-amber-400 mt-1" />
                Add error boundary for resilience
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-3 h-3 text-amber-400 mt-1" />
                Loading state could use skeleton
              </li>
            </ul>
          </motion.div>

          {/* Asset Library */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <FolderTree className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-white">Asset Library</span>
            </div>
            <div className="space-y-2">
              {['components/', 'hooks/', 'utils/', 'assets/'].map((folder, i) => (
                <div key={folder} className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
                  <FolderTree className="w-3 h-3" />
                  {folder}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Version Control */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-white">Commit History</span>
            </div>
            <div className="space-y-3">
              {[
                { msg: 'Add dashboard layout', time: '2h ago' },
                { msg: 'Fix responsive grid', time: '4h ago' },
                { msg: 'Initial commit', time: '1d ago' },
              ].map((commit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-cyan-500" />
                  <div>
                    <p className="text-sm text-slate-300">{commit.msg}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {commit.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CodingView;
