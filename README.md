# 💰 Fine Life - Personal Finance Management Application

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Transform your financial life with **Fine Life** - a comprehensive personal finance management application that provides smart expense tracking, intelligent budget management, automated transaction processing, and multi-currency support to help you build wealth systematically.

![Fine Life Dashboard Preview](/og-home.jpg)

## 🌟 Key Features

### 📊 **Financial Dashboard & Analytics**

- **Real-time Overview**: Comprehensive dashboard showing income, expenses, and net balance
- **Monthly Navigation**: Easy month/year navigation with detailed transaction history
- **Visual Analytics**: Interactive charts and spending category breakdowns
- **Financial Insights**: Automated calculations and trend analysis
- **Progress Tracking**: Monitor your financial progress with comprehensive insights

### 💱 **Multi-Currency Support**

- **150+ Currencies**: Support for major world currencies with real-time exchange rates
- **Automatic Conversion**: Real-time currency conversion using latest exchange rates
- **User Preferences**: Set preferred currency with automatic conversion for all transactions
- **Currency Display**: Smart currency formatting with symbols and regional preferences
- **Exchange Rate API**: Integration with fawazahmed0 currency API using @latest endpoint

### 📊 **Smart Budget Management**

- **Persistent Budgets**: Create and manage budgets that persist across months
- **Category-based Planning**: Set spending limits for specific expense categories
- **Progress Tracking**: Visual progress indicators with spending vs budget comparison
- **Budget Analytics**: Monthly insights and spending pattern analysis
- **Overspend Alerts**: Visual warnings when approaching or exceeding budget limits
- **Flexible Budget Control**: Easy budget creation, editing, and deletion

### ➰ **Automatic Transaction Management**

- **Recurring Transactions**: Set up automatic income and expense transactions
- **Flexible Scheduling**: Daily, weekly, monthly, and yearly recurrence patterns
- **Smart Execution**: Automated processing with cron job integration
- **Manual Override**: Option to manually execute or pause automatic transactions
- **Status Management**: Active, paused, and completed transaction states

### 💳 **Transaction Management**

- **Complete CRUD Operations**: Create, read, update, and delete transactions
- **Rich Categorization**: Extensive category and subcategory system
- **Transaction Types**: Income and expense tracking with detailed metadata
- **Bulk Operations**: Efficient handling of multiple transactions
- **Search & Filter**: Advanced filtering by date, category, type, and amount

### 📤 **Data Import & Export**

- **Multi-Format Support**: Import and export transactions in CSV and Excel (.xlsx) formats
- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop functionality
- **Excel Date Handling**: Smart conversion of Excel serial numbers to readable dates
- **Flexible Date Formats**: Support for multiple date formats (YYYY-MM-DD, MM/DD/YYYY, YYYY/MM/DD, Excel dates)
- **Data Validation**: Comprehensive validation with detailed error reporting
- **File Size Limits**: Optimized file size limits (5MB for CSV, 10MB for Excel)
- **Toast Notifications**: Modern toast notifications for all import/export operations
- **Preview & Validation**: Real-time data preview with error highlighting before import

### 🔐 **Authentication & Security**

- **NextAuth Integration**: Secure authentication with multiple providers
- **Session Management**: Persistent login sessions with automatic refresh
- **User Profiles**: Comprehensive user management system
- **Password Security**: Bcrypt encryption for password protection
- **Route Protection**: Authenticated route guards and middleware

### 🎨 **User Experience**

- **Responsive Design**: Mobile-first design with perfect tablet and desktop support
- **Dark/Light Themes**: Automatic theme detection with manual toggle
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Accessibility**: ARIA compliant with keyboard navigation support
- **Performance Optimized**: Fast loading with efficient caching strategies

## 🏗️ Technical Architecture

### **Frontend Stack**

```typescript
// Core Technologies
- Next.js 15.5.3 (App Router)
- React 19.1.0 (Server Components)
- TypeScript 5.x (Strict Mode)
- Tailwind CSS 4.x (Styling)
- React Icons 5.5.0 (Icon System)
```

### **Backend Stack**

