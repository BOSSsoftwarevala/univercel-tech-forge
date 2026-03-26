-- =====================================================
-- UNIFIED SAAS MARKETPLACE DATABASE SCHEMA
-- Complete relational database for all 37+ role dashboards
-- All tables linked via foreign keys with role-based access control
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE USER AND AUTHENTICATION TABLES
-- =====================================================

-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user_dashboard',
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Geographic and organizational scoping
    franchise_id UUID REFERENCES franchises(id),
    reseller_id UUID REFERENCES resellers(id),
    continent VARCHAR(50),
    country VARCHAR(100),
    
    -- Metadata for additional user information
    metadata JSONB DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT valid_role CHECK (role IN (
        'boss_panel', 'ceo_dashboard', 'vala_ai', 'server_manager', 'ai_api_manager',
        'development_manager', 'product_manager', 'demo_manager', 'task_manager',
        'promise_tracker', 'asset_manager', 'marketing_manager', 'seo_manager',
        'lead_manager', 'sales_manager', 'customer_support', 'franchise_manager',
        'reseller_manager', 'influencer_manager', 'continent_admin', 'country_admin',
        'finance_manager', 'legal_manager', 'developer_dashboard', 'pro_manager',
        'user_dashboard', 'security_manager', 'system_settings', 'marketplace_manager',
        'license_manager', 'demo_system_manager', 'deployment_manager',
        'analytics_manager', 'notification_manager', 'integration_manager',
        'audit_logs_manager', 'marketplace_core'
    ))
);

-- User sessions for JWT token management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- MARKETPLACE AND PRODUCT MANAGEMENT
-- =====================================================

-- Products available in marketplace
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    vendor_id UUID REFERENCES vendors(id),
    type VARCHAR(50) NOT NULL, -- 'software', 'service', 'subscription'
    pricing JSONB NOT NULL DEFAULT '{}',
    features JSONB DEFAULT '[]',
    tags TEXT[],
    images JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'draft'
    visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'restricted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- SEO and marketing fields
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    search_vector tsvector
);

-- Product categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    slug VARCHAR(255) UNIQUE,
    icon VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors/Sellers in marketplace
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    logo VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- =====================================================
-- LEAD MANAGEMENT SYSTEM
-- =====================================================

-- Leads generated from various sources
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL, -- 'marketplace', 'influencer', 'franchise', 'reseller', 'direct'
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
    contact_info JSONB NOT NULL, -- {email, phone, name, company}
    assigned_to UUID REFERENCES users(id),
    value DECIMAL(12,2) DEFAULT 0,
    probability DECIMAL(3,2) DEFAULT 0,
    interested_product_id UUID REFERENCES products(id),
    expected_close_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Source tracking
    franchise_id UUID REFERENCES franchises(id),
    reseller_id UUID REFERENCES resellers(id),
    influencer_id UUID REFERENCES influencers(id),
    campaign_id UUID REFERENCES marketing_campaigns(id),
    
    -- Lead scoring and metadata
    score INTEGER DEFAULT 0,
    tags TEXT[],
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- SALES MANAGEMENT SYSTEM
-- =====================================================

-- Sales opportunities and deals
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    customer_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded'
    payment_method VARCHAR(50),
    sales_manager_id UUID REFERENCES users(id),
    probability DECIMAL(3,2) DEFAULT 0,
    expected_close_date DATE,
    actual_close_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Commission structure
    commission JSONB DEFAULT '{}', -- {reseller, franchise, influencer}
    
    -- Sales metadata
    contract_terms TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- PAYMENT PROCESSING SYSTEM
-- =====================================================

-- Payment records and transactions
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    method VARCHAR(50) NOT NULL, -- 'card', 'bank', 'crypto', 'wallet'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded'
    gateway VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'crypto', etc.
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment processing details
    failure_reason TEXT,
    refund_amount DECIMAL(12,2),
    refund_reason TEXT,
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- LICENSE MANAGEMENT SYSTEM
-- =====================================================

