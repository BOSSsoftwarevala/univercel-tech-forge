import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ExternalLink, Search, Filter, ShoppingCart, Users, Heart,
  GraduationCap, DollarSign, Building, Truck, Share2, Briefcase, Grid,
  Star, ArrowRight, Send, CheckCircle, Code2, Utensils, Hotel, Package
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import softwareValaLogo from '@/assets/software-vala-logo.jpg';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import SupportStaffSection from '@/components/support/SupportStaffSection';

const iconMap: Record<string, any> = {
  ShoppingCart, Users, Heart, GraduationCap, DollarSign,
  Building, Truck, Share2, Briefcase, Grid, Utensils, Hotel, Package
};

const requestSchema = z.object({
  client_name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  client_email: z.string().email('Invalid email address').max(255),
  company_name: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  interested_category: z.string().optional(),
  message: z.string().max(1000).optional(),
});

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface DemoProject {
  id: string;
  project_name: string;
  project_url: string;
  description: string;
  category: string;
  thumbnail_url: string;
  is_featured: boolean;
  tech_stack: string[];
}

const DemoShowcase = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<DemoProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    company_name: '',
    phone: '',
    interested_category: '',
    message: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, projRes] = await Promise.all([
        supabase.from('demo_categories').select('*').eq('is_active', true).order('display_order'),
        supabase.from('demo_projects').select('*').eq('is_active', true).order('display_order'),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (projRes.data) setProjects(projRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitRequest = async () => {
    try {
      const validated = requestSchema.parse(formData);
      setIsSubmitting(true);

      const { error } = await supabase.from('demo_requests').insert({
        client_name: validated.client_name,
        client_email: validated.client_email,
        company_name: validated.company_name || null,
        phone: validated.phone || null,
        interested_category: validated.interested_category || null,
        message: validated.message || null,
      });

      if (error) throw error;

      toast.success('Demo request submitted! We will contact you soon.');
      setIsRequestOpen(false);
      setFormData({
        client_name: '',
        client_email: '',
        company_name: '',
        phone: '',
        interested_category: '',
        message: '',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Grid;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={softwareValaLogo} alt="Software Vala" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-bold text-white">Software Vala</span>
          </div>
          <Button size="sm" variant="outline" className="border-purple-500 text-purple-400">
            Contact Us
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-500/5 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            20+ Live Projects
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Software <span className="text-purple-400">Vala</span> Demos
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Production-ready software solutions. All demos powered by Software Vala.
          </p>
          
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Request a Demo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Your Name *</Label>
                    <Input
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      placeholder="john@company.com"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Your Company"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <Label>Interested Category</Label>
                  <Select
                    value={formData.interested_category}
                    onValueChange={(val) => setFormData({ ...formData, interested_category: val })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your requirements..."
                    className="bg-gray-800 border-gray-700"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search demos..."
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-purple-600' : 'border-gray-700 text-gray-300'}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.name)}
                className={selectedCategory === cat.name ? 'bg-purple-600' : 'border-gray-700 text-gray-300'}
              >
                {getIcon(cat.icon)}
                <span className="ml-1">{cat.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-t-lg" />
                <CardContent className="pt-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-full mb-4" />
                  <div className="h-10 bg-gray-700 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all group overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.project_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl font-bold text-purple-400/30">
                      {project.project_name.charAt(0)}
                    </div>
                  )}
                  {project.is_featured && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-white text-lg">{project.project_name}</CardTitle>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                      {project.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400 mb-4 line-clamp-2">
                    {project.description || 'A modern web application built with cutting-edge technologies.'}
                  </CardDescription>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-500"
                    onClick={() => window.open(project.project_url, '_blank')}
                  >
                    View Demo
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Grid className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-white mb-2">No demos found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Support Staff Section */}
      <SupportStaffSection />

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-10 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-3">Need a Custom Solution?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            Our team can build custom applications tailored to your business needs.
          </p>
          <Button size="lg" onClick={() => setIsRequestOpen(true)} className="bg-white text-purple-900 hover:bg-gray-100">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <p className="text-center text-sm text-gray-500">
          Powered by <span className="font-medium text-purple-400">Software Vala</span>
        </p>
      </footer>
    </div>
  );
};

export default DemoShowcase;
