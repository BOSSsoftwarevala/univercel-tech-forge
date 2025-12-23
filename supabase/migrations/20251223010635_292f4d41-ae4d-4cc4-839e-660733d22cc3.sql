
-- =====================================================
-- PRODUCT MODULE DATABASE SCHEMA (EXTENDED)
-- =====================================================

-- 1. Create business_categories table (50 master categories)
CREATE TABLE public.business_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create business_subcategories table
CREATE TABLE public.business_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.business_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(category_id, name)
);

-- 3. Extend existing products table with new columns
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'software',
ADD COLUMN IF NOT EXISTS business_category_id UUID REFERENCES public.business_categories(id),
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.business_subcategories(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS has_broken_demo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 4. Create product_demo_mappings table
CREATE TABLE public.product_demo_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
    demo_id UUID NOT NULL REFERENCES public.demos(id) ON DELETE CASCADE,
    linked_by UUID REFERENCES auth.users(id),
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(product_id, demo_id)
);

-- 5. Create product_action_logs table (immutable)
CREATE TABLE public.product_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(product_id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    action TEXT NOT NULL,
    action_details JSONB DEFAULT '{}',
    performed_by UUID REFERENCES auth.users(id),
    performer_role app_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_demo_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_action_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_categories
CREATE POLICY "Anyone can view active categories"
ON public.business_categories FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'master'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Master admin manages categories"
ON public.business_categories FOR ALL
USING (has_role(auth.uid(), 'master'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for business_subcategories
CREATE POLICY "Anyone can view active subcategories"
ON public.business_subcategories FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'master'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Master admin manages subcategories"
ON public.business_subcategories FOR ALL
USING (has_role(auth.uid(), 'master'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for product_demo_mappings
CREATE POLICY "Anyone views product demos"
ON public.product_demo_mappings FOR SELECT
USING (true);

CREATE POLICY "Demo manager manages mappings"
ON public.product_demo_mappings FOR ALL
USING (has_role(auth.uid(), 'demo_manager'::app_role) OR has_role(auth.uid(), 'master'::app_role));

-- RLS Policies for product_action_logs (immutable)
CREATE POLICY "System inserts product logs"
ON public.product_action_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authorized roles view product logs"
ON public.product_action_logs FOR SELECT
USING (has_role(auth.uid(), 'demo_manager'::app_role) OR has_role(auth.uid(), 'master'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_products_business_category ON public.products(business_category_id);
CREATE INDEX idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_subcategories_category ON public.business_subcategories(category_id);
CREATE INDEX idx_product_mappings_product ON public.product_demo_mappings(product_id);
CREATE INDEX idx_product_mappings_demo ON public.product_demo_mappings(demo_id);
CREATE INDEX idx_product_logs_product ON public.product_action_logs(product_id);

-- =====================================================
-- INSERT 50 MASTER BUSINESS CATEGORIES WITH SUBCATEGORIES
-- =====================================================

INSERT INTO public.business_categories (name, description, icon, display_order) VALUES
('Healthcare & Medical', 'Medical software and healthcare solutions', 'Heart', 1),
('Education & E-Learning', 'Educational platforms and learning management', 'GraduationCap', 2),
('Finance & Banking', 'Financial services and banking solutions', 'DollarSign', 3),
('E-Commerce & Retail', 'Online stores and retail management', 'ShoppingCart', 4),
('Real Estate & Property', 'Property management and real estate', 'Home', 5),
('Restaurant & Food Service', 'Restaurant and food delivery systems', 'UtensilsCrossed', 6),
('Hotel & Hospitality', 'Hotel management and booking systems', 'Building', 7),
('Transportation & Logistics', 'Fleet and logistics management', 'Truck', 8),
('Manufacturing & Industry', 'Industrial and manufacturing solutions', 'Factory', 9),
('Human Resources & HR', 'HR management and recruitment', 'Users', 10),
('Customer Relationship (CRM)', 'Customer management solutions', 'UserCheck', 11),
('Project Management', 'Project and task management tools', 'ClipboardList', 12),
('Accounting & Invoicing', 'Accounting and billing solutions', 'Calculator', 13),
('Legal & Law Firm', 'Legal practice management', 'Scale', 14),
('Insurance & Claims', 'Insurance management systems', 'Shield', 15),
('Marketing & Advertising', 'Marketing automation and ads', 'Megaphone', 16),
('Social Media & Community', 'Social networking platforms', 'Share2', 17),
('News & Publishing', 'Content and news management', 'Newspaper', 18),
('Entertainment & Media', 'Media and entertainment platforms', 'Film', 19),
('Gaming & Sports', 'Gaming and sports management', 'Gamepad2', 20),
('Travel & Tourism', 'Travel booking and tourism', 'Plane', 21),
('Fitness & Wellness', 'Gym and wellness management', 'Activity', 22),
('Beauty & Salon', 'Salon and spa management', 'Scissors', 23),
('Agriculture & Farming', 'Agricultural management systems', 'Leaf', 24),
('Construction & Architecture', 'Construction project management', 'HardHat', 25),
('Telecommunications', 'Telecom and communication services', 'Phone', 26),
('IT & Software Services', 'IT service management', 'Code', 27),
('Cybersecurity', 'Security and protection solutions', 'Lock', 28),
('Cloud & Hosting', 'Cloud services and hosting', 'Cloud', 29),
('IoT & Smart Devices', 'Internet of Things solutions', 'Wifi', 30),
('AI & Machine Learning', 'Artificial intelligence platforms', 'Brain', 31),
('Blockchain & Crypto', 'Blockchain and cryptocurrency', 'Link', 32),
('Government & Public Sector', 'Government administration systems', 'Landmark', 33),
('Non-Profit & NGO', 'Non-profit organization management', 'HandHeart', 34),
('Religious & Worship', 'Church and religious management', 'Church', 35),
('Event & Ticketing', 'Event management and ticketing', 'Calendar', 36),
('Photography & Video', 'Photography and video services', 'Camera', 37),
('Music & Audio', 'Music streaming and audio production', 'Music', 38),
('Automotive & Vehicles', 'Vehicle and automotive management', 'Car', 39),
('Pet & Veterinary', 'Pet care and veterinary services', 'PawPrint', 40),
('Childcare & Daycare', 'Childcare management systems', 'Baby', 41),
('Senior Care & Assisted Living', 'Elder care management', 'HeartHandshake', 42),
('Energy & Utilities', 'Energy and utility management', 'Zap', 43),
('Mining & Resources', 'Mining and resource management', 'Mountain', 44),
('Fashion & Apparel', 'Fashion and clothing retail', 'Shirt', 45),
('Jewelry & Luxury', 'Jewelry and luxury goods', 'Gem', 46),
('Grocery & Supermarket', 'Grocery store management', 'Apple', 47),
('Pharmacy & Drug Store', 'Pharmacy management systems', 'Pill', 48),
('Laundry & Dry Cleaning', 'Laundry service management', 'WashingMachine', 49),
('Printing & Publishing', 'Print shop management', 'Printer', 50);

-- Insert subcategories for each category
INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Hospital Management', 'Clinic Management', 'Pharmacy POS', 'Laboratory Management', 'Telemedicine', 'Patient Portal', 'Medical Billing']) AS subcategory
WHERE name = 'Healthcare & Medical';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Learning Management (LMS)', 'School Management', 'University ERP', 'Online Courses', 'Tutoring Platform', 'Student Portal', 'Exam Management']) AS subcategory
WHERE name = 'Education & E-Learning';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Core Banking', 'Loan Management', 'Investment Platform', 'Payment Gateway', 'Mobile Banking', 'Microfinance', 'Stock Trading']) AS subcategory
WHERE name = 'Finance & Banking';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Multi-Vendor Marketplace', 'Single Store', 'B2B Commerce', 'POS System', 'Inventory Management', 'Dropshipping', 'Subscription Commerce']) AS subcategory
WHERE name = 'E-Commerce & Retail';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Property Listing', 'Property Management', 'Real Estate CRM', 'Rental Management', 'Mortgage Calculator', 'Virtual Tours', 'Agent Portal']) AS subcategory
WHERE name = 'Real Estate & Property';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Restaurant POS', 'Food Delivery', 'Table Reservation', 'Kitchen Display', 'Menu Management', 'Cloud Kitchen', 'Catering Management']) AS subcategory
WHERE name = 'Restaurant & Food Service';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Hotel Booking', 'Property Management System', 'Channel Manager', 'Housekeeping', 'Guest Experience', 'Revenue Management', 'Hostel Management']) AS subcategory
WHERE name = 'Hotel & Hospitality';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Fleet Management', 'Delivery Management', 'Ride Sharing', 'Freight Management', 'Warehouse Management', 'Last Mile Delivery', 'Route Optimization']) AS subcategory
WHERE name = 'Transportation & Logistics';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['ERP System', 'Production Planning', 'Quality Control', 'Supply Chain', 'Asset Management', 'Maintenance (CMMS)', 'Shop Floor Control']) AS subcategory
WHERE name = 'Manufacturing & Industry';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['HRMS', 'Payroll Management', 'Recruitment (ATS)', 'Employee Self-Service', 'Performance Management', 'Time & Attendance', 'Learning & Development']) AS subcategory
WHERE name = 'Human Resources & HR';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Sales CRM', 'Service CRM', 'Marketing CRM', 'Contact Management', 'Lead Management', 'Pipeline Management', 'Customer Support']) AS subcategory
WHERE name = 'Customer Relationship (CRM)';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Task Management', 'Agile/Scrum', 'Gantt Charts', 'Team Collaboration', 'Time Tracking', 'Resource Planning', 'Milestone Tracking']) AS subcategory
WHERE name = 'Project Management';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['General Ledger', 'Invoicing', 'Expense Management', 'Tax Management', 'Budgeting', 'Financial Reporting', 'Multi-Currency']) AS subcategory
WHERE name = 'Accounting & Invoicing';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Case Management', 'Document Management', 'Time Billing', 'Client Portal', 'Contract Management', 'Legal Research', 'Court Filing']) AS subcategory
WHERE name = 'Legal & Law Firm';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Policy Management', 'Claims Processing', 'Underwriting', 'Agent Portal', 'Reinsurance', 'Quote Engine', 'Risk Assessment']) AS subcategory
WHERE name = 'Insurance & Claims';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Email Marketing', 'Marketing Automation', 'Ad Management', 'SEO Tools', 'Analytics Dashboard', 'Content Marketing', 'Affiliate Marketing']) AS subcategory
WHERE name = 'Marketing & Advertising';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Social Network', 'Community Forum', 'Discussion Board', 'Social Media Management', 'Influencer Platform', 'User Generated Content', 'Live Streaming']) AS subcategory
WHERE name = 'Social Media & Community';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['News Portal', 'Blog Platform', 'Magazine CMS', 'Digital Publishing', 'Newsletter', 'Content Aggregator', 'Paywall System']) AS subcategory
WHERE name = 'News & Publishing';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Video Streaming', 'OTT Platform', 'Podcast Platform', 'Media Library', 'Digital Asset Management', 'Live Events', 'Fan Engagement']) AS subcategory
WHERE name = 'Entertainment & Media';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Sports Management', 'Fantasy Sports', 'Betting Platform', 'Tournament Management', 'Team Management', 'Score Tracking', 'Gaming Community']) AS subcategory
WHERE name = 'Gaming & Sports';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Flight Booking', 'Tour Packages', 'Travel Agency', 'Visa Services', 'Travel Blog', 'Destination Guide', 'Travel Insurance']) AS subcategory
WHERE name = 'Travel & Tourism';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Gym Management', 'Yoga Studio', 'Personal Training', 'Nutrition Tracking', 'Wellness App', 'Fitness Classes', 'Health Coaching']) AS subcategory
WHERE name = 'Fitness & Wellness';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Salon Management', 'Spa Booking', 'Appointment Scheduling', 'Staff Management', 'Inventory (Beauty)', 'Loyalty Program', 'Online Booking']) AS subcategory
WHERE name = 'Beauty & Salon';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Farm Management', 'Crop Planning', 'Livestock Management', 'Irrigation Control', 'Marketplace (Agri)', 'Supply Chain (Agri)', 'Weather Tracking']) AS subcategory
WHERE name = 'Agriculture & Farming';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Project Estimation', 'Blueprint Management', 'Contractor Portal', 'Site Management', 'Material Tracking', 'Safety Compliance', 'BIM Tools']) AS subcategory
WHERE name = 'Construction & Architecture';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Billing System', 'Network Management', 'Customer Portal', 'VoIP System', 'SMS Gateway', 'Call Center', 'Subscriber Management']) AS subcategory
WHERE name = 'Telecommunications';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Helpdesk/ITSM', 'DevOps Tools', 'Code Repository', 'Bug Tracking', 'API Management', 'Documentation', 'Monitoring Tools']) AS subcategory
WHERE name = 'IT & Software Services';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['SIEM', 'Vulnerability Scanner', 'Password Manager', 'Identity Management', 'Firewall Management', 'Penetration Testing', 'Compliance Audit']) AS subcategory
WHERE name = 'Cybersecurity';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Web Hosting Panel', 'Cloud Dashboard', 'Domain Management', 'Server Monitoring', 'Backup Solution', 'CDN Management', 'Container Orchestration']) AS subcategory
WHERE name = 'Cloud & Hosting';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Smart Home', 'Industrial IoT', 'Device Management', 'Sensor Dashboard', 'Asset Tracking', 'Predictive Maintenance', 'Energy Monitoring']) AS subcategory
WHERE name = 'IoT & Smart Devices';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Chatbot Platform', 'ML Model Training', 'Image Recognition', 'NLP Tools', 'Recommendation Engine', 'Predictive Analytics', 'AI Dashboard']) AS subcategory
WHERE name = 'AI & Machine Learning';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Crypto Exchange', 'Wallet Management', 'NFT Marketplace', 'DeFi Platform', 'Token Launchpad', 'Blockchain Explorer', 'Smart Contracts']) AS subcategory
WHERE name = 'Blockchain & Crypto';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['E-Governance', 'Citizen Portal', 'License Management', 'Tax Collection', 'Public Records', 'Voting System', 'Municipal Services']) AS subcategory
WHERE name = 'Government & Public Sector';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Donation Management', 'Volunteer Management', 'Campaign Management', 'Grant Tracking', 'Member Portal', 'Impact Reporting', 'Fundraising']) AS subcategory
WHERE name = 'Non-Profit & NGO';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Church Management', 'Donation Tracking', 'Event Management', 'Member Directory', 'Sermon Library', 'Prayer Requests', 'Volunteer Scheduling']) AS subcategory
WHERE name = 'Religious & Worship';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Event Planning', 'Ticket Sales', 'Registration System', 'Virtual Events', 'Conference Management', 'Venue Booking', 'Badge Printing']) AS subcategory
WHERE name = 'Event & Ticketing';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Photo Gallery', 'Client Proofing', 'Booking System', 'Video Editing', 'Stock Media', 'Portfolio Builder', 'Print Store']) AS subcategory
WHERE name = 'Photography & Video';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Music Streaming', 'Audio Editor', 'Podcast Hosting', 'Beat Marketplace', 'Radio Streaming', 'Music Distribution', 'DJ Platform']) AS subcategory
WHERE name = 'Music & Audio';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Car Dealership', 'Auto Repair Shop', 'Vehicle Rental', 'Parts Inventory', 'Service Booking', 'Fleet Tracking', 'Insurance Claims']) AS subcategory
WHERE name = 'Automotive & Vehicles';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Veterinary Clinic', 'Pet Store', 'Pet Boarding', 'Grooming Salon', 'Pet Adoption', 'Pet Sitting', 'Pet Health Records']) AS subcategory
WHERE name = 'Pet & Veterinary';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Daycare Management', 'Parent Portal', 'Attendance Tracking', 'Activity Planning', 'Billing (Childcare)', 'Staff Scheduling', 'Health Records']) AS subcategory
WHERE name = 'Childcare & Daycare';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Care Home Management', 'Resident Portal', 'Medication Tracking', 'Activity Calendar', 'Family Communication', 'Staff Scheduling', 'Health Monitoring']) AS subcategory
WHERE name = 'Senior Care & Assisted Living';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Utility Billing', 'Smart Meter', 'Energy Trading', 'Solar Management', 'Grid Management', 'Customer Portal', 'Consumption Analytics']) AS subcategory
WHERE name = 'Energy & Utilities';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Mine Planning', 'Resource Tracking', 'Equipment Management', 'Safety Management', 'Environmental Compliance', 'Ore Processing', 'Geological Survey']) AS subcategory
WHERE name = 'Mining & Resources';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Fashion Store', 'Clothing Rental', 'Custom Tailoring', 'Size Recommendation', 'Virtual Try-On', 'Fashion Blog', 'Wholesale Portal']) AS subcategory
WHERE name = 'Fashion & Apparel';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Jewelry Store', 'Custom Design', 'Inventory Management', 'Appraisal System', 'Auction Platform', 'Gift Registry', 'Repair Tracking']) AS subcategory
WHERE name = 'Jewelry & Luxury';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Grocery POS', 'Online Grocery', 'Inventory (Grocery)', 'Delivery Management', 'Customer Loyalty', 'Vendor Management', 'Price Comparison']) AS subcategory
WHERE name = 'Grocery & Supermarket';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Pharmacy POS', 'Prescription Management', 'Drug Inventory', 'Online Pharmacy', 'Patient Records', 'Insurance Claims', 'Compound Management']) AS subcategory
WHERE name = 'Pharmacy & Drug Store';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Laundry POS', 'Pickup & Delivery', 'Order Tracking', 'Customer App', 'Franchise Management', 'Route Planning', 'Garment Tracking']) AS subcategory
WHERE name = 'Laundry & Dry Cleaning';

INSERT INTO public.business_subcategories (category_id, name, display_order)
SELECT id, subcategory, row_number() OVER ()
FROM public.business_categories, unnest(ARRAY['Print Shop', 'Online Printing', 'Design Tools', 'Order Management', 'Production Tracking', 'Vendor Portal', 'Digital Proofing']) AS subcategory
WHERE name = 'Printing & Publishing';
