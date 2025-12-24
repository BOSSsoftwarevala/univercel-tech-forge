import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  Globe,
  MessageCircle
} from 'lucide-react';
import softwareValaLogo from '@/assets/software-vala-logo.png';

const footerLinks = {
  products: [
    { label: 'POS System', href: '/demos' },
    { label: 'School ERP', href: '/demos' },
    { label: 'Hospital Management', href: '/demos' },
    { label: 'Real Estate CRM', href: '/demos' },
    { label: 'HRMS', href: '/demos' }
  ],
  company: [
    { label: 'About Us', href: '/demos' },
    { label: 'Contact', href: 'mailto:hellosoftwarevala@gmail.com' },
    { label: 'Support', href: 'https://wa.me/918348838383' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/demos' },
    { label: 'Terms of Service', href: '/demos' }
  ]
};

const socialLinks = [
  { icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com/share/1HpGSvExis', label: 'Facebook' },
  { icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com/new_software_vala', label: 'Instagram' },
  { icon: <MessageCircle className="w-5 h-5" />, href: 'https://wa.me/918348838383', label: 'WhatsApp' },
  { icon: <Youtube className="w-5 h-5" />, href: 'https://youtube.com/@softwarevala', label: 'YouTube' }
];

const HomepageFooter = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="relative pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 overflow-hidden">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-10 sm:mb-12 md:mb-16">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={softwareValaLogo} 
                  alt="Software Vala" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-primary font-semibold text-lg mb-1">The Name of Trust</p>
              <p className="text-muted-foreground max-w-sm mb-6">
                Empowering businesses with next-generation AI solutions. 
                Join the enterprise ecosystem revolution.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a href="mailto:hellosoftwarevala@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hellosoftwarevala@gmail.com</span>
                </a>
                <div className="flex flex-col gap-1">
                  <a href="https://wa.me/918768878787" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+91-8768878787</span>
                  </a>
                  <a href="https://wa.me/918348838383" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors pl-7">
                    <span className="text-sm">+91-8348838383</span>
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <a href="https://softwarevala.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">softwarevala.net (Online)</span>
                  </a>
                  <a href="https://erpvala.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors pl-7">
                    <span className="text-sm">erpvala.com (Offline)</span>
                  </a>
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
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') || link.href.startsWith('mailto') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm relative group"
                    >
                      {link.label}
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
            © {new Date().getFullYear()} SOFTWARE VALA™. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            The Name of Trust • Powered by AI • Built for Enterprise
          </p>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl" />
    </footer>
  );
});

HomepageFooter.displayName = 'HomepageFooter';

export default HomepageFooter;
