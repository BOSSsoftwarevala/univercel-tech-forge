import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Building2, ShoppingCart, Stethoscope, Factory, Utensils,
  Car, Plane, Home, Briefcase, Dumbbell, Scissors, Camera, Music,
  Gamepad2, BookOpen, Leaf, PiggyBank, Scale, Tv, Radio, Newspaper,
  Shirt, Gem, Coffee, Wine, Baby, Dog, Flower2, Paintbrush, Hammer,
  Wrench, Truck, Ship, Train, Bike, Mountain, Tent, Umbrella, Gift, Heart
} from 'lucide-react';

const CategoryGrid = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { icon: GraduationCap, name: 'Education', demos: 12, subtypes: ['School', 'College', 'Coaching', 'E-Learning'] },
    { icon: Building2, name: 'Real Estate', demos: 9, subtypes: ['Residential', 'Commercial', 'Rental', 'Property Mgmt'] },
    { icon: ShoppingCart, name: 'E-Commerce', demos: 15, subtypes: ['B2C', 'B2B', 'Marketplace', 'Multi-vendor'] },
    { icon: Stethoscope, name: 'Healthcare', demos: 11, subtypes: ['Hospital', 'Clinic', 'Pharmacy', 'Lab'] },
    { icon: Factory, name: 'Manufacturing', demos: 8, subtypes: ['ERP', 'Inventory', 'Quality', 'Production'] },
    { icon: Utensils, name: 'Restaurant', demos: 14, subtypes: ['POS', 'Delivery', 'Reservation', 'Multi-branch'] },
    { icon: Car, name: 'Automotive', demos: 7, subtypes: ['Dealership', 'Service', 'Parts', 'Rental'] },
    { icon: Plane, name: 'Travel', demos: 10, subtypes: ['Booking', 'Tour', 'Agency', 'Hotel'] },
    { icon: Home, name: 'Home Services', demos: 6, subtypes: ['Cleaning', 'Repair', 'Moving', 'Security'] },
    { icon: Briefcase, name: 'Professional', demos: 13, subtypes: ['Law', 'Accounting', 'Consulting', 'HR'] },
    { icon: Dumbbell, name: 'Fitness', demos: 9, subtypes: ['Gym', 'Yoga', 'Personal Training', 'Nutrition'] },
    { icon: Scissors, name: 'Salon & Spa', demos: 8, subtypes: ['Hair', 'Beauty', 'Massage', 'Nail'] },
    { icon: Camera, name: 'Photography', demos: 5, subtypes: ['Studio', 'Event', 'Product', 'Portrait'] },
    { icon: Music, name: 'Entertainment', demos: 7, subtypes: ['Events', 'Ticketing', 'Venue', 'Artist'] },
    { icon: Gamepad2, name: 'Gaming', demos: 4, subtypes: ['Arcade', 'Esports', 'Streaming', 'Tournament'] },
    { icon: BookOpen, name: 'Publishing', demos: 6, subtypes: ['News', 'Magazine', 'Blog', 'Book'] },
    { icon: Leaf, name: 'Agriculture', demos: 5, subtypes: ['Farm', 'Dairy', 'Livestock', 'Agritech'] },
    { icon: PiggyBank, name: 'Finance', demos: 11, subtypes: ['Banking', 'Insurance', 'Investment', 'Lending'] },
    { icon: Scale, name: 'Legal', demos: 6, subtypes: ['Law Firm', 'Court', 'Contract', 'Compliance'] },
    { icon: Tv, name: 'Media', demos: 8, subtypes: ['Streaming', 'OTT', 'Production', 'Distribution'] },
    { icon: Radio, name: 'Telecom', demos: 4, subtypes: ['ISP', 'Mobile', 'Cable', 'VoIP'] },
    { icon: Newspaper, name: 'News Portal', demos: 5, subtypes: ['Daily', 'Magazine', 'Local', 'Sports'] },
    { icon: Shirt, name: 'Fashion', demos: 9, subtypes: ['Retail', 'Boutique', 'Designer', 'Wholesale'] },
    { icon: Gem, name: 'Jewelry', demos: 6, subtypes: ['Retail', 'Custom', 'Wholesale', 'Repair'] },
    { icon: Coffee, name: 'Cafe', demos: 7, subtypes: ['Coffee Shop', 'Bakery', 'Tea House', 'Dessert'] },
    { icon: Wine, name: 'Nightlife', demos: 4, subtypes: ['Bar', 'Club', 'Lounge', 'Brewery'] },
    { icon: Baby, name: 'Childcare', demos: 5, subtypes: ['Daycare', 'Preschool', 'Nanny', 'Activity'] },
    { icon: Dog, name: 'Pet Services', demos: 6, subtypes: ['Grooming', 'Boarding', 'Vet', 'Store'] },
    { icon: Flower2, name: 'Florist', demos: 4, subtypes: ['Retail', 'Event', 'Subscription', 'Garden'] },
    { icon: Paintbrush, name: 'Art & Design', demos: 5, subtypes: ['Gallery', 'Studio', 'Interior', 'Graphic'] },
    { icon: Hammer, name: 'Construction', demos: 7, subtypes: ['Contractor', 'Architecture', 'Material', 'Project'] },
    { icon: Wrench, name: 'Maintenance', demos: 6, subtypes: ['HVAC', 'Plumbing', 'Electrical', 'General'] },
    { icon: Truck, name: 'Logistics', demos: 9, subtypes: ['Shipping', 'Courier', 'Warehouse', 'Fleet'] },
    { icon: Ship, name: 'Marine', demos: 3, subtypes: ['Charter', 'Marina', 'Supplies', 'Tours'] },
    { icon: Train, name: 'Transport', demos: 5, subtypes: ['Taxi', 'Bus', 'Rail', 'Rideshare'] },
    { icon: Bike, name: 'Sports', demos: 7, subtypes: ['Club', 'Academy', 'Equipment', 'Events'] },
    { icon: Mountain, name: 'Adventure', demos: 4, subtypes: ['Trekking', 'Camping', 'Water Sports', 'Sky'] },
    { icon: Tent, name: 'Events', demos: 8, subtypes: ['Wedding', 'Corporate', 'Concert', 'Festival'] },
    { icon: Umbrella, name: 'Insurance', demos: 5, subtypes: ['Health', 'Life', 'Auto', 'Property'] },
    { icon: Gift, name: 'Gifting', demos: 4, subtypes: ['Retail', 'Corporate', 'Personalized', 'Subscription'] },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,25%,4%)] to-[hsl(220,20%,6%)]" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore <span className="text-[hsl(210,100%,55%)]">40+ Categories</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Find the perfect solution for your industry with our comprehensive demo library
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="relative group"
              onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
              onMouseEnter={() => window.innerWidth > 768 && setExpandedCategory(category.name)}
              onMouseLeave={() => window.innerWidth > 768 && setExpandedCategory(null)}
            >
              <div className={`
                relative p-4 rounded-xl cursor-pointer transition-all duration-300
                bg-card border border-border/30
                hover:border-primary/60 hover:bg-card/80
                ${expandedCategory === category.name ? 'shadow-[0_0_30px_hsl(var(--primary)/0.3)] border-primary/50' : ''}
              `}>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center
                              bg-primary/10 border border-primary/20
                              group-hover:bg-primary/20 transition-colors">
                  <category.icon className="w-6 h-6 text-primary"
                                 style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.5))' }} />
                </div>

                {/* Name */}
                <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>

                {/* Demo count button */}
                <button className="text-xs px-2 py-1 rounded-md border border-amber-500/40
                                 text-amber-400 bg-amber-500/10
                                 hover:bg-amber-500/20 transition-colors">
                  {category.demos} Demos
                </button>

                {/* Subtypes slide-out */}
                <AnimatePresence>
                  {expandedCategory === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl z-50
                               bg-popover border border-primary/30
                               shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                    >
                      <div className="flex flex-wrap gap-2">
                        {category.subtypes.map((subtype) => (
                          <span
                            key={subtype}
                            className="text-xs px-2 py-1 rounded-md bg-primary/10
                                     text-primary border border-primary/20
                                     hover:bg-primary/20 cursor-pointer transition-colors"
                          >
                            {subtype}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
