

````markdown
# Local Business Directory

A modern local business directory platform built with Next.js 15.5.0

## Features

- 🔐 **Dual Authentication**: Google OAuth & Email/Password login
- 🏢 **Business Listings**: Complete business profiles with images, contact info, and reviews
- 🔍 **Advanced Search**: Text search with category and location filters
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⭐ **Review System**: Customer reviews and ratings
- 💼 **Business Dashboard**: Manage listings and view analytics
- 🎯 **Premium Listings**: Featured placement and priority in search
- 📊 **Admin Panel**: Approve/reject businesses and manage categories

## Tech Stack

- **Frontend**: Next.js 15.5.0, React 19.1.0, Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider
- **Database**: MongoDB with Mongoose ODM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd local-business-directory
   npm install
````

2. **Environment Setup**

   ```bash
   cp .env.local.example .env.local
   # Add your MongoDB URI and Google OAuth credentials
   ```

3. **Database Setup**

   ```bash
   # Seed initial categories
   node src/scripts/seedCategories.js run
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   ```

## Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/local-business-directory
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utilities and configurations
├── models/              # MongoDB/Mongoose models
├── providers/           # Context providers
└── scripts/             # Database seed scripts
```

## Deployment

1. **Vercel** (Recommended)

   * Connect your GitHub repository
   * Add environment variables
   * Deploy automatically

2. **MongoDB Atlas**

   * Create a cluster
   * Update MONGODB\_URI in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request






