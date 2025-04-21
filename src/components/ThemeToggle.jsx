import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <FaSun className="text-yellow-400 w-5 h-5" />
      ) : (
        <FaMoon className="text-gray-700 w-5 h-5" />
      )}
    </button>
  );
}

export default ThemeToggle;