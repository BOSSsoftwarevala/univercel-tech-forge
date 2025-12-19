import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

const ResellerFooter = () => {
  return (
    <footer className="relative pt-16 pb-8 border-t border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-lg text-foreground">SOFTWARE VALA</h3>
                <p className="text-xs text-neon-blue">Reseller Program</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Earn passive income by sharing products. Zero skills required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-mono font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Benefits', 'Earnings', 'Tools', 'How It Works', 'Join Now'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-mono font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-neon-blue" />
                reseller@softwarevala.com
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-neon-blue" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-neon-blue" />
                Mumbai, India
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="text-center pt-8 border-t border-border/20">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Software Vala. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ResellerFooter;
