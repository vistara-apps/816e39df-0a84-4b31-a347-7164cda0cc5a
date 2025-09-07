# PocketLegal Implementation Guide

This document provides a comprehensive guide for implementing and deploying the PocketLegal application.

## 🚀 Quick Start

### 1. Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and npm installed
- **Git** for version control
- **Supabase account** for database
- **OnchainKit API key** for Base integration
- **OpenAI API key** for content generation
- **WalletConnect Project ID** for wallet connections

### 2. Environment Setup

#### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# OnchainKit API Key for Base integration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# OpenAI API Key for content generation
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WalletConnect Project ID for RainbowKit
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: Stripe for payments (if using traditional payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### How to Get API Keys

**OnchainKit API Key:**
1. Visit [OnchainKit](https://onchainkit.xyz)
2. Sign up/login with your account
3. Create a new project
4. Copy the API key from your dashboard

**OpenAI API Key:**
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up/login to your account
3. Go to API Keys section
4. Create a new secret key
5. Copy and store securely

**WalletConnect Project ID:**
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up/login to your account
3. Create a new project
4. Copy the Project ID from your project dashboard

**Supabase Setup:**
1. Visit [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon public key

### 3. Database Setup

#### Step 1: Create Supabase Project
1. Create a new project in Supabase
2. Wait for the project to be fully provisioned
3. Note down your project URL and API keys

#### Step 2: Run Database Schema
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the contents of `database/schema.sql`
4. Paste and execute the SQL script
5. Verify all tables are created successfully

#### Step 3: Verify Setup
Check that the following tables exist:
- `users`
- `legal_content`
- `document_templates`
- `transactions`
- `user_content_access`
- `generated_documents`

### 4. Local Development

```bash
# Clone the repository
git clone <repository-url>
cd pocketlegal-base-miniapp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## 🏗️ Architecture Overview

### Frontend Architecture
- **Next.js 15** with App Router for the main framework
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **RainbowKit + Wagmi** for wallet connections
- **React Context** for state management

### Backend Architecture
- **Supabase** for database and authentication
- **Row Level Security (RLS)** for data protection
- **PostgreSQL** for relational data storage
- **Real-time subscriptions** for live updates

### Payment Architecture
- **OnchainKit** for crypto payments on Base
- **Micro-transaction model** for content access
- **Transaction tracking** in database
- **Access control** based on payment status

## 💳 Payment System Implementation

### Payment Flow
1. User selects content/template
2. Payment modal displays pricing
3. User connects wallet (if needed)
4. Payment is processed via OnchainKit
5. Transaction is recorded in database
6. Access is granted immediately

### Payment Service (`lib/payment.ts`)
The PaymentService handles:
- Transaction creation
- Payment processing
- Access verification
- Transaction history
- Refund processing

### Database Integration
Payments are tracked through:
- `transactions` table for payment records
- `user_content_access` table for access permissions
- Automatic access granting upon successful payment

## 🔐 Security Implementation

### Authentication
- **Wallet-based authentication** using user's crypto wallet
- **No passwords** required
- **Automatic user creation** on first wallet connection

### Authorization
- **Row Level Security (RLS)** policies in Supabase
- **User-specific data access** only
- **Content access control** based on purchases

### Data Protection
- **Input validation** on all user inputs
- **SQL injection prevention** via Supabase client
- **XSS protection** via React's built-in sanitization

## 📱 User Experience

### Wallet Connection
Users can connect wallets using:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Other supported wallets via RainbowKit

### Payment UX
- **Clear pricing display** before purchase
- **One-click payments** for returning users
- **Instant access** after successful payment
- **Transaction history** for reference

### Content Access
- **Immediate access** to purchased content
- **Lifetime access** to purchased items
- **Mobile-optimized** viewing experience

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Complete PocketLegal implementation"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Import the project
   - Configure environment variables in Vercel dashboard
   - Deploy

3. **Environment Variables in Vercel**
   Add all environment variables from `.env.local` to Vercel:
   - Go to Project Settings > Environment Variables
   - Add each variable with its value
   - Redeploy if needed

### Custom Server Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Configure Environment**
   Ensure all environment variables are set in your production environment.

## 🔧 Configuration Options

### Pricing Configuration
Update pricing in `lib/payment.ts`:

```typescript
export const PRICING = {
  LEGAL_CARD: 50, // $0.50
  LEGAL_GUIDE: 75, // $0.75
  DOCUMENT_TEMPLATE: 100, // $1.00
  PREMIUM_CONTENT: 150, // $1.50
} as const;
```

### Content Management
Add new legal content via Supabase dashboard:

1. Go to Table Editor > legal_content
2. Insert new row with required fields:
   - title
   - content_type
   - category
   - content (JSON)
   - price_cents

### Template Management
Add document templates via Supabase dashboard:

1. Go to Table Editor > document_templates
2. Insert new row with:
   - name
   - description
   - category
   - template_content
   - required_fields (JSON array)
   - price_cents

## 🧪 Testing

### Local Testing
```bash
# Run development server
npm run dev

# Test wallet connection
# Test payment flow (uses simulation)
# Test content access
# Test document generation
```

### Production Testing
1. Deploy to staging environment
2. Test with real wallet connections
3. Test payment processing
4. Verify database operations
5. Test on mobile devices

## 📊 Monitoring and Analytics

### Database Monitoring
Monitor via Supabase dashboard:
- User registrations
- Transaction volume
- Content access patterns
- Error rates

### Application Monitoring
- Use Vercel Analytics for performance
- Monitor API response times
- Track user engagement
- Monitor payment success rates

## 🔄 Maintenance

### Regular Tasks
- **Database backups** (automatic with Supabase)
- **API key rotation** as needed
- **Content updates** via dashboard
- **Security updates** for dependencies

### Scaling Considerations
- **Database scaling** via Supabase Pro
- **CDN optimization** for static assets
- **API rate limiting** for high traffic
- **Caching strategies** for content

## 🆘 Troubleshooting

### Common Issues

**Wallet Connection Issues:**
- Verify WalletConnect Project ID
- Check network configuration
- Ensure wallet is on Base network

**Payment Issues:**
- Verify OnchainKit API key
- Check Base network status
- Verify wallet has sufficient funds

**Database Issues:**
- Check Supabase connection
- Verify RLS policies
- Check API key permissions

**Build Issues:**
- Clear `.next` folder
- Reinstall dependencies
- Check TypeScript errors

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📞 Support

For implementation support:
1. Check this implementation guide
2. Review the main README.md
3. Check GitHub Issues
4. Create a new issue with detailed information

## 🔮 Future Enhancements

Planned features:
- **Multi-language support**
- **Advanced document templates**
- **Legal professional verification**
- **Community-contributed content**
- **Mobile app version**
- **Integration with more payment providers**
