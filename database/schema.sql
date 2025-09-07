-- PocketLegal Database Schema
-- This file contains the complete database schema for the PocketLegal application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farcaster_id TEXT UNIQUE,
    wallet_address TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal content table
CREATE TABLE IF NOT EXISTS legal_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('card', 'guide', 'checklist', 'template')),
    category TEXT NOT NULL CHECK (category IN ('tenant', 'employment', 'consumer', 'healthcare', 'family', 'criminal')),
    content JSONB NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 50,
    min_length INTEGER,
    max_length INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document templates table
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    template_content TEXT NOT NULL,
    required_fields JSONB NOT NULL DEFAULT '[]',
    price_cents INTEGER NOT NULL DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES legal_content(id) ON DELETE SET NULL,
    template_id UUID REFERENCES document_templates(id) ON DELETE SET NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'eth',
    transaction_hash TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User content access table
CREATE TABLE IF NOT EXISTS user_content_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES legal_content(id) ON DELETE CASCADE,
    template_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_content_or_template CHECK (
        (content_id IS NOT NULL AND template_id IS NULL) OR 
        (content_id IS NULL AND template_id IS NOT NULL)
    )
);

-- Generated documents table
CREATE TABLE IF NOT EXISTS generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
    document_content TEXT NOT NULL,
    input_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX IF NOT EXISTS idx_legal_content_category ON legal_content(category);
CREATE INDEX IF NOT EXISTS idx_legal_content_content_type ON legal_content(content_type);
CREATE INDEX IF NOT EXISTS idx_legal_content_active ON legal_content(is_active);
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON document_templates(category);
CREATE INDEX IF NOT EXISTS idx_document_templates_active ON document_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_user_content_access_user_id ON user_content_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_content_id ON user_content_access(content_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_template_id ON user_content_access(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Legal content is publicly readable
CREATE POLICY "Legal content is publicly readable" ON legal_content
    FOR SELECT USING (is_active = true);

-- Document templates are publicly readable
CREATE POLICY "Document templates are publicly readable" ON document_templates
    FOR SELECT USING (is_active = true);

-- Users can only access their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

CREATE POLICY "Users can create own transactions" ON transactions
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Users can only access their own content access records
CREATE POLICY "Users can view own content access" ON user_content_access
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

CREATE POLICY "Users can create own content access" ON user_content_access
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Users can only access their own generated documents
CREATE POLICY "Users can view own generated documents" ON generated_documents
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

CREATE POLICY "Users can create own generated documents" ON generated_documents
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_content_updated_at BEFORE UPDATE ON legal_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion
INSERT INTO legal_content (title, content_type, category, content, price_cents) VALUES
('Tenant Rights During Eviction', 'card', 'tenant', '{"summary": "Know your rights when facing eviction", "details": "Tenants have specific rights during eviction proceedings...", "steps": ["Receive proper notice", "Right to contest", "Right to legal representation"]}', 50),
('Employee Rights for Wage Disputes', 'card', 'employment', '{"summary": "Understanding your rights regarding unpaid wages", "details": "Employees have legal protections for wage and hour violations...", "steps": ["Document hours worked", "File complaint with labor board", "Seek legal counsel"]}', 50),
('Consumer Rights for Defective Products', 'card', 'consumer', '{"summary": "Your rights when purchasing defective goods", "details": "Consumers have warranty and return rights...", "steps": ["Keep receipts", "Contact manufacturer", "File complaint if needed"]}', 50);

INSERT INTO document_templates (name, description, category, template_content, required_fields, price_cents) VALUES
('Demand Letter for Unpaid Rent', 'Professional letter demanding payment of overdue rent', 'tenant', 'Dear {{landlord_name}},\n\nThis letter serves as formal notice that rent in the amount of ${{rent_amount}} for the property located at {{property_address}} was due on {{due_date}} and remains unpaid.\n\nPlease remit payment within {{notice_period}} days to avoid further legal action.\n\nSincerely,\n{{tenant_name}}', '["landlord_name", "rent_amount", "property_address", "due_date", "notice_period", "tenant_name"]', 100),
('Workplace Complaint Letter', 'Formal complaint letter for workplace issues', 'employment', 'Dear {{recipient_name}},\n\nI am writing to formally document and report the following workplace issue: {{issue_description}}\n\nI request the following resolution: {{desired_resolution}}\n\nI look forward to your prompt attention to this matter.\n\nSincerely,\n{{employee_name}}', '["recipient_name", "issue_description", "desired_resolution", "employee_name"]', 100);

-- Grant necessary permissions (adjust based on your Supabase setup)
-- These would typically be handled by Supabase's authentication system
