import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoginMascotProps {
  isPasswordFocused: boolean;
  emailLength?: number;
}

const LoginMascot = ({ isPasswordFocused, emailLength = 0 }: LoginMascotProps) => {
  const eyeControls = useAnimation();
  const handControls = useAnimation();
  
  // Eye tracking based on email length (simulate looking at cursor)
  const eyeOffsetX = Math.min(Math.max((emailLength - 10) * 0.3, -4), 4);

  useEffect(() => {
    if (isPasswordFocused) {
      // Cover eyes animation
      handControls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeOut' }
      });
      eyeControls.start({
        scaleY: 0.1,
        transition: { duration: 0.2 }
      });
    } else {
      // Uncover eyes
      handControls.start({
        y: 20,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeIn' }
      });
      eyeControls.start({
        scaleY: 1,
        transition: { duration: 0.3, delay: 0.1 }
      });
    }
  }, [isPasswordFocused, handControls, eyeControls]);

  return (
    <div className="flex justify-center mb-6">
      <motion.svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        {/* Background circle */}
        <circle cx="70" cy="70" r="65" fill="hsl(200, 60%, 92%)" />
        <circle cx="70" cy="70" r="65" fill="none" stroke="hsl(200, 50%, 78%)" strokeWidth="2.5" />
        
        {/* Body */}
        <ellipse cx="70" cy="115" rx="35" ry="18" fill="hsl(200, 60%, 92%)" />
        <path
          d="M 35 100 Q 35 80 50 75 Q 60 72 70 72 Q 80 72 90 75 Q 105 80 105 100 Q 105 115 70 120 Q 35 115 35 100Z"
          fill="hsl(200, 50%, 85%)"
          stroke="hsl(200, 50%, 70%)"
          strokeWidth="2"
        />

        {/* Head */}
        <ellipse cx="70" cy="58" rx="32" ry="30" fill="white" stroke="hsl(200, 50%, 70%)" strokeWidth="2" />

        {/* Spiky hair */}
        <path
          d="M 42 42 L 45 28 L 52 40 L 55 25 L 62 38 L 66 22 L 72 36 L 78 24 L 82 38 L 88 27 L 92 40 L 96 30 L 98 44"
          fill="none"
          stroke="hsl(200, 50%, 70%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ears */}
        <ellipse cx="38" cy="58" rx="6" ry="8" fill="white" stroke="hsl(200, 50%, 70%)" strokeWidth="2" />
        <ellipse cx="102" cy="58" rx="6" ry="8" fill="white" stroke="hsl(200, 50%, 70%)" strokeWidth="2" />

        {/* Eyes - animated */}
        <motion.g animate={eyeControls}>
          {/* Left eye */}
          <motion.ellipse
            cx={58 + eyeOffsetX}
            cy="55"
            rx="4"
            ry="5"
            fill="hsl(200, 50%, 35%)"
          />
          {/* Left pupil */}
          <motion.circle
            cx={59 + eyeOffsetX * 0.8}
            cy="54"
            r="1.5"
            fill="white"
          />
          {/* Right eye */}
          <motion.ellipse
            cx={82 + eyeOffsetX}
            cy="55"
            rx="4"
            ry="5"
            fill="hsl(200, 50%, 35%)"
          />
          {/* Right pupil */}
          <motion.circle
            cx={83 + eyeOffsetX * 0.8}
            cy="54"
            r="1.5"
            fill="white"
          />
        </motion.g>

        {/* Eyebrows */}
        <motion.path
          d={isPasswordFocused 
            ? "M 52 46 Q 58 44 64 46" 
            : "M 52 47 Q 58 43 64 47"
          }
          fill="none"
          stroke="hsl(200, 50%, 55%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.path
          d={isPasswordFocused 
            ? "M 76 46 Q 82 44 88 46" 
            : "M 76 47 Q 82 43 88 47"
          }
          fill="none"
          stroke="hsl(200, 50%, 55%)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M 68 60 Q 70 63 72 60"
          fill="none"
          stroke="hsl(200, 50%, 70%)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Mouth */}
        <motion.path
          d={isPasswordFocused 
            ? "M 62 68 Q 70 70 78 68" 
            : "M 60 67 Q 70 74 80 67"
          }
          fill="none"
          stroke="hsl(200, 50%, 55%)"
          strokeWidth="2"
          strokeLinecap="round"
          transition={{ duration: 0.3 }}
        />

        {/* Hands covering eyes - animated */}
        <motion.g
          initial={{ y: 20, opacity: 0 }}
          animate={handControls}
        >
          {/* Left hand */}
          <ellipse cx="55" cy="55" rx="14" ry="10" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          {/* Left fingers */}
          <circle cx="46" cy="52" r="4" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          <circle cx="50" cy="48" r="3.5" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          <circle cx="56" cy="47" r="3.5" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          <circle cx="62" cy="48" r="3.5" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          
          {/* Right hand */}
          <ellipse cx="85" cy="55" rx="14" ry="10" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          {/* Right fingers */}
          <circle cx="78" cy="48" r="3.5" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          <circle cx="84" cy="47" r="3.5" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          <circle cx="90" cy="48" r="3.5" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
          <circle cx="94" cy="52" r="4" fill="hsl(200, 50%, 85%)" stroke="hsl(200, 50%, 70%)" strokeWidth="1.5" />
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default LoginMascot;
