# Snow X - Digital Subscription Store

A modern, production-ready e-commerce platform for selling digital subscriptions and accounts. Built with Next.js 15, TypeScript, Prisma, and Tailwind CSS.

![Snow X](public/snowx.png)

## ✨ Features

- **🛒 E-Commerce Core**
  - Product catalog with categories
  - Shopping cart & checkout
  - Order management
  - Digital account delivery system

- **👤 User Management**
  - Authentication via Kinde
  - User profiles & order history
  - Wishlist functionality
  - Review system

- **🔐 Admin Panel**
  - Dashboard with analytics
  - Product & category management
  - Order tracking
  - Inventory management
  - Filter options management

- **💳 Payments**
  - Stripe integration
  - Secure checkout
  - Webhook handling

- **🌍 Internationalization**
  - English & Arabic support
  - RTL layout support

- **⚡ Performance**
  - Server-side rendering
  - Image optimization
  - Redis caching (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Kinde account
- Stripe account
- UploadThing account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/snow-x.git
   cd snow-x
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── admin/         # Admin panel
│   │   ├── products/      # Product pages
│   │   └── ...
│   └── api/               # API routes
├── actions/               # Server actions
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── shop/             # Shop components
│   └── ui/               # UI primitives
├── lib/                   # Utilities & config
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🔧 Configuration

See [.env.example](.env.example) for all required environment variables.

### Key Services

| Service | Purpose | Required |
|---------|---------|----------|
| PostgreSQL | Database | ✅ |
| Kinde | Authentication | ✅ |
| Stripe | Payments | ✅ |
| UploadThing | File uploads | ✅ |
| Resend | Emails | Optional |
| Upstash Redis | Caching | Optional |

## 📖 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Reference](docs/API.md)
- [Contributing](CONTRIBUTING.md)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma
- **Styling**: Tailwind CSS
- **Auth**: Kinde
- **Payments**: Stripe
- **Uploads**: UploadThing
- **Email**: Resend

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support, email support@snowx.com or open an issue.
