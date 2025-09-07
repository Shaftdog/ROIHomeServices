# ROI Home Services

A modern, professional website for ROI Home Services - Central Florida's premier property valuation and real estate consulting company.

## 🚀 **Tech Stack**

- **Framework**: [Next.js 15.2.3](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4.1](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Forms & Validation**: Form handling with Zod schema validation

## 📋 **Requirements**

- **Node.js**: 20.x (LTS)
- **npm**: 9.x or later

## 🛠️ **Getting Started**

### **1. Clone the Repository**
```bash
git clone https://github.com/Shaftdog/ROIHomeServices.git
cd ROIHomeServices
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
Copy the example environment file and configure your variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:
```env
# Required for Calendly integration
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/consultation

# Optional: Additional configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
CONTACT_EMAIL=your-email@domain.com
```

### **4. Run Development Server**
```bash
npm run dev
```

Your website will be available at: **http://localhost:9002**

## 📱 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## 🏗️ **Project Structure**

```
ROIHomeServices/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── book/              # Appraisal booking system
│   │   ├── case-studies/      # Success stories
│   │   ├── clients/           # Client type pages
│   │   ├── contact/           # Contact information
│   │   ├── insights/          # Market insights blog
│   │   ├── offerings/         # Services overview
│   │   ├── sectors/           # Industry sectors
│   │   ├── services/          # Service detail pages
│   │   └── solutions/         # Solution pages
│   ├── components/            # Reusable UI components
│   │   ├── layout/            # Navigation and footer
│   │   ├── modals/            # Modal components
│   │   ├── scheduler/         # Booking system components
│   │   ├── shared/            # Common components
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts
│   ├── data/                  # Static data files
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
│   └── landing-pages/         # Static landing pages
│       └── central-florida/   # Central Florida landing page
├── .idx/                      # Development environment config
└── docs/                      # Project documentation
    └── landing-pages/         # Landing pages documentation
```

## 🎨 **Key Features**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Professional design with shadcn/ui components
- **Performance**: Next.js 15 with App Router and Turbopack
- **Booking System**: Integrated Calendly scheduling
- **SEO Optimized**: Meta tags and structured data
- **Accessibility**: WCAG compliant components
- **Landing Pages**: Static HTML landing pages for marketing campaigns

## 🎯 **Landing Pages**

### **Central Florida Landing Page**
- **Location**: `/public/landing-pages/central-florida/index.html`
- **Live URL**: `/landing-pages/central-florida/`
- **Features**:
  - SEO-optimized with comprehensive meta tags and schema markup
  - Mobile-responsive design using Tailwind CSS
  - Conversion-focused with strategic CTAs
  - Local search optimization for Central Florida market
  - Customer testimonials and professional credentials
  - Service area coverage for 7 counties

### **Documentation**
- **Landing Pages Guide**: `/docs/landing-pages/README.md`
- **Deployment Guide**: `/docs/landing-pages/deployment-guide.md`
- **GitHub Integration**: `/docs/landing-pages/github-deployment.md`

## 🔧 **Development Tools**

- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives

## 📦 **Key Dependencies**

### **Core Framework**
- Next.js 15.2.3
- React 18.3.1
- TypeScript 5

### **UI & Styling**
- Tailwind CSS 3.4.1
- Radix UI components
- Lucide React icons
- Tailwind CSS Animate

### **Forms & Validation**
- React Hook Form 7.54.2
- Zod 3.24.2
- @hookform/resolvers 4.1.3

### **Additional Libraries**
- Nanoid 5.0.x - Unique ID generation
- Date-fns 3.6.0 - Date manipulation
- Recharts 2.15.1 - Data visualization

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
npm run start
```

### **Environment Variables**
Ensure all required environment variables are set in your production environment.

**Required Variables:**
- `NEXT_PUBLIC_CALENDLY_URL` - Your Calendly scheduling URL
- `NEXT_PUBLIC_APP_URL` - Your application's base URL

**Optional Variables:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For payment processing
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - For Google Analytics
- `CONTACT_EMAIL` - For contact form notifications

See `.env.example` for a complete list of available environment variables.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 **License**

This project is private and proprietary to ROI Home Services.

## 📞 **Support**

For questions or support, contact the development team or refer to the project documentation.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
