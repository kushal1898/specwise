# SpecWise | The Best Tech for Your Budget

**SpecWise** is a modern, data-driven tech comparison platform built for enthusiasts who care about specifications. Compare laptops, phones, and headphones with a focus on performance, value, and precise technical data.

![SpecWise Banner](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=400)

## 🚀 Features

- **📱 Comprehensive Comparisons**: Detailed side-by-side spec comparison for Laptops, Smartphones, and Headphones.
- **📈 Data-Driven Insights**: Performance ratings and value assessments based on real-world specs.
- **🔥 Trending Tech**: Stay updated with the most popular and newly released devices.
- **💾 Saved Items**: Keep track of the gear you're interested in for future reference.
- **✨ Premium UI**: Beautifully designed with dark mode support, glassmorphism, and fluid animations.
- **⚡ Super Fast**: Powered by Vite and React 19 for instantaneous performance.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/specwise.git
   cd specwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to see the results.

## 🚀 Deployment

The project is configured for deployment on **Vercel**. Connect your repository and it will automatically build and deploy.

### Build for Production
```bash
npm run build
```

## 📜 Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build the production-ready bundle.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Run ESLint for code quality checks.

## 🗄️ Database & Data Management

The `scripts/` directory contains utility scripts for database setup and data management:

- `001_create_tables.sql`: SQL script to initialize the Supabase database schema.
- `add-laptops.js`, `generate-headphones.js`, `generate-phones.js`: Scripts to seed the database with product data.
- `update-*-images.js`, `update-*-videos.js`: Utility scripts to update media assets in the database.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ for tech enthusiasts.
