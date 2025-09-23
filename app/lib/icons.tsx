import {
  FiBriefcase,
  FiMonitor,
  FiTrendingUp,
  FiArchive,
  FiDollarSign,
  FiHome,
  FiCoffee,
  FiTruck,
  FiHeart,
  FiFilm,
  FiShoppingBag,
  FiBook,
  FiMapPin,
  FiActivity,
  FiCreditCard,
  FiSmartphone,
  FiClipboard,
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Mapping of icon name strings to their corresponding React icons
const ICON_COMPONENTS: Record<string, IconType> = {
  FiBriefcase,
  FiMonitor,
  FiTrendingUp,
  FiArchive,
  FiDollarSign,
  FiHome,
  FiCoffee,
  FiTruck,
  FiHeart,
  FiFilm,
  FiShoppingBag,
  FiBook,
  FiMapPin,
  FiActivity,
  FiCreditCard,
  FiSmartphone,
  FiClipboard,
};

// Mapping of category IDs to their corresponding icon name strings
export const CATEGORY_ICONS: Record<string, string> = {
  // Income categories
  salary: 'FiBriefcase',
  freelance: 'FiMonitor',
  investments: 'FiTrendingUp',
  business: 'FiArchive',
  'other-income': 'FiDollarSign',

  // Expense categories
  housing: 'FiHome',
  food: 'FiCoffee',
  transportation: 'FiTruck',
  healthcare: 'FiHeart',
  entertainment: 'FiFilm',
  shopping: 'FiShoppingBag',
  education: 'FiBook',
  travel: 'FiMapPin',
  fitness: 'FiActivity',
  financial: 'FiCreditCard',
  subscriptions: 'FiSmartphone',
  'other-expenses': 'FiClipboard',
};

// Get icon component for a category
export function getCategoryIcon(categoryId: string): IconType {
  const iconName = CATEGORY_ICONS[categoryId];
  return iconName ? ICON_COMPONENTS[iconName] : FiClipboard;
}

// Render category icon as JSX
export function CategoryIcon({
  categoryId,
  className = 'w-5 h-5',
  color,
}: {
  categoryId: string;
  className?: string;
  color?: string;
}) {
  const IconComponent = getCategoryIcon(categoryId);

  return (
    <IconComponent
      className={className}
      style={color ? { color } : undefined}
    />
  );
}
