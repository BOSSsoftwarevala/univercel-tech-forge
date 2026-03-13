/**
 * Gamified Deadline Warning Animation
 * 4 stages based on time remaining:
 *   1. >24h  — Developer typing calmly
 *   2. <6h   — Developer typing fast, clock shaking
 *   3. <1h   — Grim reaper appears behind developer
 *   4. passed — Grim reaper taps developer's shoulder
 */

import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo } from 'react';

export type DeadlineStage = 'calm' | 'rush' | 'reaper' | 'overdue';

interface DeadlineReaperAnimationProps {
  /** Time remaining in hours (negative = overdue) */
  hoursRemaining?: number;
  /** Or set stage directly */
  stage?: DeadlineStage;
  /** Width of the component */
  width?: number;
  /** Height of the component */
  height?: number;
  className?: string;
}

function getStageFromHours(hours: number): DeadlineStage {
  if (hours <= 0) return 'overdue';
  if (hours < 1) return 'reaper';
  if (hours < 6) return 'rush';
  return 'calm';
}

/* ── Tiny sub-components ── */

const Desk = () => (
  <g id="desk">
    {/* Desk surface */}
    <rect x="140" y="200" width="160" height="8" rx="2" fill="hsl(220 15% 25%)" />
    {/* Desk legs */}
    <rect x="150" y="208" width="6" height="50" rx="1" fill="hsl(220 15% 20%)" />
    <rect x="284" y="208" width="6" height="50" rx="1" fill="hsl(220 15% 20%)" />
  </g>
);

const Laptop = ({ rushMode }: { rushMode: boolean }) => (
  <g id="laptop">
    {/* Screen */}
    <motion.g
      animate={rushMode ? { rotate: [-1, 1, -1] } : { rotate: 0 }}
      transition={rushMode ? { duration: 0.15, repeat: Infinity } : {}}
      style={{ originX: '220px', originY: '200px' }}
    >
      <rect x="185" y="155" width="70" height="48" rx="4" fill="hsl(220 20% 18%)" stroke="hsl(220 15% 30%)" strokeWidth="2" />
      {/* Screen glow */}
      <rect x="190" y="160" width="60" height="38" rx="2" fill="hsl(200 80% 55%)" opacity="0.15" />
      {/* Code lines on screen */}
      <rect x="195" y="166" width="30" height="2" rx="1" fill="hsl(160 60% 50%)" opacity="0.7" />
      <rect x="195" y="172" width="45" height="2" rx="1" fill="hsl(200 60% 60%)" opacity="0.5" />
      <rect x="195" y="178" width="25" height="2" rx="1" fill="hsl(30 80% 60%)" opacity="0.6" />
      <rect x="195" y="184" width="40" height="2" rx="1" fill="hsl(160 60% 50%)" opacity="0.4" />
      <rect x="195" y="190" width="20" height="2" rx="1" fill="hsl(280 60% 65%)" opacity="0.5" />
    </motion.g>
    {/* Keyboard base */}
    <rect x="180" y="200" width="80" height="4" rx="1" fill="hsl(220 15% 22%)" />
  </g>
);

const Clock = ({ stage }: { stage: DeadlineStage }) => {
  const isUrgent = stage === 'rush' || stage === 'reaper' || stage === 'overdue';
  const color = stage === 'calm' ? 'hsl(160 60% 50%)' 
    : stage === 'rush' ? 'hsl(40 90% 55%)' 
    : 'hsl(0 80% 55%)';

  return (
    <motion.g
      id="clock"
      animate={isUrgent ? { rotate: [-8, 8, -8], x: [0, 2, -2, 0] } : {}}
      transition={isUrgent ? { duration: 0.3, repeat: Infinity } : {}}
      style={{ originX: '310px', originY: '130px' }}
    >
      <circle cx="310" cy="130" r="22" fill="hsl(220 20% 15%)" stroke={color} strokeWidth="2.5" />
      <circle cx="310" cy="130" r="2" fill={color} />
      {/* Hour hand */}
      <motion.line
        x1="310" y1="130" x2="310" y2="116"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
        animate={{ rotate: stage === 'overdue' ? 360 : 0 }}
        transition={stage === 'overdue' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
        style={{ originX: '310px', originY: '130px' }}
      />
      {/* Minute hand */}
      <motion.line
        x1="310" y1="130" x2="322" y2="130"
        stroke={color} strokeWidth="2" strokeLinecap="round"
        animate={isUrgent ? { rotate: 360 } : {}}
        transition={isUrgent ? { duration: stage === 'rush' ? 4 : 1.5, repeat: Infinity, ease: 'linear' } : {}}
        style={{ originX: '310px', originY: '130px' }}
      />
      {/* Alert ring */}
      {isUrgent && (
        <motion.circle
          cx="310" cy="130" r="26"
          fill="none" stroke={color} strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.6, 0], scale: [1, 1.4] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ originX: '310px', originY: '130px' }}
        />
      )}
    </motion.g>
  );
};

