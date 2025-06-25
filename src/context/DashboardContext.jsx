import { createContext, useState, useContext, useEffect } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const initialState = {
    dashboardName: "Lungora",
    description: "AI MODEL",
    logo: null,
    logoPreview: "/placeholder.svg",
  };

  const [dashboardSettings, setDashboardSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('dashboardSettings');
      return savedSettings ? JSON.parse(savedSettings) : initialState;
    }
    return initialState;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardSettings', JSON.stringify(dashboardSettings));
    }
  }, [dashboardSettings]);

  const updateDashboardSettings = (newSettings) => {
    setDashboardSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <DashboardContext.Provider
      value={{ dashboardSettings, updateDashboardSettings }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => useContext(DashboardContext);