import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import softwareValaLogo from '@/assets/software-vala-logo.png';

const FranchiseLandingFooter = () => {
  return (
    <footer className="relative pt-16 pb-8 border-t border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={softwareValaLogo} 
                alt="Software Vala" 
                className="h-10 w-auto object-contain"
              />
              <p className="text-xs text-primary">Franchise Program</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering entrepreneurs with AI-powered tech business opportunities.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-mono font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Benefits', 'Earnings', 'Features', 'Process', 'Apply Now'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => {
                      const targetId = link.toLowerCase().replace(' ', '-');
                      const element = document.getElementById(targetId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-mono font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                franchise@softwarevala.com
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
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

export default FranchiseLandingFooter;
