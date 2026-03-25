import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Eye, Star, Zap } from 'lucide-react';

const TrendingDemoShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const demos = [
    { 
      id: 1, 
      title: 'Restaurant POS System', 
      category: 'Restaurant',
      tech: ['React', 'Node.js'],
      views: 2847,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
      trending: true
    },
    { 
      id: 2, 
      title: 'E-Commerce Multi-Vendor', 
      category: 'E-Commerce',
      tech: ['Next.js', 'PostgreSQL'],
      views: 3156,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      trending: true
    },
    { 
      id: 3, 
      title: 'Hospital Management', 
      category: 'Healthcare',
      tech: ['React', 'Express'],
      views: 1923,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop',
      trending: false
    },
    { 
      id: 4, 
      title: 'Real Estate Portal', 
      category: 'Real Estate',
      tech: ['Vue.js', 'Laravel'],
      views: 2341,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      trending: true
    },
    { 
      id: 5, 
      title: 'Gym Management', 
      category: 'Fitness',
      tech: ['React', 'Node.js'],
      views: 1567,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
      trending: false
    },
    { 
      id: 6, 
      title: 'School ERP', 
      category: 'Education',
      tech: ['Angular', 'Spring'],
      views: 2089,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop',
      trending: true
    },
  ];

  const visibleDemos = 4;
  const maxIndex = Math.max(0, demos.length - visibleDemos);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(220,25%,3%)]" />
      
      {/* Neon track lines */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)/0.3] to-transparent" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[hsl(210,100%,55%)]" />
              Trending Demos
            </h2>
            <p className="text-sm sm:text-base text-slate-400">Most popular demos this week</p>
          </div>
          
          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-3 rounded-xl bg-[hsl(220,20%,10%)] border border-[hsl(210,100%,55%)/0.3]
                       hover:border-[hsl(210,100%,55%)/0.6] disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-[hsl(210,100%,55%)]" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="p-3 rounded-xl bg-[hsl(220,20%,10%)] border border-[hsl(210,100%,55%)/0.3]
                       hover:border-[hsl(210,100%,55%)/0.6] disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all"
            >
              <ChevronRight className="w-5 h-5 text-[hsl(210,100%,55%)]" />
            </button>
          </div>
        </motion.div>

        {/* Carousel - horizontal scroll on mobile, animated on desktop */}
        <div className="overflow-x-auto sm:overflow-hidden scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <motion.div
            className="flex gap-4 sm:gap-6 sm:touch-none"
            animate={{ x: typeof window !== 'undefined' && window.innerWidth >= 640 ? -currentIndex * (100 / visibleDemos + 1.5) + '%' : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              >
                <div className="group relative rounded-2xl overflow-hidden
                              bg-[hsl(220,20%,8%)] border border-[hsl(210,100%,55%)/0.2]
                              hover:border-[hsl(210,100%,55%)/0.6] transition-all duration-300
                              hover:shadow-[0_0_40px_hsl(210_100%_55%/0.2)]">
                  {/* Image */}
                  <div className="relative h-36 sm:h-44 overflow-hidden">
                    <img
                      src={demo.image}
                      alt={demo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,8%)] to-transparent" />
                    
                    {/* Trending badge */}
                    {demo.trending && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium
                                    bg-[hsl(210,100%,55%)] text-white flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Trending
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs text-[hsl(210,100%,55%)] mb-1">{demo.category}</p>
                    <h3 className="font-semibold text-white mb-3 group-hover:text-[hsl(210,100%,55%)] transition-colors">
                      {demo.title}
                    </h3>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {demo.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded bg-[hsl(210,100%,55%)/0.1]
                                   text-[hsl(210,100%,55%)] border border-[hsl(210,100%,55%)/0.2]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Eye className="w-4 h-4" />
                        {demo.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-[hsl(45,100%,50%)] text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        {demo.rating}
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2
                                     border-2 border-[hsl(45,100%,50%)/0.5] text-[hsl(45,100%,50%)]
                                     hover:bg-[hsl(45,100%,50%)/0.1] hover:border-[hsl(45,100%,50%)]
                                     transition-all">
                      <ExternalLink className="w-4 h-4" />
                      Open Demo
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Track dots - hidden on mobile where scrolling is used */}
        <div className="hidden sm:flex justify-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'w-8 bg-[hsl(210,100%,55%)]' 
                  : 'w-1.5 bg-[hsl(210,100%,55%)/0.3]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDemoShowcase;
