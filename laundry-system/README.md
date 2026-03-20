# Laundry Management System

A complete laundry management system built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

- 👤 Role-based authentication (Owner, Admin, Cashier, Delivery, Technician, Customer)
- 📦 Order management system
- 💼 Service & item management
- 💰 Payment tracking
- 📊 Dashboard & analytics
- 🚚 Delivery tracking
- 💾 Complete accounting with costs

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up database schema:
```bash
npx prisma db push
```

3. Seed demo data:
```bash
npx prisma db seed
```

4. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

All demo accounts use password: `123456`

- **Owner**: owner@demo.com
- **Admin**: admin@demo.com
- **Cashier**: cashier@demo.com
- **Delivery**: delivery@demo.com
- **Technician**: tech@demo.com
- **Customer**: customer@demo.com

## Project Structure

```
laundry-system/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   └── auth-provider.tsx  # Auth provider
├── lib/                    # Utilities & configuration
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Helper functions
├── prisma/                # Prisma schema & migrations
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables (`.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret key for NextAuth
- `NEXTAUTH_URL` - App URL (http://localhost:3000 for local development)

## License

MIT
