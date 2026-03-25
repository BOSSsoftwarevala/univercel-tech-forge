import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Upload, FileText, Image, Video, Send, 
  X, Loader2, Sparkles, Camera, Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversalInputBoxProps {
  onSubmit: (
    content: string, 
    type: 'text' | 'voice' | 'file' | 'image' | 'video',
    attachments?: { name: string; type: string; url?: string }[]
  ) => void;
  isProcessing?: boolean;
}

export const UniversalInputBox = ({ onSubmit, isProcessing }: UniversalInputBoxProps) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; type: string; url?: string }[]>([]);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript(transcript);
        setInputText(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (voiceTranscript) {
        toast.success('Voice input captured!');
      }
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    }
  }, [isListening, voiceTranscript]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: { name: string; type: string; url?: string }[] = [];
    
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      newAttachments.push({
        name: file.name,
        type: file.type,
        url,
      });
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    toast.success(`${files.length} file(s) attached`);
    
    if (e.target) e.target.value = '';
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    const content = inputText.trim();
    if (!content && attachments.length === 0) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    // Determine input type
    let type: 'text' | 'voice' | 'file' | 'image' | 'video' = 'text';
    if (voiceTranscript) type = 'voice';
    else if (attachments.some(a => a.type.startsWith('image'))) type = 'image';
    else if (attachments.some(a => a.type.startsWith('video'))) type = 'video';
    else if (attachments.length > 0) type = 'file';

    onSubmit(content || 'See attached files', type, attachments.length > 0 ? attachments : undefined);
    
    // Reset
    setInputText("");
    setVoiceTranscript("");
    setAttachments([]);
  }, [inputText, attachments, voiceTranscript, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const getAttachmentIcon = (type: string) => {
    if (type.startsWith('image')) return <Image className="w-3 h-3" />;
    if (type.startsWith('video')) return <Video className="w-3 h-3" />;
    return <FileText className="w-3 h-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className={cn(
        "rounded-2xl border-2 transition-all duration-300",
        isListening 
          ? "border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/20" 
          : "border-violet-500/30 bg-gradient-to-br from-slate-900/50 to-zinc-900/50 hover:border-violet-500/50"
      )}>
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 border-b border-border/50"
            >
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="flex items-center gap-2 bg-violet-500/20 text-violet-300 pr-1"
                  >
                    {getAttachmentIcon(attachment.type)}
                    <span className="max-w-[150px] truncate text-xs">{attachment.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-0.5 hover:bg-violet-500/30 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Voice Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              disabled={isProcessing}
              className={cn(
                "shrink-0 rounded-xl transition-all",
                isListening 
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" 
                  : "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
              )}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            {/* Text Input */}
            <div className="flex-1">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening... speak now" : "Describe what you want to build, or upload a reference..."}
                disabled={isProcessing}
                className={cn(
                  "min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent text-white placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0",
                  isListening && "text-red-300"
                )}
              />
              
              {/* Voice Transcript Indicator */}
              {isListening && voiceTranscript && (
                <p className="text-xs text-red-400 mt-1 animate-pulse">
                  {voiceTranscript}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              {/* Attachment Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="rounded-xl bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
              >
                <Paperclip className="w-5 h-5" />
              </Button>

              {/* Send Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSubmit}
                disabled={isProcessing || (!inputText.trim() && attachments.length === 0)}
                className={cn(
                  "rounded-xl transition-all",
                  (inputText.trim() || attachments.length > 0)
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-4 pb-3 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => handleFileSelect(e as any);
                input.click();
              }}
              disabled={isProcessing}
              className="text-xs text-muted-foreground hover:text-violet-400"
            >
              <Image className="w-3 h-3 mr-1" />
              Image
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = (e) => handleFileSelect(e as any);
                input.click();
              }}
              disabled={isProcessing}
              className="text-xs text-muted-foreground hover:text-violet-400"
            >
              <Video className="w-3 h-3 mr-1" />
              Video
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.doc,.docx,.txt';
                input.onchange = (e) => handleFileSelect(e as any);
                input.click();
              }}
              disabled={isProcessing}
              className="text-xs text-muted-foreground hover:text-violet-400"
            >
              <FileText className="w-3 h-3 mr-1" />
              Document
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>AI understands any format</span>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
};
