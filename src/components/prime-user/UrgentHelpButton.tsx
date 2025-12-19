import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertOctagon, Phone, MessageCircle, Zap, Send, Clock } from "lucide-react";
import { toast } from "sonner";

const UrgentHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!urgencyLevel || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Urgent request submitted! A senior team member will contact you within 15 minutes.", {
      duration: 5000,
    });
    
    setIsSubmitting(false);
    setIsOpen(false);
    setUrgencyLevel("");
    setDescription("");
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg shadow-red-500/30 px-6 py-6 rounded-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mr-2"
          >
            <AlertOctagon className="w-5 h-5" />
          </motion.div>
          Urgent Help
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gradient-to-br from-stone-900 to-stone-950 border-red-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertOctagon className="w-6 h-6" />
              Urgent VIP Support
            </DialogTitle>
            <DialogDescription className="text-stone-400">
              As a Prime member, you have access to priority emergency support with guaranteed 15-minute response.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Response Time Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-amber-200 font-medium">15-Minute Response Guarantee</p>
                  <p className="text-sm text-stone-500">A senior team member will contact you</p>
                </div>
              </div>
            </motion.div>

            {/* Urgency Level */}
            <div>
              <label className="text-sm text-stone-400 mb-2 block">Urgency Level</label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger className="bg-stone-800/50 border-stone-700 text-stone-200">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-stone-700">
                  <SelectItem value="critical" className="text-red-400">🔴 Critical - System Down</SelectItem>
                  <SelectItem value="high" className="text-amber-400">🟠 High - Major Issue</SelectItem>
                  <SelectItem value="medium" className="text-yellow-400">🟡 Medium - Important</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-stone-400 mb-2 block">Describe Your Issue</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what you need help with..."
                className="bg-stone-800/50 border-stone-700 text-stone-200 min-h-[100px] placeholder:text-stone-600"
              />
            </div>

            {/* Quick Contact Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                <Phone className="w-4 h-4 mr-2" />
                Request Callback
              </Button>
              <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Urgent Request
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UrgentHelpButton;
