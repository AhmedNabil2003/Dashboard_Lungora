import { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMobileSidebar = () => setShowMobileSidebar(!showMobileSidebar);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        showMobileSidebar,
        isMobile,
        setIsMobile,
        setSidebarOpen,
        setShowMobileSidebar,
        toggleMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
