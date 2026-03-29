import { motion } from 'framer-motion';
import { 
  Link2, 
  QrCode, 
  PlayCircle, 
  FileText, 
  Bot, 
  Wallet,
  GraduationCap,
  TrendingUp
} from 'lucide-react';

const tools = [
  { icon: Link2, label: 'Affiliate Link Creator' },
  { icon: QrCode, label: 'QR Code Generator' },
  { icon: PlayCircle, label: 'Auto Demo Preview' },
  { icon: FileText, label: 'Lead Capture Forms' },
  { icon: Bot, label: 'AI Reply Assistant' },
  { icon: Wallet, label: 'Wallet Payout' },
  { icon: GraduationCap, label: 'Training Library' },
  { icon: TrendingUp, label: 'Territory Escalation' }
];

const SellingTools = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="tools">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Selling <span className="text-neon-blue">Tools</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to maximize your sales without any effort
          </p>
        </motion.div>

        {/* Hex Grid */}
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group"
              >
                <motion.div
                  className="relative w-28 h-32 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Hexagon SVG */}
                  <svg viewBox="0 0 100 115" className="w-full h-full">
                    <defs>
                      <linearGradient id={`toolHexGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id={`toolHexStroke-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                        <stop offset="100%" stopColor="hsl(187, 100%, 50%)" />
                      </linearGradient>
                    </defs>
                    
                    <motion.path
                      d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                      fill={`url(#toolHexGrad-${index})`}
                      stroke={`url(#toolHexStroke-${index})`}
                      strokeWidth="2"
                      className="transition-all duration-300"
                      initial={{ strokeOpacity: 0.3 }}
                      whileHover={{ strokeOpacity: 1 }}
                    />
                    
                    {/* Glow on hover */}
                    <motion.path
                      d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                      fill="none"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth="4"
                      className="opacity-0 group-hover:opacity-50 blur-sm transition-opacity"
                    />
                  </svg>

                  {/* Icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
                    >
                      <IconComponent className="w-8 h-8 text-neon-blue mb-1" />
                    </motion.div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors text-center px-2 leading-tight">
                      {tool.label}
                    </span>
                  </div>

                  {/* Pulse on Hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={false}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-neon-blue/20 blur-xl"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Background Hex Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexPatternTools" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M5 0 L10 2.5 L10 7.5 L5 10 L0 7.5 L0 2.5 Z" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.2" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#hexPatternTools)" />
        </svg>
      </div>
    </section>
  );
};

export default SellingTools;
