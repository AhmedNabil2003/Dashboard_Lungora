const colors = {
  primary: {
    light: "#0369a1", 
    dark: "#38bdf8",
  },
  secondary: {
    light: "#6b7280", 
    dark: "#9ca3af", 
  },
  background: {
    light: "#ffffff",
    dark: "#111827", 
  },
  surface: {
    light: "#f9fafb", 
    dark: "#1f2937", 
  },
  card: {
    light: "#ffffff",
    dark: "#1f2937", 
  },
  text: {
    primary: {
      light: "#1f2937", 
      dark: "#f9fafb",
    },
    secondary: {
      light: "#6b7280",
      dark: "#9ca3af", 
    },
    disabled: {
      light: "#9ca3af",
      dark: "#6b7280",
    },
  },
  border: {
    light: "#e5e7eb", 
    dark: "#374151", 
  },
  input: {
    light: "#f9fafb",
    dark: "#1f2937", 
  },
  success: {
    light: "#10b981", 
    dark: "#34d399",
  },
  error: {
    light: "#ef4444", 
    dark: "#f87171", 
  },
  warning: {
    light: "#f59e0b", 
    dark: "#fbbf24", 
  },
  info: {
    light: "#3b82f6", 
    dark: "#60a5fa", 
  },
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

const fontSizes = {
  xs: "0.75rem", 
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem", 
  xl: "1.25rem", 
  "2xl": "1.5rem", 
  "3xl": "1.875rem", 
  "4xl": "2.25rem", 
  "5xl": "3rem", 
};

const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", 
  1: "0.25rem", 
  1.5: "0.375rem", 
  2: "0.5rem", 
  2.5: "0.625rem", 
  3: "0.75rem", 
  3.5: "0.875rem", 
  4: "1rem", 
  5: "1.25rem", 
  6: "1.5rem", 
  8: "2rem", 
  10: "2.5rem", 
  12: "3rem", 
  16: "4rem",
  20: "5rem", 
  24: "6rem", 
  32: "8rem", 
  40: "10rem", 
  48: "12rem", 
  56: "14rem", 
  64: "16rem", 
};

const borderRadius = {
  none: "0",
  sm: "0.125rem",
  DEFAULT: "0.25rem", 
  md: "0.375rem", 
  lg: "0.5rem", 
  xl: "0.75rem", 
  "2xl": "1rem", 
  "3xl": "1.5rem", 
  full: "9999px",
};

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


export const getColor = (colorName, colorVariant, mode = "light") => {
  if (colorVariant) {
    return colors[colorName]?.[colorVariant] || colors.primary[mode];
  }
  return colors[colorName]?.[mode] || colors.primary[mode];
};

export const getTextColor = (variant = "primary", mode = "light") => {
  return colors.text[variant]?.[mode] || colors.text.primary[mode];
};

export const getSkyColor = (shade = 700) => {
  return colors.sky[shade] || colors.sky[700];
};

export const createStyles = (isDarkMode, isRTL) => {
  const mode = isDarkMode ? "dark" : "light";
  
  return {
    app: {
      backgroundColor: colors.background[mode],
      color: colors.text.primary[mode],
      direction: isRTL ? "rtl" : "ltr",
      transition: "background-color 0.3s, color 0.3s",
    },
    
    card: {
      backgroundColor: colors.card[mode],
      borderColor: colors.border[mode],
      boxShadow: shadows.md,
      borderRadius: borderRadius.lg,
    },
    
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
    
    input: {
      backgroundColor: colors.input[mode],
      borderColor: colors.border[mode],
      color: colors.text.primary[mode],
      borderRadius: borderRadius.md,
    },
    
    sidebar: {
      backgroundColor: colors.card[mode],
      borderColor: colors.border[mode],
      color: colors.text.primary[mode],
    },
    
    header: {
      backgroundColor: colors.card[mode],
      borderColor: colors.border[mode],
      color: colors.text.primary[mode],
    },
  };
};

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

export default theme;