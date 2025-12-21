import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Building2, ShoppingCart, Stethoscope, Factory, Utensils,
  Car, Plane, Home, Briefcase, Dumbbell, Scissors, Camera, Music,
  Gamepad2, BookOpen, Leaf, PiggyBank, Scale, Tv, Radio, Newspaper,
  Shirt, Gem, Coffee, Wine, Baby, Dog, Flower2, Paintbrush, Hammer,
  Wrench, Truck, Ship, Train, Bike, Mountain, Tent, Umbrella, Gift, CreditCard
} from 'lucide-react';

const MasterCategoryWall = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    { icon: CreditCard, name: 'POS & Billing', slug: 'pos-billing', demos: 9, tech: 'PHP/Node', subtypes: ['Retail POS', 'Restaurant POS', 'Pharma POS', 'Salon POS'] },
    { icon: GraduationCap, name: 'Education', slug: 'education', demos: 12, tech: 'React/Node', subtypes: ['School ERP', 'College', 'Coaching', 'E-Learning'] },
    { icon: Building2, name: 'Real Estate', slug: 'real-estate', demos: 9, tech: 'React/Laravel', subtypes: ['Residential', 'Commercial', 'Rental', 'Property Mgmt'] },
    { icon: ShoppingCart, name: 'E-Commerce', slug: 'ecommerce', demos: 15, tech: 'Next.js/Node', subtypes: ['B2C Store', 'B2B Portal', 'Marketplace', 'Multi-vendor'] },
    { icon: Stethoscope, name: 'Healthcare', slug: 'healthcare', demos: 11, tech: 'React/Spring', subtypes: ['Hospital', 'Clinic', 'Pharmacy', 'Lab'] },
    { icon: Factory, name: 'Manufacturing', slug: 'manufacturing', demos: 8, tech: 'Java/React', subtypes: ['ERP', 'Inventory', 'Quality', 'Production'] },
    { icon: Utensils, name: 'Restaurant', slug: 'restaurant', demos: 14, tech: 'React/Node', subtypes: ['POS', 'Delivery', 'Reservation', 'Multi-branch'] },
    { icon: Car, name: 'Automotive', slug: 'automotive', demos: 7, tech: 'PHP/Vue', subtypes: ['Dealership', 'Service', 'Parts', 'Rental'] },
    { icon: Plane, name: 'Travel & Tourism', slug: 'travel', demos: 10, tech: 'React/Python', subtypes: ['Booking', 'Tour', 'Agency', 'Hotel'] },
    { icon: Home, name: 'Home Services', slug: 'home-services', demos: 6, tech: 'React/Node', subtypes: ['Cleaning', 'Repair', 'Moving', 'Security'] },
    { icon: Briefcase, name: 'Professional', slug: 'professional', demos: 13, tech: 'React/Django', subtypes: ['Law Firm', 'Accounting', 'Consulting', 'HR'] },
    { icon: Dumbbell, name: 'Fitness & Gym', slug: 'fitness', demos: 9, tech: 'React/Node', subtypes: ['Gym', 'Yoga', 'Personal Training', 'Nutrition'] },
    { icon: Scissors, name: 'Salon & Spa', slug: 'salon-spa', demos: 8, tech: 'Vue/Laravel', subtypes: ['Hair Salon', 'Beauty', 'Massage', 'Nail'] },
    { icon: Camera, name: 'Photography', slug: 'photography', demos: 5, tech: 'React/Node', subtypes: ['Studio', 'Event', 'Product', 'Portrait'] },
    { icon: Music, name: 'Entertainment', slug: 'entertainment', demos: 7, tech: 'React/Node', subtypes: ['Events', 'Ticketing', 'Venue', 'Artist'] },
    { icon: Gamepad2, name: 'Gaming', slug: 'gaming', demos: 4, tech: 'React/Node', subtypes: ['Arcade', 'Esports', 'Streaming', 'Tournament'] },
    { icon: BookOpen, name: 'Publishing', slug: 'publishing', demos: 6, tech: 'Next.js/Node', subtypes: ['News Portal', 'Magazine', 'Blog', 'Book Store'] },
    { icon: Leaf, name: 'Agriculture', slug: 'agriculture', demos: 5, tech: 'React/Python', subtypes: ['Farm Mgmt', 'Dairy', 'Livestock', 'Agritech'] },
    { icon: PiggyBank, name: 'Finance & Banking', slug: 'finance', demos: 11, tech: 'React/Java', subtypes: ['Banking', 'Insurance', 'Investment', 'Lending'] },
    { icon: Scale, name: 'Legal', slug: 'legal', demos: 6, tech: 'React/Node', subtypes: ['Law Firm', 'Court', 'Contract', 'Compliance'] },
    { icon: Tv, name: 'Media & OTT', slug: 'media', demos: 8, tech: 'React/Node', subtypes: ['Streaming', 'OTT', 'Production', 'Distribution'] },
    { icon: Radio, name: 'Telecom', slug: 'telecom', demos: 4, tech: 'React/Java', subtypes: ['ISP', 'Mobile', 'Cable', 'VoIP'] },
    { icon: Newspaper, name: 'News Portal', slug: 'news', demos: 5, tech: 'Next.js/Node', subtypes: ['Daily News', 'Magazine', 'Local', 'Sports'] },
    { icon: Shirt, name: 'Fashion', slug: 'fashion', demos: 9, tech: 'React/Node', subtypes: ['Retail', 'Boutique', 'Designer', 'Wholesale'] },
    { icon: Gem, name: 'Jewelry', slug: 'jewelry', demos: 6, tech: 'React/PHP', subtypes: ['Retail', 'Custom', 'Wholesale', 'Repair'] },
    { icon: Coffee, name: 'Cafe & Bakery', slug: 'cafe', demos: 7, tech: 'React/Node', subtypes: ['Coffee Shop', 'Bakery', 'Tea House', 'Dessert'] },
    { icon: Wine, name: 'Nightlife', slug: 'nightlife', demos: 4, tech: 'React/Node', subtypes: ['Bar', 'Club', 'Lounge', 'Brewery'] },
    { icon: Baby, name: 'Childcare', slug: 'childcare', demos: 5, tech: 'React/Node', subtypes: ['Daycare', 'Preschool', 'Nanny', 'Activity'] },
    { icon: Dog, name: 'Pet Services', slug: 'pets', demos: 6, tech: 'React/Node', subtypes: ['Grooming', 'Boarding', 'Vet', 'Store'] },
    { icon: Flower2, name: 'Florist', slug: 'florist', demos: 4, tech: 'React/PHP', subtypes: ['Retail', 'Event', 'Subscription', 'Garden'] },
    { icon: Paintbrush, name: 'Art & Design', slug: 'art-design', demos: 5, tech: 'React/Node', subtypes: ['Gallery', 'Studio', 'Interior', 'Graphic'] },
    { icon: Hammer, name: 'Construction', slug: 'construction', demos: 7, tech: 'React/Java', subtypes: ['Contractor', 'Architecture', 'Material', 'Project'] },
    { icon: Wrench, name: 'Maintenance', slug: 'maintenance', demos: 6, tech: 'React/Node', subtypes: ['HVAC', 'Plumbing', 'Electrical', 'General'] },
    { icon: Truck, name: 'Logistics', slug: 'logistics', demos: 9, tech: 'React/Java', subtypes: ['Shipping', 'Courier', 'Warehouse', 'Fleet'] },
    { icon: Ship, name: 'Marine', slug: 'marine', demos: 3, tech: 'React/Node', subtypes: ['Charter', 'Marina', 'Supplies', 'Tours'] },
    { icon: Train, name: 'Transport', slug: 'transport', demos: 5, tech: 'React/Python', subtypes: ['Taxi', 'Bus', 'Rail', 'Rideshare'] },
    { icon: Bike, name: 'Sports', slug: 'sports', demos: 7, tech: 'React/Node', subtypes: ['Club', 'Academy', 'Equipment', 'Events'] },
    { icon: Mountain, name: 'Adventure', slug: 'adventure', demos: 4, tech: 'React/Node', subtypes: ['Trekking', 'Camping', 'Water Sports', 'Sky'] },
    { icon: Tent, name: 'Events', slug: 'events', demos: 8, tech: 'React/Node', subtypes: ['Wedding', 'Corporate', 'Concert', 'Festival'] },
    { icon: Umbrella, name: 'Insurance', slug: 'insurance', demos: 5, tech: 'React/Java', subtypes: ['Health', 'Life', 'Auto', 'Property'] },
  ];

  const handleCategoryClick = (slug: string) => {
    navigate(`/onboard/${slug}`);
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,6%)] to-[hsl(220,25%,4%)]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Master <span className="text-[hsl(210,100%,55%)]">Category Wall</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto px-4">
            40+ industry solutions. Click to explore demos and start your journey.
          </p>
        </motion.div>

        {/* 4-Column Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="relative group"
              onMouseEnter={() => setExpandedCategory(category.slug)}
              onMouseLeave={() => setExpandedCategory(null)}
            >
              <div 
                onClick={() => handleCategoryClick(category.slug)}
                className={`
                  relative p-3 sm:p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300
                  bg-[hsl(220,20%,8%)] border-2 border-[hsl(210,100%,55%)/0.3]
                  hover:border-[hsl(210,100%,55%)/0.8] hover:bg-[hsl(220,20%,10%)]
                  ${expandedCategory === category.slug ? 'shadow-[0_0_40px_hsl(210_100%_55%/0.3)]' : ''}
                `}
              >
                {/* Icon with neon glow */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                                bg-[hsl(210,100%,55%)/0.1] border border-[hsl(210,100%,55%)/0.3]
                                group-hover:bg-[hsl(210,100%,55%)/0.2] transition-colors">
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(210,100%,55%)]"
                                   style={{ filter: 'drop-shadow(0 0 8px hsl(210 100% 55% / 0.6))' }} />
                  </div>
                </div>

                {/* Name with gold underline */}
                <h3 className="font-semibold text-white text-xs sm:text-sm mb-2 group-hover:text-[hsl(210,100%,55%)] transition-colors
                             border-b border-[hsl(45,100%,50%)/0.3] pb-2 line-clamp-1">
                  {category.name}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-[hsl(45,100%,50%)/0.1]
                                 text-[hsl(45,100%,50%)] border border-[hsl(45,100%,50%)/0.3]">
                    {category.demos}+ Demos
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[hsl(210,100%,55%)/0.1]
                                 text-[hsl(210,100%,55%)] border border-[hsl(210,100%,55%)/0.2]">
                    {category.tech}
                  </span>
                </div>

                {/* CTA Button */}
                <button className="w-full text-xs py-2 rounded-lg
                                 border border-[hsl(45,100%,50%)/0.4] text-[hsl(45,100%,50%)]
                                 hover:bg-[hsl(45,100%,50%)/0.1] transition-colors">
                  Open Demo Wall
                </button>

                {/* Hover panel with subtypes */}
                <AnimatePresence>
                  {expandedCategory === category.slug && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl z-30
                               bg-[hsl(220,20%,10%)] border border-[hsl(210,100%,55%)/0.4]
                               shadow-[0_15px_50px_rgba(0,0,0,0.6)]"
                    >
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Sub-categories</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {category.subtypes.map((subtype) => (
                          <span
                            key={subtype}
                            className="text-xs px-2 py-1 rounded-md bg-[hsl(210,100%,55%)/0.1]
                                     text-[hsl(210,100%,55%)] border border-[hsl(210,100%,55%)/0.2]
                                     hover:bg-[hsl(210,100%,55%)/0.2] cursor-pointer transition-colors"
                          >
                            {subtype}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => handleCategoryClick(category.slug)}
                        className="w-full text-xs py-2 rounded-lg font-medium
                                 bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]
                                 text-white hover:opacity-90 transition-opacity"
                      >
                        View {category.demos} Demos →
                      </button>
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

export default MasterCategoryWall;
