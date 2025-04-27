// src/components/ui/ThemeToggle.jsx
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun } from 'lucide-react'; // تأكد من تثبيت مكتبة lucide-react

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
    >
      {isDarkMode ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-sky-700" />
      )}
    </button>
  );
}