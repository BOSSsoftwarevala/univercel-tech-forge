import { motion } from 'framer-motion';
import { Download, Play, Activity, Save, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AIConsoleFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left - Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-neon-green"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-muted-foreground">All changes will be logged</span>
          </div>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 border-border/50 hover:bg-secondary/50"
            >
              <Download className="w-4 h-4" />
              Export Config
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 border-neon-cyan/30 hover:bg-neon-cyan/10 text-neon-cyan"
            >
              <FlaskConical className="w-4 h-4" />
              Test Mode
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 border-neon-purple/30 hover:bg-neon-purple/10 text-neon-purple"
            >
              <Activity className="w-4 h-4" />
              Simulate Load
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="sm"
              className="gap-2 bg-gradient-to-r from-sv-blue to-sv-blue-bright hover:from-sv-blue-bright hover:to-sv-blue text-white shadow-lg shadow-sv-blue/30"
            >
              <Save className="w-4 h-4" />
              Save & Apply
            </Button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default AIConsoleFooter;
