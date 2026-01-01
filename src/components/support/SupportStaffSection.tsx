import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Globe, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  languages: string[];
  isOnline: boolean;
  specialization: string;
}

// Diverse staff data based on regions
const staffByRegion: Record<string, StaffMember[]> = {
  IN: [
    // Hindi Belt - 40% female
    { id: '1', name: 'Priya Sharma', role: 'Senior Developer', avatar: '👩‍💻', languages: ['Hindi', 'English'], isOnline: true, specialization: 'E-commerce Solutions' },
    { id: '2', name: 'Rahul Kumar', role: 'Technical Lead', avatar: '👨‍💻', languages: ['Hindi', 'English'], isOnline: true, specialization: 'ERP Systems' },
    { id: '3', name: 'Anjali Verma', role: 'Support Manager', avatar: '👩‍💼', languages: ['Hindi', 'English'], isOnline: true, specialization: 'Customer Success' },
    { id: '4', name: 'Mohammed Irfan', role: 'Full Stack Developer', avatar: '👨‍💻', languages: ['Hindi', 'Urdu', 'English'], isOnline: true, specialization: 'Healthcare IT' },
    { id: '5', name: 'Gurpreet Singh', role: 'DevOps Engineer', avatar: '👨‍💻', languages: ['Punjabi', 'Hindi', 'English'], isOnline: true, specialization: 'Cloud Infrastructure' },
    { id: '6', name: 'Fatima Khan', role: 'UI/UX Designer', avatar: '👩‍🎨', languages: ['Hindi', 'Urdu', 'English'], isOnline: true, specialization: 'Mobile Apps' },
    { id: '7', name: 'Suresh Reddy', role: 'Senior Architect', avatar: '👴', languages: ['Telugu', 'Hindi', 'English'], isOnline: true, specialization: 'Enterprise Solutions' },
    { id: '8', name: 'Kavitha Nair', role: 'Project Manager', avatar: '👩‍💼', languages: ['Malayalam', 'Hindi', 'English'], isOnline: true, specialization: 'Hospitality Tech' },
  ],
  US: [
    { id: '9', name: 'Michael Johnson', role: 'Solutions Architect', avatar: '👨‍💻', languages: ['English', 'Spanish'], isOnline: true, specialization: 'SaaS Platforms' },
    { id: '10', name: 'Sarah Williams', role: 'Technical Lead', avatar: '👩‍💻', languages: ['English'], isOnline: true, specialization: 'FinTech Solutions' },
    { id: '11', name: 'James Rodriguez', role: 'Full Stack Developer', avatar: '👨‍💻', languages: ['English', 'Spanish'], isOnline: true, specialization: 'E-commerce' },
    { id: '12', name: 'Emily Chen', role: 'Data Engineer', avatar: '👩‍💻', languages: ['English', 'Mandarin'], isOnline: true, specialization: 'Analytics' },
    { id: '13', name: 'Robert Miller', role: 'Senior Consultant', avatar: '👴', languages: ['English'], isOnline: true, specialization: 'ERP Implementation' },
  ],
  AE: [
    { id: '14', name: 'Ahmed Al-Rashid', role: 'Regional Director', avatar: '👨‍💼', languages: ['Arabic', 'English'], isOnline: true, specialization: 'Enterprise Solutions' },
    { id: '15', name: 'Fatima Al-Hashimi', role: 'Senior Developer', avatar: '👩‍💻', languages: ['Arabic', 'English'], isOnline: true, specialization: 'Banking Systems' },
    { id: '16', name: 'Omar Hassan', role: 'Technical Lead', avatar: '👨‍💻', languages: ['Arabic', 'English', 'Hindi'], isOnline: true, specialization: 'Hospitality Tech' },
  ],
  GB: [
    { id: '17', name: 'David Thompson', role: 'Solutions Architect', avatar: '👨‍💻', languages: ['English'], isOnline: true, specialization: 'Healthcare IT' },
    { id: '18', name: 'Emma Wilson', role: 'Project Manager', avatar: '👩‍💼', languages: ['English', 'French'], isOnline: true, specialization: 'Retail Solutions' },
    { id: '19', name: 'Tariq Ahmed', role: 'Full Stack Developer', avatar: '👨‍💻', languages: ['English', 'Urdu'], isOnline: true, specialization: 'Logistics' },
  ],
  DEFAULT: [
    { id: '20', name: 'Alex Kumar', role: 'Global Support Lead', avatar: '👨‍💻', languages: ['English', 'Hindi'], isOnline: true, specialization: 'All Solutions' },
    { id: '21', name: 'Maria Santos', role: 'Customer Success', avatar: '👩‍💼', languages: ['English', 'Spanish', 'Portuguese'], isOnline: true, specialization: 'Implementation' },
    { id: '22', name: 'John Smith', role: 'Senior Architect', avatar: '👴', languages: ['English'], isOnline: true, specialization: 'Enterprise Solutions' },
    { id: '23', name: 'Aisha Patel', role: 'Technical Lead', avatar: '👩‍💻', languages: ['English', 'Hindi', 'Gujarati'], isOnline: true, specialization: 'Custom Development' },
  ],
};

const SupportStaffSection: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [userCountry, setUserCountry] = useState<string>('DEFAULT');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const country = data.country_code || 'DEFAULT';
      setUserCountry(country);
      
      // Get staff for user's region, fallback to default
      const regionStaff = staffByRegion[country] || staffByRegion['DEFAULT'];
      
      // Mix in some global staff for diversity
      const globalStaff = staffByRegion['DEFAULT'].slice(0, 2);
      const combinedStaff = [...regionStaff, ...globalStaff].slice(0, 6);
      
      setStaff(combinedStaff);
    } catch (error) {
      setStaff(staffByRegion['DEFAULT']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactClick = (staffMember: StaffMember) => {
    // Open WhatsApp or contact form
    const message = encodeURIComponent(`Hi ${staffMember.name}, I need help with Software Vala products.`);
    window.open(`https://wa.me/918348838383?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="animate-pulse flex justify-center gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-32 h-40 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-2">24/7 Support</Badge>
          <h2 className="text-2xl font-bold mb-2">Meet Your Development Team</h2>
          <p className="text-muted-foreground text-sm">
            Our experts are ready to help you build your perfect solution
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {staff.map((member) => (
            <Card 
              key={member.id} 
              className="text-center hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleContactClick(member)}
            >
              <CardContent className="pt-4 pb-3 px-3">
                <div className="text-4xl mb-2">{member.avatar}</div>
                <h4 className="font-medium text-sm truncate">{member.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-[10px] text-muted-foreground">
                    {member.isOnline ? 'Online' : 'Away'}
                  </span>
                </div>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="h-6 text-xs w-full">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Call Us
          </Button>
          <Button size="sm">
            <Headphones className="w-4 h-4 mr-2" />
            Live Chat
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by <span className="font-medium">Software Vala</span>
        </p>
      </div>
    </section>
  );
};

export default SupportStaffSection;
