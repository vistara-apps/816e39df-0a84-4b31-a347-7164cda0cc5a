# PocketLegal - Base Mini App

Your rights, simplified and actionable, right in your pocket.

## 🚀 Overview

PocketLegal is a Base Mini App that provides easily understandable and actionable legal rights information and tools for everyday situations, accessible via Farcaster frames. Built with micro-transactions for pay-per-access content.

## ✨ Features

- **On-Demand Rights Reference**: Bite-sized, easily digestible explanations of common legal rights
- **Situation-Specific Quick Guides**: Curated content and step-by-step guides for specific scenarios
- **Basic Document Generator**: Generate basic legal letters or notices based on user input
- **Micro-Transaction Payments**: Pay-per-access model for legal content and document templates
- **Wallet Integration**: Connect with crypto wallets for seamless payments
- **User Dashboard**: Track purchases, access history, and generated documents

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Wallet-based authentication
- **Payments**: Crypto payments via OnchainKit
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS
- **AI**: OpenAI API for content generation
- **TypeScript**: Full type safety
- **Wallet Connection**: RainbowKit + Wagmi

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pocketlegal-base-miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key
   - `OPENAI_API_KEY`: Your OpenAI API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   ├── providers.tsx      # MiniKit provider setup
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── AppShell.tsx       # Main app layout
│   ├── InfoCard.tsx       # Information display cards
│   ├── ActionLink.tsx     # Action buttons
│   ├── Modal.tsx          # Modal dialogs
│   └── ...
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript type definitions
│   ├── constants.ts       # App constants and sample data
│   ├── utils.ts           # Utility functions
│   └── openai.ts          # OpenAI integration
└── public/                # Static assets
```

## Key Components

### AppShell
Main application layout with header, navigation, and footer.

### CategoryGrid
Displays legal categories (Tenant, Employment, Consumer, Traffic, Arrests).

### LegalContentCard
Shows individual legal rights information with purchase options.

### DocumentGenerator
Generates legal documents based on user input and templates.

## Business Model

- **Micro-transactions**: Pay-per-access for specific guides ($0.50) or template generation ($1.00)
- **Low barrier to entry**: Immediate access to essential legal support
- **Scalable**: Revenue generation without complex subscription management

## Legal Categories

1. **Tenant Rights**: Housing and rental rights
2. **Employment Rights**: Workplace and labor rights  
3. **Consumer Rights**: Shopping and service rights
4. **Traffic Rights**: Traffic stops and violations
5. **Arrest Rights**: Rights during arrests

## API Integration

- **OnchainKit**: Base blockchain integration
- **OpenAI**: Content generation and document creation
- **MiniKit**: Farcaster frame interactions

## Development

### Adding New Legal Content

1. Add content to `lib/constants.ts` in the `SAMPLE_LEGAL_CONTENT` array
2. Follow the `LegalContent` interface structure
3. Include proper pricing and category classification

### Adding New Document Templates

1. Add templates to `DOCUMENT_TEMPLATES` in `lib/constants.ts`
2. Define required input fields
3. Update the document generator component

### Styling Guidelines

- Use the defined design system tokens
- Follow mobile-first responsive design
- Maintain accessibility standards
- Use the glass-card effect for UI elements

## Deployment

The app is designed to be deployed as a Base Mini App accessible through Farcaster frames.

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended)
   - Netlify
   - Custom server

3. **Configure environment variables** in your deployment platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application provides general legal information and should not be considered as legal advice. Always consult with a qualified attorney for specific legal situations.