/* ── Developer Character ── */
const Developer = ({ stage }: { stage: DeadlineStage }) => {
  const isFast = stage === 'rush' || stage === 'reaper' || stage === 'overdue';
  const isScared = stage === 'reaper' || stage === 'overdue';

  return (
    <g id="developer">
      {/* Chair */}
      <rect x="230" y="210" width="40" height="45" rx="6" fill="hsl(220 15% 22%)" />
      <rect x="240" y="255" width="20" height="8" rx="2" fill="hsl(220 15% 18%)" />

      {/* Body */}
      <motion.g
        animate={isFast ? { y: [-1, 1, -1] } : {}}
        transition={isFast ? { duration: 0.2, repeat: Infinity } : {}}
      >
        {/* Torso */}
        <rect x="235" y="182" width="30" height="35" rx="4" fill="hsl(200 60% 50%)" />
        
        {/* Head */}
        <motion.g
          animate={isScared ? { x: [0, -3, 0] } : {}}
          transition={isScared ? { duration: 0.4, repeat: Infinity } : {}}
        >
          <circle cx="250" cy="168" r="16" fill="hsl(30 50% 70%)" />
          {/* Hair */}
          <path d="M234 162 Q235 148 250 148 Q265 148 266 162" fill="hsl(25 30% 25%)" />
          
          {/* Eyes */}
          {isScared ? (
            <>
              {/* Scared wide eyes */}
              <circle cx="244" cy="170" r="4" fill="white" />
              <circle cx="256" cy="170" r="4" fill="white" />
              <motion.circle
                cx="244" cy="170" r="2" fill="hsl(220 20% 15%)"
                animate={{ cx: [243, 242, 243] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.circle
                cx="256" cy="170" r="2" fill="hsl(220 20% 15%)"
                animate={{ cx: [255, 254, 255] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              {/* Sweat drop */}
              <motion.ellipse
                cx="268" cy="165" rx="2" ry="4"
                fill="hsl(200 80% 70%)"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: [0, 15], opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </>
          ) : (
            <>
              {/* Normal eyes */}
              <circle cx="244" cy="170" r="2.5" fill="hsl(220 20% 15%)" />
              <circle cx="256" cy="170" r="2.5" fill="hsl(220 20% 15%)" />
            </>
          )}

          {/* Mouth */}
          {isScared ? (
            <ellipse cx="250" cy="179" rx="4" ry="3" fill="hsl(220 20% 15%)" />
          ) : (
            <path d="M246 178 Q250 181 254 178" stroke="hsl(220 20% 15%)" strokeWidth="1.5" fill="none" />
          )}

          {/* Glasses */}
          <circle cx="244" cy="170" r="6" fill="none" stroke="hsl(220 15% 40%)" strokeWidth="1.2" />
          <circle cx="256" cy="170" r="6" fill="none" stroke="hsl(220 15% 40%)" strokeWidth="1.2" />
          <line x1="250" y1="170" x2="250" y2="170" stroke="hsl(220 15% 40%)" strokeWidth="1.2" />
        </motion.g>

        {/* Arms typing */}
        <motion.g
          animate={isFast 
            ? { rotate: [-5, 5, -5], y: [-1, 1, -1] }
            : { rotate: [-2, 2, -2] }
          }
          transition={isFast 
            ? { duration: 0.12, repeat: Infinity }
            : { duration: 0.8, repeat: Infinity }
          }
          style={{ originX: '240px', originY: '195px' }}
        >
          <rect x="215" y="193" width="25" height="6" rx="3" fill="hsl(30 50% 70%)" />
        </motion.g>
        <motion.g
          animate={isFast 
            ? { rotate: [5, -5, 5], y: [1, -1, 1] }
            : { rotate: [2, -2, 2] }
          }
          transition={isFast 
            ? { duration: 0.12, repeat: Infinity, delay: 0.06 }
            : { duration: 0.8, repeat: Infinity, delay: 0.4 }
          }
          style={{ originX: '260px', originY: '195px' }}
        >
          <rect x="260" y="193" width="25" height="6" rx="3" fill="hsl(30 50% 70%)" />
        </motion.g>
      </motion.g>
    </g>
  );
};

/* ── Grim Reaper ── */
const GrimReaper = ({ stage }: { stage: 'reaper' | 'overdue' }) => {
  const shouldTap = stage === 'overdue';

  return (
    <motion.g
      id="grim-reaper"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Cloak body */}
      <motion.g
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Main cloak */}
        <path
          d="M80 150 Q75 130 90 120 L110 120 Q125 130 120 150 L130 260 Q105 270 70 260 Z"
          fill="hsl(220 15% 10%)"
        />
        {/* Cloak edges / tattered bottom */}
        <path
          d="M70 255 L75 270 L85 258 L95 272 L105 256 L115 270 L125 258 L130 262"
          fill="hsl(220 15% 8%)"
        />

        {/* Hood */}
        <path
          d="M82 130 Q85 105 100 100 Q115 105 118 130 Q110 135 100 133 Q90 135 82 130 Z"
          fill="hsl(220 15% 8%)"
        />

        {/* Skull face inside hood */}
        <circle cx="100" cy="120" r="10" fill="hsl(45 20% 85%)" />
        {/* Eye sockets */}
        <circle cx="96" cy="118" r="3" fill="hsl(220 15% 8%)" />
        <circle cx="104" cy="118" r="3" fill="hsl(220 15% 8%)" />
        {/* Glowing eyes */}
        <motion.circle
          cx="96" cy="118" r="1.5"
          fill="hsl(0 80% 50%)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="104" cy="118" r="1.5"
          fill="hsl(0 80% 50%)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Nose */}
        <path d="M99 122 L101 122 L100 124 Z" fill="hsl(220 15% 15%)" />
        {/* Teeth */}
        <rect x="95" y="126" width="10" height="3" rx="1" fill="hsl(45 15% 80%)" />
        <line x1="97" y1="126" x2="97" y2="129" stroke="hsl(220 15% 15%)" strokeWidth="0.5" />
        <line x1="99" y1="126" x2="99" y2="129" stroke="hsl(220 15% 15%)" strokeWidth="0.5" />
        <line x1="101" y1="126" x2="101" y2="129" stroke="hsl(220 15% 15%)" strokeWidth="0.5" />
        <line x1="103" y1="126" x2="103" y2="129" stroke="hsl(220 15% 15%)" strokeWidth="0.5" />

        {/* Scythe */}
        <line x1="65" y1="100" x2="65" y2="260" stroke="hsl(220 10% 30%)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M65 100 Q55 85 40 90 Q30 95 35 105 Q38 112 65 115"
          fill="none" stroke="hsl(0 0% 70%)" strokeWidth="2.5"
        />
        {/* Blade shine */}
        <motion.path
          d="M45 95 Q42 100 48 108"
          fill="none" stroke="hsl(0 0% 90%)" strokeWidth="1"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Tapping arm (only when overdue) */}
        {shouldTap && (
          <motion.g
            animate={{ rotate: [-5, 10, -5] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ originX: '118px', originY: '160px' }}
          >
            {/* Bony arm */}
            <rect x="118" y="158" width="110" height="5" rx="2.5" fill="hsl(45 20% 80%)" />
            {/* Bony hand */}
            <circle cx="228" cy="160" r="5" fill="hsl(45 20% 80%)" />
            {/* Finger bones */}
            <rect x="228" y="155" width="8" height="2" rx="1" fill="hsl(45 15% 75%)" />
            <rect x="228" y="159" width="9" height="2" rx="1" fill="hsl(45 15% 75%)" />
            <rect x="228" y="163" width="7" height="2" rx="1" fill="hsl(45 15% 75%)" />
          </motion.g>
        )}

        {/* Speech bubble when overdue */}
        {shouldTap && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <rect x="55" y="65" width="120" height="30" rx="8" fill="hsl(220 20% 18%)" stroke="hsl(0 60% 45%)" strokeWidth="1.5" />
            <polygon points="100,95 108,95 95,102" fill="hsl(220 20% 18%)" stroke="hsl(0 60% 45%)" strokeWidth="1.5" />
            <rect x="94" y="93" width="16" height="5" fill="hsl(220 20% 18%)" />
            <text x="115" y="84" textAnchor="middle" fill="hsl(0 70% 60%)" fontSize="9" fontWeight="700" fontFamily="monospace">
              DEADLINE NOW!
            </text>
          </motion.g>
        )}
      </motion.g>
    </motion.g>
  );
};

