import { motion } from 'framer-motion';

const ValueSlider = () => {
  const values = [
    'Zero Advance. Zero Risk.',
    'Masked Identity System.',
    'Global Wallet Payment.',
    'Prime Users Get Priority.',
    '2-Hour Development Promise.',
    'Lifetime Free Updates.',
    'AI Automation Everywhere.',
    'Multi-Role Secure Access.',
    'Real-Time Buzzer Alerts.',
    '40+ Industry Categories.',
  ];

  // Duplicate for seamless loop
  const duplicatedValues = [...values, ...values];

  return (
    <section className="relative py-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,20%,6%)] via-[hsl(220,25%,8%)] to-[hsl(220,20%,6%)]" />
      
      {/* Top and bottom neon lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[hsl(210,100%,55%)/0.3]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[hsl(210,100%,55%)/0.3]" />

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[hsl(220,20%,6%)] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[hsl(220,20%,6%)] to-transparent z-10" />

      <div className="relative">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: [0, '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {duplicatedValues.map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <span
                className="text-lg md:text-xl font-semibold text-transparent bg-clip-text 
                         bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]"
                style={{ textShadow: '0 0 30px hsl(210 100% 55% / 0.3)' }}
              >
                {value}
              </span>
              <span className="w-2 h-2 rounded-full bg-[hsl(45,100%,50%)]"
                    style={{ boxShadow: '0 0 10px hsl(45 100% 50% / 0.6)' }} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValueSlider;
