import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MaskedUser {
  maskedId: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  country: string;
  countryFlag: string;
}

interface ChatMessageData {
  id: string;
  sender: MaskedUser;
  content: string;
  translatedContent?: string;
  timestamp: Date;
  isOwn?: boolean;
  isVoiceNote?: boolean;
  originalLanguage?: string;
}

interface OptimizedChatMessageProps {
  message: ChatMessageData;
  index: number;
  showTranslation: boolean;
  formatTime: (date: Date) => string;
}

// Memoized message component to prevent unnecessary re-renders
const OptimizedChatMessage = memo(({
  message,
  index,
  showTranslation,
  formatTime
}: OptimizedChatMessageProps) => {
  // Memoize time formatting
  const formattedTime = useMemo(() => formatTime(message.timestamp), [message.timestamp, formatTime]);
  
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }} // Cap animation delay
      className={`mb-4 flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] ${message.isOwn ? 'order-2' : ''}`}>
        {/* Sender Info */}
        <div className={`flex items-center gap-2 mb-1 ${message.isOwn ? 'justify-end' : ''}`}>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${message.sender.color}`}>
            <span className="text-base">{message.sender.countryFlag}</span>
            {message.sender.icon}
            <span className="font-mono font-medium">{message.sender.maskedId}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {formattedTime}
          </span>
          {message.isVoiceNote && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 bg-purple-500/10 text-purple-400 border-purple-500/30">
              <Volume2 className="w-2.5 h-2.5 mr-0.5" />
              Voice
            </Badge>
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={`rounded-2xl px-4 py-2.5 ${
          message.isOwn 
            ? 'bg-primary text-primary-foreground rounded-br-sm' 
            : 'bg-slate-800 text-foreground rounded-bl-sm'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          {showTranslation && message.translatedContent && (
            <p className="text-xs mt-1.5 pt-1.5 border-t border-white/10 text-muted-foreground italic">
              {message.translatedContent}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.showTranslation === nextProps.showTranslation &&
    prevProps.index === nextProps.index
  );
});

OptimizedChatMessage.displayName = 'OptimizedChatMessage';

export default OptimizedChatMessage;
