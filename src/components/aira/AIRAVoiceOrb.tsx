/**
 * AIRA Voice Orb — Floating corner avatar with live waveform
 * Shows AIRA's speaking state with a pulsing orb + audio bars
 */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Mic, Square } from "lucide-react";

interface AIRAVoiceOrbProps {
  isSpeaking: boolean;
  isLoadingVoice: boolean;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onStopSpeaking: () => void;
}

export default function AIRAVoiceOrb({
  isSpeaking,
  isLoadingVoice,
  autoSpeak,
  onToggleAutoSpeak,
  onStopSpeaking,
}: AIRAVoiceOrbProps) {
  const isActive = isSpeaking || isLoadingVoice;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {/* Status label */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-violet-500/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              {/* Live waveform bars */}
              <div className="flex items-center gap-[2px]">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{
                      background: `linear-gradient(180deg, hsl(263 70% 60%), hsl(263 70% 40%))`,
                    }}
                    animate={
                      isSpeaking
                        ? {
                            height: [3, 8 + Math.random() * 14, 3],
                          }
                        : { height: [3, 6, 3] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 0.3 + i * 0.08,
                      delay: i * 0.04,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-violet-300 whitespace-nowrap">
                {isLoadingVoice ? "Preparing..." : "AIRA Speaking"}
              </span>
              <button
                onClick={onStopSpeaking}
                className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center 
                  hover:bg-red-500/40 transition-colors"
              >
                <Square className="w-2.5 h-2.5 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Orb */}
      <motion.button
        onClick={isActive ? onStopSpeaking : onToggleAutoSpeak}
        className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer rings when speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <>
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={`ring-${ring}`}
                  className="absolute inset-0 rounded-full border border-violet-400/30"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.3 + ring * 0.25, opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: ring * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Loading ring */}
        {isLoadingVoice && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        )}

        {/* Glass orb background */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-br from-violet-500 via-indigo-600 to-violet-700 shadow-[0_0_30px_8px_hsla(263,70%,50%,0.4)]"
              : autoSpeak
              ? "bg-gradient-to-br from-violet-600/80 via-indigo-700/80 to-slate-800 shadow-[0_0_15px_3px_hsla(263,70%,50%,0.2)]"
              : "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-lg"
          }`}
        />

        {/* Inner glow */}
        <div
          className={`absolute inset-1 rounded-full transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-br from-violet-400/20 to-transparent"
              : "bg-gradient-to-br from-white/5 to-transparent"
          }`}
        />

        {/* Icon */}
        <div className="relative z-10">
          {isSpeaking ? (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Volume2 className="w-6 h-6 text-white drop-shadow-lg" />
            </motion.div>
          ) : isLoadingVoice ? (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Mic className="w-6 h-6 text-violet-200 drop-shadow-lg" />
            </motion.div>
          ) : autoSpeak ? (
            <Volume2 className="w-6 h-6 text-white/90 drop-shadow-lg group-hover:text-white transition-colors" />
          ) : (
            <VolumeX className="w-6 h-6 text-slate-400 drop-shadow-lg group-hover:text-slate-300 transition-colors" />
          )}
        </div>

        {/* AIRA label */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span
            className={`text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
              isActive
                ? "bg-violet-500/30 text-violet-200 backdrop-blur-sm"
                : "bg-slate-800/80 text-slate-500"
            }`}
          >
            AIRA
          </span>
        </div>
      </motion.button>
    </div>
  );
}