-- User licenses and subscriptions
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    sale_id UUID REFERENCES sales(id),
    type VARCHAR(50) NOT NULL, -- 'trial', 'basic', 'premium', 'enterprise'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'suspended', 'cancelled'
    expires_at TIMESTAMP WITH TIME ZONE,
    features JSONB DEFAULT '[]',
    usage_limits JSONB DEFAULT '{}', -- {apiCalls, storage, users}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- License management
    auto_renew BOOLEAN DEFAULT false,
    renewal_count INTEGER DEFAULT 0,
    parent_license_id UUID REFERENCES licenses(id), -- for upgrades/downgrades
    metadata JSONB DEFAULT '{}'
);

-- License usage tracking
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    license_id UUID NOT NULL REFERENCES licenses(id),
    action VARCHAR(100) NOT NULL, -- 'api_call', 'login', 'feature_use', etc.
    resource VARCHAR(255) NOT NULL, -- endpoint, feature name, etc.
    quantity INTEGER DEFAULT 1,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Usage context
    ip_address INET,
    user_agent TEXT,
    endpoint VARCHAR(255),
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- CUSTOMER SUPPORT SYSTEM
-- =====================================================

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    license_id UUID REFERENCES licenses(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    category VARCHAR(50) NOT NULL, -- 'technical', 'billing', 'feature', 'bug', 'other'
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ticket management
    resolution_time INTEGER, -- minutes
    satisfaction_rating INTEGER, -- 1-5
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- ANALYTICS AND REPORTING
-- =====================================================

-- Analytics data points
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(100) NOT NULL, -- dashboard/module name
    metric VARCHAR(100) NOT NULL, -- 'page_views', 'revenue', 'users', etc.
    value DECIMAL(15,2) NOT NULL,
    period VARCHAR(20) NOT NULL, -- 'hourly', 'daily', 'weekly', 'monthly'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Dimensional analysis
    dimensions JSONB DEFAULT '{}', -- {role, country, product, etc.}
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- NOTIFICATION SYSTEM
-- =====================================================

-- User notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'info', 'success', 'warning', 'error'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Notification management
    expires_at TIMESTAMP WITH TIME ZONE,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium',
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- ORGANIZATIONAL STRUCTURE
-- =====================================================

-- Franchises
CREATE TABLE IF NOT EXISTS franchises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address JSONB, -- {street, city, state, country, postal_code}
    territory JSONB, -- {countries, regions}
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Resellers
CREATE TABLE IF NOT EXISTS resellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    commission_rate DECIMAL(5,2) DEFAULT 0,
    franchise_id UUID REFERENCES franchises(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Influencers
CREATE TABLE IF NOT EXISTS influencers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    social_media JSONB, -- {platform, handle, followers, etc.}
    commission_rate DECIMAL(5,2) DEFAULT 0,
    referral_code VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- =====================================================
-- MARKETING AND CAMPAIGNS
-- =====================================================

-- Marketing campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'email', 'social', 'content', 'ppc'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    target_audience JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- PIPELINE EVENTS AND WORKFLOW
-- =====================================================

-- Pipeline events for data flow tracking
CREATE TABLE IF NOT EXISTS pipeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage VARCHAR(50) NOT NULL, -- 'marketplace', 'lead', 'sales', etc.
    type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'deleted', 'converted'
    entity_id UUID NOT NULL,
    entity_type VARCHAR(100) NOT NULL, -- 'lead', 'sale', 'payment', etc.
    data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    triggered_by UUID REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Event processing
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_franchise ON users(franchise_id);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(search_vector);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- Sales indexes
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_manager ON sales(sales_manager_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_created ON sales(created_at);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_sale ON payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway ON payments(gateway);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);

-- Licenses indexes
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_product ON licenses(product_id);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_expires ON licenses(expires_at);

-- Support tickets indexes
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON support_tickets(created_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_module ON analytics(module);
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON analytics(metric);
CREATE INDEX IF NOT EXISTS idx_analytics_period ON analytics(period);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Usage logs indexes
CREATE INDEX IF NOT EXISTS idx_usage_user ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_license ON usage_logs(license_id);
CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON usage_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_action ON usage_logs(action);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_franchises_updated_at BEFORE UPDATE ON franchises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resellers_updated_at BEFORE UPDATE ON resellers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at BEFORE UPDATE ON influencers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
