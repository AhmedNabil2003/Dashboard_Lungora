// src/components/ui/LanguageToggle.jsx
import { useLanguage } from "../../context/LanguageContext";
import { Globe } from 'lucide-react'; // تأكد من تثبيت مكتبة lucide-react

export function LanguageToggle() {
  const { language, toggleLanguage, } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={language === "en" ? "تغيير إلى العربية" : "Switch to English"}
    >
      <Globe size={20} className="text-sky-700 dark:text-sky-400" />
      <span className="sr-only">
        {language === "en" ? "تغيير إلى العربية" : "Switch to English"}
      </span>
    </button>
  );
}