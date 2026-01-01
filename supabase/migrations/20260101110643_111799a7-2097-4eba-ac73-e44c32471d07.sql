-- Insert sample permissions for all roles using existing schema
INSERT INTO public.role_permissions (role_name, permission_name, module_name, action) VALUES
-- Super Admin permissions
('super_admin', 'View Users', 'Users', 'view'),
('super_admin', 'Create Users', 'Users', 'create'),
('super_admin', 'Edit Users', 'Users', 'edit'),
('super_admin', 'Delete Users', 'Users', 'delete'),
('super_admin', 'View Roles', 'Roles', 'view'),
('super_admin', 'Create Roles', 'Roles', 'create'),
('super_admin', 'Edit Roles', 'Roles', 'edit'),
('super_admin', 'Assign Roles', 'Roles', 'assign'),
('super_admin', 'View Dashboard', 'Dashboard', 'view'),
('super_admin', 'View Reports', 'Reports', 'view'),
('super_admin', 'Export Reports', 'Reports', 'export'),
('super_admin', 'View Settings', 'Settings', 'view'),
('super_admin', 'Edit Settings', 'Settings', 'edit'),
('super_admin', 'View Billing', 'Billing', 'view'),
('super_admin', 'Manage Billing', 'Billing', 'manage'),
-- Continent Manager permissions
('continent_super_admin', 'View Users', 'Users', 'view'),
('continent_super_admin', 'Create Users', 'Users', 'create'),
('continent_super_admin', 'Edit Users', 'Users', 'edit'),
('continent_super_admin', 'View Dashboard', 'Dashboard', 'view'),
('continent_super_admin', 'View Reports', 'Reports', 'view'),
-- Country Admin permissions
('country_admin', 'View Users', 'Users', 'view'),
('country_admin', 'Create Users', 'Users', 'create'),
('country_admin', 'View Dashboard', 'Dashboard', 'view'),
('country_admin', 'View Reports', 'Reports', 'view'),
-- Finance Auditor permissions
('finance_auditor', 'View Billing', 'Billing', 'view'),
('finance_auditor', 'View Reports', 'Reports', 'view'),
('finance_auditor', 'Export Reports', 'Reports', 'export'),
-- Support Team Lead permissions
('support_team_lead', 'View Users', 'Users', 'view'),
('support_team_lead', 'View Dashboard', 'Dashboard', 'view'),
('support_team_lead', 'Manage Tickets', 'Support', 'manage'),
-- Marketing Viewer permissions
('marketing_viewer', 'View Dashboard', 'Dashboard', 'view'),
('marketing_viewer', 'View Reports', 'Reports', 'view')
ON CONFLICT DO NOTHING;