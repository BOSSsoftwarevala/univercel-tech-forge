import { motion } from 'framer-motion';
import { FileText, MapPin, CreditCard, Bot, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Apply',
    description: 'Fill out the franchise application form with your details and preferred territory.'
  },
  {
    icon: MapPin,
    title: 'Verify Territory',
    description: 'Our team verifies territory availability and confirms your exclusive zone.'
  },
  {
    icon: CreditCard,
    title: 'Pay & Activate',
    description: 'Complete the payment to activate your franchise account and access.'
  },
  {
    icon: Bot,
    title: 'AI Setup Complete',
    description: 'AI configures your dashboard, leads, and sales automation instantly.'
  }
];

const ApplicationProcess = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="process">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Application <span className="text-primary">Process</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started in four simple steps
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />
            
            {/* Steps */}
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative text-center"
                  >
                    {/* Step Number */}
                    <motion.div
                      className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-neon-teal/20 border-2 border-primary/50 mb-4 mx-auto"
                      whileHover={{ scale: 1.1 }}
                      animate={{
                        boxShadow: [
                          '0 0 20px hsla(187, 100%, 50%, 0.2)',
                          '0 0 40px hsla(187, 100%, 50%, 0.4)',
                          '0 0 20px hsla(187, 100%, 50%, 0.2)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <IconComponent className="w-7 h-7 text-primary" />
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-background">{index + 1}</span>
                      </div>
                    </motion.div>

                    {/* Hologram Checkmark */}
                    <motion.div
                      className="absolute top-0 right-1/4 opacity-0"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 0.5, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <CheckCircle className="w-5 h-5 text-neon-green" />
                    </motion.div>

                    <h3 className="font-mono font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                    {/* Arrow to next step */}
                    {index < steps.length - 1 && (
                      <motion.div
                        className="hidden md:block absolute top-8 -right-4 transform translate-x-1/2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <svg className="w-8 h-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationProcess;