```typescript
// Server & Database
- Next.js API Routes (RESTful APIs)
- MongoDB 6.19.0 (Database)
- Mongoose 8.18.2 (ODM)
- NextAuth 4.24.11 (Authentication)
- bcryptjs 3.0.2 (Password Hashing)
```

### **Key Libraries & Tools**

```typescript
// Utilities & Enhancement
- date-fns 4.1.0 (Date Manipulation)
- recharts 3.2.1 (Data Visualization)
- react-toastify 11.0.5 (Notifications)
- xlsx 0.18.5 (Excel File Processing)
- clsx 2.1.1 (Conditional Classes)
- tailwind-merge 3.3.1 (Tailwind Utilities)
```

## 📁 Project Structure

```
fine-life/
├── 📱 app/                          # Next.js App Router
│   ├── 🏠 (dashboard)/              # Protected Dashboard Routes
│   │   ├── overview/                # Financial Overview & Analytics
│   │   ├── transactions/            # Transaction Management
│   │   ├── budget/                  # Budget Planning & Tracking

│   │   └── components/              # Dashboard-specific Components
│   │
│   ├── 📄 (pages)/                  # Public & Settings Pages
│   │   └── settings/                # User Settings & Preferences
│   │       ├── personal/            # Profile Management
│   │       ├── preferences/         # Currency & Display Settings
│   │       └── security/            # Security Settings
│   │
│   ├── 🔒 auth/                     # Authentication Pages
│   │   ├── signin/                  # Login Page
│   │   ├── signup/                  # Registration Page
│   │   └── auth-config.ts           # Auth Configuration
│   │
│   ├── 🛠️ api/                      # Backend API Routes
│   │   ├── auth/                    # Authentication Endpoints
│   │   ├── transactions/            # Transaction CRUD Operations
│   │   ├── automatic-transactions/  # Auto Transaction Management
│   │   ├── preferences/             # User Preferences API
│   │   └── cron/                    # Scheduled Job Endpoints
│   │
│   ├── 🧩 components/               # Reusable UI Components
│   │   ├── ui/                      # Core UI Components
│   │   ├── sections/                # Landing Page Sections
│   │   └── home/                    # Home Page Components
│   │
│   ├── 📊 data/                     # Static Data & Categories
│   ├── 🎣 hooks/                    # Custom React Hooks
│   ├── 📚 lib/                      # Utility Libraries
│   ├── 📋 models/                   # Database Models (Mongoose)
│   ├── 🔧 providers/                # React Context Providers
│   ├── 🛠️ services/                 # Business Logic Services
│   └── 📝 types/                    # TypeScript Type Definitions
│
├── 🎨 public/                       # Static Assets
├── 📜 scripts/                      # Utility Scripts
└── ⚙️ Configuration Files           # Next.js, TypeScript, Tailwind configs
```

## 🚀 Core Components & Features

### **Transaction Management System**

```typescript
interface Transaction {
  _id?: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  category: string;
  subcategory?: string;
  notes?: string;
  isMandatory: boolean;
  isAutomatic: boolean;
  type: TransactionType; // 'income' | 'expense'
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### **Automatic Transaction System**

```typescript
interface AutomaticTransaction {
  _id?: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  category: string;

  // Recurrence Configuration
  recurrenceType: RecurrenceType; // 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurrenceInterval: number;     // Every N periods
  dayOfMonth?: number;            // For monthly/yearly (1-31)
  dayOfWeek?: number;             // For weekly (0=Sunday, 1=Monday, etc.)

  // Scheduling & Status
  startDate: Date;
  endDate?: Date;
  nextExecutionDate: Date;
  status: AutoTransactionStatus;  // 'active' | 'paused' | 'completed'
  executionCount: number;
  lastExecuted?: Date;
}
```

### **Multi-Currency System**

```typescript
interface CurrencySystem {
  // Real-time Exchange Rates
  currencyConverter: (from: string, to: string, amount: number) => Promise<number>;

  // 150+ Supported Currencies
  supportedCurrencies: Currency[];

  // User Preferences
  userPreferredCurrency: CurrencyCode;

