import { FaSun, FaMoon } from 'react-icons/fa';

import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle({ className }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div
      onClick={toggleDarkMode}
      className={`flex items-center cursor-pointer px-4 py-3 w-full ${className}`}
    >
      <div>
        {darkMode ? (
          <FaSun className="text-yellow-400 mr-[10px]" size={14} />
        ) : (
          <FaMoon className="text-gray-700 mr-[10px]" size={14} />
        )}
      </div>
      Chế độ tối
    </div>
  );
}

export default ThemeToggle;