/* ── Status Badge ── */
const StatusBadge = ({ stage }: { stage: DeadlineStage }) => {
  const config = {
    calm: { label: '✓ On Track', bg: 'hsl(160 60% 15%)', text: 'hsl(160 60% 60%)', border: 'hsl(160 50% 30%)' },
    rush: { label: '⚡ Hurry Up!', bg: 'hsl(40 60% 12%)', text: 'hsl(40 90% 60%)', border: 'hsl(40 60% 30%)' },
    reaper: { label: '💀 Almost Over', bg: 'hsl(0 50% 12%)', text: 'hsl(0 70% 60%)', border: 'hsl(0 50% 30%)' },
    overdue: { label: '☠ OVERDUE', bg: 'hsl(0 70% 10%)', text: 'hsl(0 80% 60%)', border: 'hsl(0 60% 35%)' },
  };
  const c = config[stage];

  return (
    <motion.g
      key={stage}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <rect x="120" y="10" width="140" height="26" rx="13" fill={c.bg} stroke={c.border} strokeWidth="1.5" />
      <text x="190" y="27" textAnchor="middle" fill={c.text} fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">
        {c.label}
      </text>
    </motion.g>
  );
};

/* ── Particles for urgency ── */
const UrgencyParticles = ({ stage }: { stage: DeadlineStage }) => {
  if (stage === 'calm') return null;

  const count = stage === 'rush' ? 4 : 8;
  const color = stage === 'rush' ? 'hsl(40 90% 55%)' : 'hsl(0 80% 55%)';

  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          cx={60 + Math.random() * 280}
          cy={50 + Math.random() * 200}
          r={1 + Math.random() * 2}
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -20] }}
          transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </g>
  );
};