  // Automatic Conversion
  convertTransactionToUserCurrency: (transaction: Transaction) => ConvertedTransaction;
}
```

### **User Preferences Management**

```typescript
interface UserPreferences {
  userId: string;
  currency: CurrencyCode;    // Preferred currency (USD, EUR, GBP, etc.)
  timezone: string;          // User timezone (UTC, EST, PST, etc.)
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 API Endpoints

### **Transaction Management**

```http
GET    /api/transactions              # List transactions with filters
POST   /api/transactions              # Create new transaction
GET    /api/transactions/[id]         # Get specific transaction
PUT    /api/transactions/[id]         # Update transaction
DELETE /api/transactions/[id]         # Delete transaction
GET    /api/transactions/stats        # Get transaction statistics
```

### **Automatic Transactions**

```http
GET    /api/automatic-transactions           # List automatic transactions
POST   /api/automatic-transactions           # Create automatic transaction
GET    /api/automatic-transactions/[id]      # Get specific auto transaction
PUT    /api/automatic-transactions/[id]      # Update auto transaction
DELETE /api/automatic-transactions/[id]      # Delete auto transaction
POST   /api/automatic-transactions/process   # Process due transactions
POST   /api/automatic-transactions/manual-execute # Manual execution
```

### **User Management**

```http
GET    /api/preferences               # Get user preferences
PUT    /api/preferences               # Update user preferences
POST   /api/user/register             # User registration
GET    /api/user/get-profile          # Get user profile
PUT    /api/user/update-profile       # Update user profile
POST   /api/user/change-password      # Change password
DELETE /api/user/delete-account       # Delete account
```

### **System & Health**

```http
GET    /api/health                    # System health check
POST   /api/cron/execute-automatic-transactions # Cron job execution
GET    /api/cron/health              # Cron system health
```

## ⚡ Advanced Features

### **Intelligent Caching System**

- **Data Caching**: Smart caching for transactions and user data
- **Cache Invalidation**: Automatic cache updates on data changes
- **Performance Optimization**: Reduced API calls and faster loading

### **Responsive Component Library**

```typescript
// Enhanced UI Components
- AmountCurrencyInput: Combined amount and currency selector
- TransactionModal: Full-featured transaction creation/editing
- AutoTransactionForm: Comprehensive automatic transaction setup
- ConvertedAmount: Real-time currency conversion display
- SpendingCategories: Visual category breakdown
- MonthYearNavigator: Smooth date navigation
```

### **Real-time Currency Conversion**

```typescript
// Currency Converter Integration
const convertAmount = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  // Uses fawazahmed0 API with @latest endpoint
  // Automatic caching and error handling
  // Fallback mechanisms for offline usage
};
```

### **Automated Transaction Processing**

```typescript
// Cron Job Integration
export class AutomaticTransactionService {
  static async processAutomaticTransactions(): Promise<{
    processed: number;
    errors: string[];
  }> {
    // Finds due transactions
    // Creates actual transactions
    // Updates next execution dates
    // Handles recurrence patterns
    // Error logging and recovery
  }
}
```

## 🚀 Getting Started

### **Prerequisites**

```bash
# Required Software
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- MongoDB 6+ (local or Atlas)
- Git for version control
```

### **Installation**

1. **Clone the Repository**

```bash
git clone https://github.com/3bdulrahmn69/fine-life.git
cd fine-life
```

2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Configuration**

```bash
# Create .env.local file
cp .env.example .env.local

# Required Environment Variables
MONGODB_URI=mongodb://localhost:27017/fine-life
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional: NextAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

4. **Database Setup**

```bash
# Start MongoDB (if using local instance)
mongod --dbpath /path/to/your/db

# The application will automatically create required collections
```

5. **Development Server**

```bash
# Start development server
npm run dev

# Or with Turbopack (faster)
npm run dev

# Open http://localhost:3000
```

### **Production Deployment**

1. **Build Application**

```bash
npm run build
npm run start
```

2. **Environment Setup**

```bash
# Production Environment Variables
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

3. **Cron Job Configuration**

```bash
# Set up automatic transaction processing
# Run every hour
0 * * * * node /path/to/scripts/run-auto-transactions.js production

# Or use the API endpoint with a cron service
0 * * * * curl -X POST https://your-domain.com/api/cron/execute-automatic-transactions
```

## 📜 Available Scripts

```json
{
  "dev": "next dev --turbopack",              // Development server with Turbopack
  "build": "next build --turbopack",          // Production build
  "start": "next start",                      // Production server
  "lint": "eslint",                           // Code linting
  "type-check": "npx tsc --noEmit",          // TypeScript checking
  "auto:run": "node ./scripts/run-auto-transactions.js local",     // Test auto transactions
  "auto:run:prod": "node ./scripts/run-auto-transactions.js production", // Prod auto transactions
  "test:cron": "node ./scripts/test-cron.js local",               // Test cron jobs
  "test:cron:prod": "node ./scripts/test-cron.js production"      // Prod cron testing
}
```

## 🔍 Usage Examples

### **Creating a Transaction**

```typescript
// Manual Transaction Creation
const transactionData = {
  amount: 1500.00,
  currency: 'USD',
  description: 'Salary Payment',
  category: 'Income',
  subcategory: 'Job',
  type: 'income',
  date: new Date(),
  isMandatory: false,
  isAutomatic: false
};

await fetch('/api/transactions', {
  method: 'POST',
  body: JSON.stringify(transactionData)
});
```

### **Setting Up Automatic Transactions**

```typescript
// Automatic Monthly Rent Payment
const autoTransactionData = {
  amount: 1200.00,
  currency: 'USD',
  description: 'Monthly Rent',
  category: 'Housing',
  subcategory: 'Rent',
  type: 'expense',
  recurrenceType: 'monthly',
  recurrenceInterval: 1,
  dayOfMonth: 1,
  startDate: new Date(),
  isMandatory: true
};

await fetch('/api/automatic-transactions', {
  method: 'POST',
  body: JSON.stringify(autoTransactionData)
});
```

### **Currency Conversion**

```typescript
// Converting Amounts
import { convertAmount, formatCurrency } from './lib/currency';

const convertedAmount = await convertAmount(100, 'USD', 'EUR');
const formatted = formatCurrency(convertedAmount, 'EUR'); // €92.45
```

## 🛡️ Security Features

- **Authentication**: NextAuth.js integration with secure session management
- **Password Hashing**: bcryptjs with salt for secure password storage
- **Input Validation**: Comprehensive server-side validation for all inputs
- **CSRF Protection**: Built-in CSRF protection with NextAuth
- **Route Protection**: Middleware-based route protection for authenticated areas
- **Data Sanitization**: MongoDB injection protection and input sanitization

## 📱 Mobile & Responsive Design

- **Mobile-First**: Designed primarily for mobile devices
- **Responsive Breakpoints**: Optimized for all screen sizes
- **Touch Interactions**: Gesture-friendly interface elements
- **Progressive Web App**: PWA capabilities with offline support
- **Performance**: Optimized bundle size and loading strategies

## 👨‍💻 About the Author

**Abdulrahamn Moussa**  
Full-Stack Developer & Entrepreneur

- **Portfolio**: [3bdulrahmn.vercel.app](https://3bdulrahmn.vercel.app)
- **GitHub**: [@3bdulrahmn69](https://github.com/3bdulrahmn69)
- **Email**: abdulrahamn.moussa.dev@gmail.com

Passionate about creating innovative financial solutions and helping people achieve financial freedom through technology.

## 📄 License

This project is proprietary software. All rights reserved.  
Unauthorized copying, distribution, or use is strictly prohibited.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **MongoDB** - For the flexible NoSQL database
- **fawazahmed0** - For the free currency conversion API
- **Tailwind CSS** - For the utility-first CSS framework
- **React Icons** - For the comprehensive icon library

## 📞 Support & Contact

- **Portfolio**: [3bdulrahmn.vercel.app](https://3bdulrahmn.vercel.app)
- **GitHub**: [@3bdulrahmn69](https://github.com/3bdulrahmn69)
- **Email**: abdulrahamnmoussa69@gmail.com

---

**Transform your financial life with Fine Life** - Start your journey to financial freedom today! 💰✨
