import { Category, TransactionType } from '../types/transaction';

export const TRANSACTION_CATEGORIES: Category[] = [
  // INCOME CATEGORIES
  {
    id: 'salary',
    name: 'Salary',
    icon: 'FiBriefcase',
    color: '#22c55e',
    type: TransactionType.INCOME,
    subcategories: [
      { id: 'base-salary', name: 'Base Salary', parentId: 'salary' },
      { id: 'overtime', name: 'Overtime', parentId: 'salary' },
      { id: 'bonus', name: 'Bonus', parentId: 'salary' },
      { id: 'commission', name: 'Commission', parentId: 'salary' },
    ],
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'FiMonitor',
    color: '#3b82f6',
    type: TransactionType.INCOME,
    subcategories: [
      { id: 'web-dev', name: 'Web Development', parentId: 'freelance' },
      { id: 'design', name: 'Design', parentId: 'freelance' },
      { id: 'consulting', name: 'Consulting', parentId: 'freelance' },
      { id: 'content', name: 'Content Creation', parentId: 'freelance' },
    ],
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: 'FiTrendingUp',
    color: '#10b981',
    type: TransactionType.INCOME,
    subcategories: [
      { id: 'dividends', name: 'Dividends', parentId: 'investments' },
      { id: 'capital-gains', name: 'Capital Gains', parentId: 'investments' },
      { id: 'crypto', name: 'Cryptocurrency', parentId: 'investments' },
      { id: 'real-estate', name: 'Real Estate', parentId: 'investments' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'FiBuilding',
    color: '#8b5cf6',
    type: TransactionType.INCOME,
    subcategories: [
      { id: 'revenue', name: 'Revenue', parentId: 'business' },
      { id: 'partnerships', name: 'Partnerships', parentId: 'business' },
      { id: 'licensing', name: 'Licensing', parentId: 'business' },
    ],
  },
  {
    id: 'other-income',
    name: 'Other Income',
    icon: 'FiDollarSign',
    color: '#f59e0b',
    type: TransactionType.INCOME,
    subcategories: [
      { id: 'gifts', name: 'Gifts', parentId: 'other-income' },
      { id: 'cashback', name: 'Cashback', parentId: 'other-income' },
      { id: 'refunds', name: 'Refunds', parentId: 'other-income' },
      { id: 'side-hustle', name: 'Side Hustle', parentId: 'other-income' },
    ],
  },

  // EXPENSE CATEGORIES
  {
    id: 'housing',
    name: 'Housing',
    icon: 'FiHome',
    color: '#ef4444',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'rent', name: 'Rent/Mortgage', parentId: 'housing' },
      { id: 'utilities', name: 'Utilities', parentId: 'housing' },
      { id: 'internet', name: 'Internet', parentId: 'housing' },
      { id: 'maintenance', name: 'Maintenance', parentId: 'housing' },
      { id: 'insurance', name: 'Insurance', parentId: 'housing' },
    ],
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'FiUtensilsCrossed',
    color: '#f97316',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'groceries', name: 'Groceries', parentId: 'food' },
      { id: 'restaurants', name: 'Restaurants', parentId: 'food' },
      { id: 'takeout', name: 'Takeout/Delivery', parentId: 'food' },
      { id: 'coffee', name: 'Coffee & Snacks', parentId: 'food' },
      { id: 'alcohol', name: 'Alcohol', parentId: 'food' },
    ],
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: 'FiCar',
    color: '#06b6d4',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'fuel', name: 'Fuel', parentId: 'transportation' },
      {
        id: 'public-transport',
        name: 'Public Transport',
        parentId: 'transportation',
      },
      {
        id: 'car-maintenance',
        name: 'Car Maintenance',
        parentId: 'transportation',
      },
      { id: 'parking', name: 'Parking', parentId: 'transportation' },
      { id: 'rideshare', name: 'Uber/Taxi', parentId: 'transportation' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'FiHeart',
    color: '#dc2626',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'doctor', name: 'Doctor Visits', parentId: 'healthcare' },
      { id: 'pharmacy', name: 'Pharmacy', parentId: 'healthcare' },
      { id: 'dental', name: 'Dental', parentId: 'healthcare' },
      {
        id: 'health-insurance',
        name: 'Health Insurance',
        parentId: 'healthcare',
      },
      { id: 'supplements', name: 'Supplements', parentId: 'healthcare' },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'FiFilm',
    color: '#a855f7',
    type: TransactionType.EXPENSE,
    subcategories: [
      {
        id: 'streaming',
        name: 'Streaming Services',
        parentId: 'entertainment',
      },
      { id: 'movies', name: 'Movies & Theater', parentId: 'entertainment' },
      { id: 'gaming', name: 'Gaming', parentId: 'entertainment' },
      { id: 'books', name: 'Books & Media', parentId: 'entertainment' },
      { id: 'hobbies', name: 'Hobbies', parentId: 'entertainment' },
    ],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'FiShoppingBag',
    color: '#ec4899',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'clothing', name: 'Clothing', parentId: 'shopping' },
      { id: 'electronics', name: 'Electronics', parentId: 'shopping' },
      { id: 'home-goods', name: 'Home Goods', parentId: 'shopping' },
      { id: 'personal-care', name: 'Personal Care', parentId: 'shopping' },
      { id: 'gifts-given', name: 'Gifts', parentId: 'shopping' },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'FiBookOpen',
    color: '#0ea5e9',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'courses', name: 'Courses', parentId: 'education' },
      { id: 'books-education', name: 'Books', parentId: 'education' },
      { id: 'certifications', name: 'Certifications', parentId: 'education' },
      { id: 'conferences', name: 'Conferences', parentId: 'education' },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'FiPlane',
    color: '#059669',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'flights', name: 'Flights', parentId: 'travel' },
      { id: 'hotels', name: 'Hotels', parentId: 'travel' },
      { id: 'vacation', name: 'Vacation Expenses', parentId: 'travel' },
      { id: 'business-travel', name: 'Business Travel', parentId: 'travel' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    icon: 'FiActivity',
    color: '#16a34a',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'gym', name: 'Gym Membership', parentId: 'fitness' },
      { id: 'sports', name: 'Sports', parentId: 'fitness' },
      { id: 'wellness', name: 'Wellness Services', parentId: 'fitness' },
      { id: 'equipment', name: 'Equipment', parentId: 'fitness' },
    ],
  },
  {
    id: 'financial',
    name: 'Financial',
    icon: 'FiCreditCard',
    color: '#6366f1',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'bank-fees', name: 'Bank Fees', parentId: 'financial' },
      { id: 'interest', name: 'Interest Payments', parentId: 'financial' },
      {
        id: 'investments-fees',
        name: 'Investment Fees',
        parentId: 'financial',
      },
      { id: 'taxes', name: 'Taxes', parentId: 'financial' },
    ],
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: 'FiSmartphone',
    color: '#8b5cf6',
    type: TransactionType.EXPENSE,
    subcategories: [
      { id: 'software', name: 'Software', parentId: 'subscriptions' },
      { id: 'news', name: 'News & Magazines', parentId: 'subscriptions' },
      { id: 'music', name: 'Music', parentId: 'subscriptions' },
      { id: 'cloud-storage', name: 'Cloud Storage', parentId: 'subscriptions' },
    ],
  },
  {
    id: 'other-expenses',
    name: 'Other Expenses',
    icon: 'FiClipboard',
    color: '#6b7280',
    type: TransactionType.EXPENSE,
    subcategories: [
      {
        id: 'miscellaneous',
        name: 'Miscellaneous',
        parentId: 'other-expenses',
      },
      { id: 'emergency', name: 'Emergency', parentId: 'other-expenses' },
      { id: 'donations', name: 'Donations', parentId: 'other-expenses' },
    ],
  },
];

export const getCategoriesByType = (type: TransactionType): Category[] => {
  return TRANSACTION_CATEGORIES.filter((category) => category.type === type);
};

export const getCategoryById = (id: string): Category | undefined => {
  return TRANSACTION_CATEGORIES.find((category) => category.id === id);
};

export const getSubcategoryById = (
  categoryId: string,
  subcategoryId: string
) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories?.find((sub) => sub.id === subcategoryId);
};

export const getAllSubcategories = (categoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories || [];
};
