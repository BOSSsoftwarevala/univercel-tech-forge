import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, Settings,
  Search, Home, Users, BarChart3, Wallet,
  MessageSquare, Bell, Shield, X, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface VoiceCommand {
  command: string;
  aliases: string[];
  action: string;
  description: string;
  icon: any;
}

const voiceCommands: VoiceCommand[] = [
  { command: 'go to dashboard', aliases: ['open dashboard', 'show dashboard'], action: '/dashboard', description: 'Navigate to main dashboard', icon: Home },
  { command: 'show leads', aliases: ['open leads', 'lead manager'], action: '/leads', description: 'Open lead management', icon: Users },
  { command: 'open wallet', aliases: ['show wallet', 'my wallet'], action: '/wallet', description: 'View wallet balance', icon: Wallet },
  { command: 'check notifications', aliases: ['show notifications', 'alerts'], action: '/notifications', description: 'View notifications', icon: Bell },
  { command: 'open chat', aliases: ['show messages', 'internal chat'], action: '/chat', description: 'Open internal chat', icon: MessageSquare },
  { command: 'view analytics', aliases: ['show analytics', 'reports'], action: '/analytics', description: 'Open analytics dashboard', icon: BarChart3 },
  { command: 'security center', aliases: ['open security', 'security settings'], action: '/security', description: 'Security settings', icon: Shield },
];

interface VoiceCommandNavigationProps {
  onNavigate?: (path: string) => void;
}

export function VoiceCommandNavigation({ onNavigate }: VoiceCommandNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [matchedCommand, setMatchedCommand] = useState<VoiceCommand | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const findMatchingCommand = useCallback((text: string): VoiceCommand | null => {
    const normalizedText = text.toLowerCase().trim();
    
    for (const cmd of voiceCommands) {
      if (normalizedText.includes(cmd.command) || cmd.aliases.some(alias => normalizedText.includes(alias))) {
        return cmd;
      }
    }
    return null;
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice commands are not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    setTranscript('');
    setMatchedCommand(null);

    // Simulate voice recognition (in production, use Web Speech API)
    setTimeout(() => {
      const simulatedCommands = ['show leads', 'open dashboard', 'view analytics'];
      const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
      setTranscript(randomCommand);
      
      const matched = findMatchingCommand(randomCommand);
      if (matched) {
        setMatchedCommand(matched);
        if (audioFeedback) {
          // Play success sound
        }
        setTimeout(() => {
          onNavigate?.(matched.action);
          toast({
            title: "Voice Command Executed",
            description: `Navigating to ${matched.description}`,
          });
          setIsListening(false);
          setTranscript('');
          setMatchedCommand(null);
        }, 1000);
      } else {
        setIsListening(false);
        toast({
          title: "Command Not Recognized",
          description: "Try saying 'go to dashboard' or 'show leads'",
          variant: "destructive",
        });
      }
    }, 2000);
  }, [isSupported, audioFeedback, findMatchingCommand, onNavigate]);

  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
    setMatchedCommand(null);
  };

  return (
    <>
      {/* Voice Button */}
      <div className="relative">
        <Button
          variant={isListening ? "default" : "outline"}
          size="icon"
          onClick={isListening ? stopListening : startListening}
          className={`relative ${isListening && 'animate-pulse bg-primary'}`}
        >
          {isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-md border-2 border-primary"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </Button>

        {/* Help Button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-1"
          onClick={() => setShowCommands(true)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Listening Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            onClick={stopListening}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-8 max-w-md w-full mx-4 text-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Animated Mic */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <Mic className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-mono font-bold text-foreground mb-2">
                Listening...
              </h3>
              <p className="text-muted-foreground mb-4">
                Say a command like "go to dashboard"
              </p>

              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-primary/10 border border-primary/30 mb-4"
                >
                  <p className="text-sm text-muted-foreground">Heard:</p>
                  <p className="text-lg font-mono text-primary">"{transcript}"</p>
                </motion.div>
              )}

              {matchedCommand && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-green-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-green-500">Command Matched!</p>
                    <p className="text-xs text-muted-foreground">{matchedCommand.description}</p>
                  </div>
                </motion.div>
              )}

              <Button variant="outline" onClick={stopListening} className="mt-4">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commands Modal */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowCommands(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-6 max-w-lg w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-mono font-bold text-foreground flex items-center gap-2">
                  <Mic className="w-5 h-5 text-primary" />
                  Voice Commands
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowCommands(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-background/50">
                <span className="text-sm text-foreground">Audio Feedback</span>
                <Button
                  variant={audioFeedback ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAudioFeedback(!audioFeedback)}
                >
                  {audioFeedback ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="space-y-2 max-h-80 overflow-auto">
                {voiceCommands.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <motion.div
                      key={cmd.command}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg bg-background/30 border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-mono text-sm text-foreground">"{cmd.command}"</p>
                          <p className="text-xs text-muted-foreground">{cmd.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {cmd.aliases.map(alias => (
                          <Badge key={alias} variant="outline" className="text-[10px]">
                            {alias}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default VoiceCommandNavigation;
