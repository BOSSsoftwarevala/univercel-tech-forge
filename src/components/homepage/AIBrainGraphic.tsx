import { motion } from 'framer-motion';

const AIBrainGraphic = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(187, 100%, 50%, 0.1) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Rotating Ring 1 */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full border border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[0, 90, 180, 270].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-3 h-3 rounded-full bg-primary"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${angle}deg) translateX(200px) translateY(-50%)`
            }}
            animate={{
              boxShadow: [
                '0 0 10px hsl(187, 100%, 50%)',
                '0 0 30px hsl(187, 100%, 50%)',
                '0 0 10px hsl(187, 100%, 50%)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: angle / 360 }}
          />
        ))}
      </motion.div>

      {/* Rotating Ring 2 */}
      <motion.div
        className="absolute w-[320px] h-[320px] rounded-full border border-neon-teal/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {[45, 135, 225, 315].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-2 h-2 rounded-full bg-neon-teal"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${angle}deg) translateX(160px) translateY(-50%)`
            }}
          />
        ))}
      </motion.div>

      {/* AI Brain Core */}
      <div className="relative w-[250px] h-[250px]">
        {/* Brain outline */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(187, 100%, 50%)" />
              <stop offset="50%" stopColor="hsl(174, 100%, 45%)" />
              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Brain hemispheres */}
          <motion.path
            d="M100 30 C60 30 40 60 40 90 C40 120 60 150 100 170 C140 150 160 120 160 90 C160 60 140 30 100 30"
            fill="none"
            stroke="url(#brainGrad)"
            strokeWidth="2"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Neural pathways */}
          {[
            "M70 60 Q100 80 130 60",
            "M60 90 Q100 110 140 90",
            "M70 120 Q100 140 130 120",
            "M80 50 Q80 100 80 150",
            "M120 50 Q120 100 120 150",
            "M100 40 Q100 100 100 160"
          ].map((path, i) => (
            <motion.path
              key={i}
              d={path}
              fill="none"
              stroke="url(#brainGrad)"
              strokeWidth="1"
              opacity={0.6}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 * i, ease: "easeInOut" }}
            />
          ))}

          {/* Pulse nodes */}
          {[
            { cx: 70, cy: 60 },
            { cx: 130, cy: 60 },
            { cx: 60, cy: 90 },
            { cx: 140, cy: 90 },
            { cx: 100, cy: 100 },
            { cx: 70, cy: 120 },
            { cx: 130, cy: 120 }
          ].map((node, i) => (
            <motion.circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="hsl(187, 100%, 50%)"
              filter="url(#glow)"
              animate={{
                r: [4, 6, 4],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </svg>

        {/* Center AI Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-mono text-3xl font-bold text-primary">AI</span>
          </motion.div>
        </div>
      </div>

      {/* Floating Data Spheres */}
      {[
        { x: -180, y: -100, size: 30, delay: 0 },
        { x: 180, y: -80, size: 25, delay: 0.5 },
        { x: -150, y: 120, size: 20, delay: 1 },
        { x: 160, y: 100, size: 28, delay: 1.5 }
      ].map((sphere, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: sphere.size,
            height: sphere.size,
            left: `calc(50% + ${sphere.x}px)`,
            top: `calc(50% + ${sphere.y}px)`,
            background: 'linear-gradient(135deg, hsla(187, 100%, 50%, 0.3), hsla(217, 91%, 60%, 0.1))',
            border: '1px solid hsla(187, 100%, 50%, 0.5)'
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: sphere.delay
          }}
        />
      ))}

      {/* Circuit Elements */}
      {[
        { x: -200, y: 0, rotation: 45 },
        { x: 200, y: 20, rotation: -45 },
        { x: -100, y: 180, rotation: 0 },
        { x: 100, y: -180, rotation: 90 }
      ].map((circuit, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `calc(50% + ${circuit.x}px)`,
            top: `calc(50% + ${circuit.y}px)`,
            transform: `rotate(${circuit.rotation}deg)`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="w-2 h-2 rounded-full bg-primary/50 absolute right-0 top-1/2 -translate-y-1/2" />
        </motion.div>
      ))}

      {/* Hologram Scan Effect */}
      <motion.div
        className="absolute w-[300px] h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        style={{ left: 'calc(50% - 150px)' }}
        animate={{
          top: ['20%', '80%', '20%']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AIBrainGraphic;
