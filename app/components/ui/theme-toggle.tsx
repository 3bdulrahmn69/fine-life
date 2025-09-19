'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  FiMonitor,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiCheck,
} from 'react-icons/fi';
import { BiHeart } from 'react-icons/bi';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from './dropdown';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const themes = [
    {
      value: 'system',
      label: 'System',
      icon: FiMonitor,
      description: 'Match your OS setting',
    },
    {
      value: 'light',
      label: 'Light',
      icon: FiSun,
      description: 'Fresh and clean',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: FiMoon,
      description: 'Easy on the eyes',
    },
    {
      value: 'life',
      label: 'Life',
      icon: BiHeart,
      description: 'Vibrant and colorful',
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <Dropdown>
      <DropdownTrigger className="flex items-center gap-2 bg-primary-button hover:bg-primary-button-hover text-primary-button-foreground px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
        <currentTheme.icon className="w-5 h-5" />
        <span className="hidden sm:inline">{currentTheme.label}</span>
        <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
      </DropdownTrigger>

      <DropdownContent align="end" className="w-56">
        {themes.map((themeOption) => (
          <DropdownItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`flex items-center gap-3 ${
              theme === themeOption.value
                ? 'bg-primary-accent text-primary-accent-foreground'
                : ''
            }`}
          >
            <themeOption.icon className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="font-medium">{themeOption.label}</span>
              <span className="text-xs text-primary-muted-foreground">
                {themeOption.description}
              </span>
            </div>
            {theme === themeOption.value && (
              <FiCheck className="w-4 h-4 ml-auto text-primary-accent-foreground" />
            )}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};

export default ThemeToggle;
