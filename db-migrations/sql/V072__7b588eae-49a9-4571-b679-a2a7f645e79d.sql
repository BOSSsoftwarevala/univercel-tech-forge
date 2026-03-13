
-- Create function to populate software catalog with sample data
CREATE OR REPLACE FUNCTION populate_software_catalog()
RETURNS void AS $$
DECLARE
  software_types TEXT[] := ARRAY['SaaS', 'Desktop', 'Mobile', 'Offline', 'Hybrid'];
  categories TEXT[] := ARRAY['Finance', 'Healthcare', 'Education', 'Hotel/Travel', 'Restaurant', 'E-Commerce', 'POS', 'CRM', 'HRM', 'ERP', 'Real Estate', 'Logistics', 'Inventory', 'Project Management', 'Fitness', 'Events', 'Lending', 'Insurance', 'Manufacturing', 'Automotive', 'Beauty/Salon', 'Library', 'Subscription', 'General'];
  prefixes TEXT[] := ARRAY['Advanced', 'Pro', 'Enterprise', 'Basic', 'Premium', 'Ultimate', 'Smart', 'Cloud', 'Digital', 'Online', 'Modern', 'Next-Gen', 'AI-Powered', 'Automated', 'Integrated'];
  names TEXT[] := ARRAY['Accounting', 'Billing', 'Invoice', 'Hospital', 'Clinic', 'Medical', 'Dental', 'Pharmacy', 'School', 'College', 'LMS', 'Coaching', 'Student', 'Hotel', 'Resort', 'Booking', 'Travel', 'Restaurant', 'Kitchen', 'Cafe', 'Food', 'Shop', 'Store', 'Cart', 'POS', 'CRM', 'Customer', 'HRM', 'Payroll', 'Employee', 'Attendance', 'Leave', 'ERP', 'Real Estate', 'Property', 'Transport', 'Logistics', 'Fleet', 'Delivery', 'Courier', 'Inventory', 'Warehouse', 'Stock', 'Project', 'Task', 'Gym', 'Fitness', 'Event', 'Ticket', 'Loan', 'Microfinance', 'Insurance', 'MRP', 'Manufacturing', 'Cab', 'Taxi', 'Car', 'Vehicle', 'Garage', 'Auto', 'Salon', 'Spa', 'Beauty', 'Library', 'Membership', 'Subscription', 'Analytics', 'Dashboard', 'Reports', 'Manager', 'Suite', 'Hub', 'Central', 'Portal', 'System'];
  suffixes TEXT[] := ARRAY['360', 'Pro', 'Plus', 'Max', 'Lite', 'Express', 'Cloud', 'Online', 'Mobile', 'Desktop'];
  prices NUMERIC[] := ARRAY[0, 29, 49, 79, 99, 149, 199, 299, 399, 499, 599, 799, 999, 1499, 1999, 2999, 4999];
  i INTEGER;
  sw_name TEXT;
  sw_type TEXT;
  sw_category TEXT;
  sw_price NUMERIC;
BEGIN
  -- Clear existing data
  DELETE FROM software_catalog WHERE vendor = 'Software Vala';
  
  -- Insert 5000 software products
  FOR i IN 1..5000 LOOP
    sw_name := prefixes[1 + floor(random() * array_length(prefixes, 1))::int] || ' ' ||
               names[1 + floor(random() * array_length(names, 1))::int] || ' ' ||
               suffixes[1 + floor(random() * array_length(suffixes, 1))::int] || ' ' ||
               i::text;
    sw_type := software_types[1 + floor(random() * array_length(software_types, 1))::int];
    sw_category := categories[1 + floor(random() * array_length(categories, 1))::int];
    sw_price := prices[1 + floor(random() * array_length(prices, 1))::int];
    
    INSERT INTO software_catalog (name, base_price, type, vendor, category, is_demo_registered)
    VALUES (sw_name, sw_price, sw_type, 'Software Vala', sw_category, false);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to populate data
SELECT populate_software_catalog();

-- Drop the function after use
DROP FUNCTION populate_software_catalog();