/* ── Main Component ── */
export default function DeadlineReaperAnimation({
  hoursRemaining = 48,
  stage: stageProp,
  width = 380,
  height = 280,
  className = '',
}: DeadlineReaperAnimationProps) {
  const currentStage = stageProp ?? getStageFromHours(hoursRemaining);

  const bgColor = useMemo(() => {
    switch (currentStage) {
      case 'calm': return 'hsl(220 20% 12%)';
      case 'rush': return 'hsl(225 20% 11%)';
      case 'reaper': return 'hsl(230 25% 9%)';
      case 'overdue': return 'hsl(0 15% 8%)';
    }
  }, [currentStage]);

  const showReaper = currentStage === 'reaper' || currentStage === 'overdue';

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 380 280"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: 12, overflow: 'hidden' }}
      >
        {/* Background */}
        <rect width="380" height="280" fill={bgColor} />
        
        {/* Floor */}
        <rect x="0" y="258" width="380" height="22" fill="hsl(220 15% 15%)" />
        <line x1="0" y1="258" x2="380" y2="258" stroke="hsl(220 15% 20%)" strokeWidth="1" />

        {/* Urgency particles */}
        <UrgencyParticles stage={currentStage} />

        {/* Status badge */}
        <StatusBadge stage={currentStage} />

        {/* Clock */}
        <Clock stage={currentStage} />

        {/* Grim Reaper */}
        <AnimatePresence>
          {showReaper && (
            <GrimReaper stage={currentStage as 'reaper' | 'overdue'} />
          )}
        </AnimatePresence>

        {/* Desk & Laptop */}
        <Desk />
        <Laptop rushMode={currentStage !== 'calm'} />

        {/* Developer */}
        <Developer stage={currentStage} />
      </svg>
    </div>
  );
}
