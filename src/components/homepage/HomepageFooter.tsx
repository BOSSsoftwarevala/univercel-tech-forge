import { motion } from 'framer-motion';
import { 
  Zap, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const footerLinks = {
  products: ['POS System', 'School ERP', 'Hospital Management', 'Real Estate CRM', 'HRMS'],
  company: ['About Us', 'Careers', 'Press', 'Blog', 'Contact'],
  resources: ['Documentation', 'API Reference', 'Tutorials', 'Case Studies', 'Webinars'],
  legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
};

const socialLinks = [
  { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
  { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
  { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
  { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
  { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' }
];

const HomepageFooter = () => {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
                    <Zap className="w-6 h-6 text-background" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-primary/30 blur-xl -z-10" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-xl text-foreground">SOFTWARE VALA</h3>
                  <p className="text-xs text-primary tracking-[0.3em] uppercase">AI Powered</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                Empowering businesses with next-generation AI solutions. 
                Join the enterprise ecosystem revolution.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a href="mailto:contact@softwarevala.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">contact@softwarevala.com</span>
                </a>
                <a href="tel:+919876543210" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 98765 43210</span>
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Mumbai, India</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h4 className="font-mono font-semibold text-foreground mb-4 uppercase text-sm tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm relative group"
                    >
                      {link}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links & Language */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-border/30"
        >
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-6">
            <select className="bg-secondary/50 border border-border/30 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:border-primary/50 focus:border-primary focus:outline-none">
              <option>English</option>
              <option>हिंदी</option>
              <option>Español</option>
              <option>العربية</option>
            </select>
            <select className="bg-secondary/50 border border-border/30 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:border-primary/50 focus:border-primary focus:outline-none">
              <option>₹ INR</option>
              <option>$ USD</option>
              <option>€ EUR</option>
              <option>£ GBP</option>
            </select>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-border/20"
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Software Vala. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Powered by AI • Built for Enterprise • Designed for Success
          </p>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl" />
    </footer>
  );
};

export default HomepageFooter;
