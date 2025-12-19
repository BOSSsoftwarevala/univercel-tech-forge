import { motion } from 'framer-motion';
import { Globe, MapPin } from 'lucide-react';

const countries = [
  { name: 'India', flag: '🇮🇳', region: 'South Asia' },
  { name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { name: 'Kenya', flag: '🇰🇪', region: 'East Africa' },
  { name: 'Burundi', flag: '🇧🇮', region: 'East Africa' },
  { name: 'Liberia', flag: '🇱🇷', region: 'West Africa' },
  { name: 'South Sudan', flag: '🇸🇸', region: 'East Africa' },
  { name: 'Philippines', flag: '🇵🇭', region: 'Southeast Asia' },
];

const GlobalReach = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-6"
          >
            <Globe className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-mono font-bold mb-4">
            <span className="text-foreground">We Are Now</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-neon-teal to-neon-blue bg-clip-text text-transparent">
              GLOBAL
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expanding our reach across continents with trusted partners worldwide
          </p>
        </motion.div>

        {/* Globe Animation + Countries Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
              />
              
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-neon-teal/40"
              />
              
              {/* Inner globe */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 via-background to-neon-blue/20 border border-primary/50 flex items-center justify-center overflow-hidden">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 border border-primary/20 rounded-full"
                      style={{ transform: `rotateX(${i * 30}deg)` }}
                    />
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`v-${i}`}
                      className="absolute top-0 bottom-0 left-1/2 w-px bg-primary/20"
                      style={{ transform: `rotateY(${i * 22.5}deg)` }}
                    />
                  ))}
                </div>
                
                {/* Center text */}
                <div className="text-center z-10">
                  <p className="text-5xl font-mono font-bold text-primary">7+</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Countries</p>
                </div>
              </div>

              {/* Floating country markers */}
              {countries.slice(0, 6).map((country, i) => {
                const angle = (i * 60) * (Math.PI / 180);
                const radius = 45;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                
                return (
                  <motion.div
                    key={country.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="absolute w-10 h-10 flex items-center justify-center"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-10 h-10 rounded-full bg-background/80 border border-primary/50 flex items-center justify-center text-xl backdrop-blur-sm shadow-lg shadow-primary/20"
                    >
                      {country.flag}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Countries List */}
          <div className="space-y-4">
            {countries.map((country, i) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 10, backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm cursor-pointer transition-colors"
              >
                <span className="text-4xl">{country.flag}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{country.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {country.region}
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '11,850+', label: 'Software Products' },
            { value: '2,850+', label: 'Active Resellers' },
            { value: '52+', label: 'Global Franchises' },
            { value: '7+', label: 'Countries' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-card/50 to-card/30 border border-border/50 backdrop-blur-sm"
            >
              <p className="text-3xl sm:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-neon-teal bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalReach;
