// // theme.js
// import { extendTheme } from "@chakra-ui/react";

// const config = {
//   initialColorMode: "light", // الوضع الافتراضي
//   useSystemColorMode: false, // تجاهل نظام الجهاز
// };

// const theme = extendTheme({ config });

// export default theme;

// This file contains theme configuration for the application
// src/theme.jsx

// تعريف الألوان للوضع النهاري والليلي
const colors = {
  primary: {
    light: "#0369a1", // sky-700
    dark: "#38bdf8", // sky-400
  },
  secondary: {
    light: "#6b7280", // gray-500
    dark: "#9ca3af", // gray-400
  },
  background: {
    light: "#ffffff",
    dark: "#111827", // gray-900
  },
  surface: {
    light: "#f9fafb", // gray-50
    dark: "#1f2937", // gray-800
  },
  card: {
    light: "#ffffff",
    dark: "#1f2937", // gray-800
  },
  text: {
    primary: {
      light: "#1f2937", // gray-800
      dark: "#f9fafb", // gray-50
    },
    secondary: {
      light: "#6b7280", // gray-500
      dark: "#9ca3af", // gray-400
    },
    disabled: {
      light: "#9ca3af", // gray-400
      dark: "#6b7280", // gray-500
    },
  },
  border: {
    light: "#e5e7eb", // gray-200
    dark: "#374151", // gray-700
  },
  input: {
    light: "#f9fafb", // gray-50
    dark: "#1f2937", // gray-800
  },
  success: {
    light: "#10b981", // emerald-500
    dark: "#34d399", // emerald-400
  },
  error: {
    light: "#ef4444", // red-500
    dark: "#f87171", // red-400
  },
  warning: {
    light: "#f59e0b", // amber-500
    dark: "#fbbf24", // amber-400
  },
  info: {
    light: "#3b82f6", // blue-500
    dark: "#60a5fa", // blue-400
  },
  // تعريف كامل لألوان السماء (sky)
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
};

// تعريف أحجام الخطوط
const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  md: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
};

// تعريف المسافات
const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px
};

// تعريف نصف القطر للزوايا
const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
};

// تعريف الظلال
const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
};

// تعريف متغيرات RTL
const rtl = {
  marginLeft: "margin-right",
  marginRight: "margin-left",
  paddingLeft: "padding-right",
  paddingRight: "padding-left",
  left: "right",
  right: "left",
  borderLeft: "border-right",
  borderRight: "border-left",
  textAlign: {
    left: "right",
    right: "left",
  },
};

// تصدير كائن الثيم الكامل
export const theme = {
  colors,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
  rtl,
  // إعدادات إضافية
  transitions: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  zIndices: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// دوال مساعدة للوصول إلى قيم الثيم

// الحصول على لون بناءً على الوضع (نهاري/ليلي)
export const getColor = (colorName, colorVariant, mode = "light") => {
  if (colorVariant) {
    return colors[colorName]?.[colorVariant] || colors.primary[mode];
  }
  return colors[colorName]?.[mode] || colors.primary[mode];
};

// الحصول على لون نص بناءً على الوضع (نهاري/ليلي)
export const getTextColor = (variant = "primary", mode = "light") => {
  return colors.text[variant]?.[mode] || colors.text.primary[mode];
};

// الحصول على لون سماء محدد
export const getSkyColor = (shade = 700) => {
  return colors.sky[shade] || colors.sky[700];
};

// إنشاء أنماط CSS للعنصر بناءً على الوضع والاتجاه
export const createStyles = (isDarkMode, isRTL) => {
  const mode = isDarkMode ? "dark" : "light";
  
  return {
    // أنماط عامة
    app: {
      backgroundColor: colors.background[mode],
      color: colors.text.primary[mode],
      direction: isRTL ? "rtl" : "ltr",
      transition: "background-color 0.3s, color 0.3s",
    },
    
    // أنماط البطاقات
    card: {
      backgroundColor: colors.card[mode],
      borderColor: colors.border[mode],
      boxShadow: shadows.md,
      borderRadius: borderRadius.lg,
    },
    
    // أنماط الأزرار
    button: {
      primary: {
        backgroundColor: colors.primary[mode],
        color: mode === "light" ? "#ffffff" : "#1f2937",
        borderRadius: borderRadius.md,
      },
      secondary: {
        backgroundColor: "transparent",
        color: colors.primary[mode],
        borderColor: colors.primary[mode],
        borderRadius: borderRadius.md,
      },
      danger: {
        backgroundColor: colors.error[mode],
        color: "#ffffff",
        borderRadius: borderRadius.md,
      },
    },
    
    // أنماط حقول الإدخال
    input: {
      backgroundColor: colors.input[mode],
      borderColor: colors.border[mode],
      color: colors.text.primary[mode],
      borderRadius: borderRadius.md,
    },
    
    // أنماط الشريط الجانبي
    sidebar: {
      backgroundColor: colors.card[mode],
      borderColor: colors.border[mode],
      color: colors.text.primary[mode],
    },
    
    // أنماط الرأس
    header: {
      backgroundColor: colors.card[mode],
      borderColor: colors.border[mode],
      color: colors.text.primary[mode],
    },
  };
};

// دالة لإنشاء أنماط CSS للعناصر المتأثرة بالاتجاه (RTL/LTR)
export const createRTLStyles = (isRTL) => {
  if (!isRTL) return {};
  
  return {
    marginLeft: "margin-right",
    marginRight: "margin-left",
    paddingLeft: "padding-right",
    paddingRight: "padding-left",
    left: "right",
    right: "left",
    borderLeft: "border-right",
    borderRight: "border-left",
    textAlign: "right",
  };
};

// تصدير الثيم كافتراضي
export default theme;