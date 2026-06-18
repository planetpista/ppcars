# Planet Pista Vehicle Platform

A multilingual vehicle rental and sales platform for West Africa, built with React, TypeScript, and Supabase.

## Features

- **Vehicle Listings**: Browse, rent, or purchase vehicles (cars, motorcycles, SUVs)
- **Multilingual**: French and English support
- **Multi-currency**: XOF (CFA), USD, EUR
- **User Accounts**: Individual and Professional seller profiles
- **Admin Dashboard**: Manage listings and users
- **PayPal Integration**: Secure payment processing
- **Real-time Updates**: Live listing updates via Supabase

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Payments**: PayPal SDK

## Admin Access

The admin dashboard is accessible with:
- **Email**: planetpista@gmail.com
- **Password**: Shalom1997

Admin features:
- Overview statistics (listings, users, professionals)
- Manage all vehicle listings (view, delete)
- View all registered users

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

## Project Structure

```
src/
├── components/
│   ├── AdminDashboard.tsx    # Admin panel
│   ├── AnnouncementsList.tsx # Vehicle listings grid
│   ├── AuthModal.tsx         # Login/Register modal
│   ├── CreateVehicleModal.tsx# Create listing form
│   ├── HeroSection.tsx       # Search form
│   ├── Navigation.tsx        # Top nav
│   └── ...
├── hooks/
│   ├── useAuth.ts           # Auth state & methods
│   └── useVehicles.ts       # Vehicle data fetching
├── services/
│   ├── paymentService.ts    # PayPal integration
│   └── storageService.ts    # File uploads
├── data/
│   ├── carBrands.ts         # Car brand/model data
│   └── countries.ts         # Country list
└── lib/
    └── supabase.ts          # Supabase client
```

## Database Schema

### Tables

- **profiles**: User profiles (particular/professional)
- **vehicles**: Vehicle listings
- **transactions**: Payment records

### Storage

- **vehicle-images**: Vehicle photo uploads

## License

Private project - All rights reserved
