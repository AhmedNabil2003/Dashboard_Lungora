import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import LungoraImage from "../../assets/images.jpg";
import AuthContext from "../../context/AuthContext";
import { useSidebarContext } from "../../context/SidebarContext";
import { ThemeContext } from "../../context/ThemeContext";

const Sidebar = () => {
  // States and contexts
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const {
    isSidebarOpen,
    showMobileSidebar,
    isMobile,
    toggleMobileSidebar,
    setIsMobile,
    setSidebarOpen,
    setShowMobileSidebar,
  } = useSidebarContext();
  const [isTablet, setIsTablet] = useState(false);

  // Menu items configuration
  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: "fa-solid fa-house" },
    { to: "/dashboard/users", label: "Users", icon: "fa-solid fa-users" },
    {
      to: "/dashboard/doctors",
      label: "Doctors",
      icon: "fa-solid fa-user-doctor",
    },
    {
      to: "/dashboard/categories",
      label: "Categories & Articles",
      icon: "fa-solid fa-list",
    },
    {
      to: "/dashboard/lungora-ai",
      label: "Lungora AI",
      icon: "fa-solid fa-robot",
    },
    {
      to: "/dashboard/history",
      label: "History",
      icon: "fa-solid fa-clock-rotate-left",
    },
    { to: "/dashboard/settings", label: "Settings", icon: "fa-solid fa-cog" },
    {
      to: "#",
      label: "Logout",
      icon: "fa-solid fa-sign-out-alt",
      isLogout: true,
    },
  ];

  // Responsive screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Set device type
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);

      // Adjust sidebar state based on screen size
      if (width < 768) {
        setSidebarOpen(false);
        setShowMobileSidebar(false);
      } else if (width < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen, setShowMobileSidebar, setIsMobile]);

  // Logout handler
  const handleLogout = () => {
    setShowModal(false);
    logout();
  };

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 250, damping: 25 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 35 },
    },
  };

  return (
    <>
      {/* Mobile menu toggle button - sits outside the sidebar */}
      {isMobile && !showMobileSidebar && (
        <motion.button
          onClick={toggleMobileSidebar}
          className={`fixed top-1/2 left-2 -translate-y-1/2 z-40 p-2 cursor-pointer rounded-full shadow-2xl border-2 ${
            theme === "light"
              ? "bg-white bg-opacity-20 text-sky-700 border-sky-500 hover:bg-opacity-30"
              : "bg-gray-800 bg-opacity-20 text-white border-gray-600 hover:bg-opacity-30"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i className="fa-solid fa-circle-chevron-right text-lg"></i>
        </motion.button>
      )}

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && showMobileSidebar && (
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <motion.aside
        className={`h-screen ${
          theme === "light"
            ? "bg-gradient-to-r from-sky-700 to-sky-800"
            : "bg-gradient-to-r from-gray-800 to-gray-900"
        } shadow-lg ${isSidebarOpen ? "w-45" : "w-20"} ${
          isMobile ? "fixed top-0 left-0 z-50" : "relative"
        } 
          flex flex-col shadow-2xl transition-all overflow-hidden`}
        variants={sidebarVariants}
        initial="closed"
        animate={isMobile && !showMobileSidebar ? "closed" : "open"}
      >
        {/* Close button positioned outside sidebar border for mobile */}
        {isMobile && showMobileSidebar && (
          <motion.button
            onClick={toggleMobileSidebar}
            className="absolute -right-0 top-1 pb-0 pt-0 bg-red-500 cursor-pointer hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </motion.button>
        )}

        {/* Toggle sidebar button for tablets - outside border */}
        {isTablet && (
          <motion.button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`absolute pb-0 pt-0 -right-0 top-20 cursor-pointer z-10 p-2 rounded-full shadow-lg border-2 transition-all duration-300 ${
              theme === "light"
                ? "bg-sky-600 hover:bg-sky-700 text-white border-white"
                : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i
              className={`fa-solid ${
                isSidebarOpen ? "fa-angle-left" : "fa-angle-right"
              } text-sm text-lg transition-all duration-300`}
            ></i>
          </motion.button>
        )}

        {/* Profile Section */}
        <div className={`px-3 pt-4 ${isMobile ? "pt-10" : ""}`}>
          <ProfileSection isSidebarOpen={isSidebarOpen} theme={theme} />
        </div>

        {/* Navigation Menu */}
        <div className="flex-grow px-3 py-3 overflow-y-auto">
          <div
            className={`rounded-xl shadow-inner p-2.5 flex flex-col h-full ${
              theme === "light"
                ? "bg-white text-gray-800"
                : "bg-gray-800 text-gray-200"
            }`}
          >
            <div className="pt-3 space-y-5 flex-grow">
              {menuItems.map((item) => (
                <div key={item.to}>
                  <MenuItem
                    item={item}
                    isActive={location.pathname === item.to}
                    isSidebarOpen={isSidebarOpen}
                    theme={theme}
                    onClick={
                      item.isLogout
                        ? () => {
                            if (isMobile) toggleMobileSidebar();
                            setShowModal(true);
                          }
                        : isMobile
                        ? toggleMobileSidebar
                        : undefined
                    }
                  />
                  <div
                    className={`w-full my-2 px-3 ${
                      theme === "light"
                        ? "border-t border-slate-300"
                        : "border-t border-gray-600"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setShowModal(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * Profile component for sidebar
 */
const ProfileSection = ({ isSidebarOpen, theme }) => (
  <Link to="/dashboard">
    <motion.div
      className={`flex ${isSidebarOpen ? "items-center" : "justify-center"} ${
        theme === "light" ? "bg-sky-700" : "bg-gray-800"
      } p-3 rounded-lg cursor-pointer hover:bg-sky-800 transition-all duration-300`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <img
          src={LungoraImage}
          alt="Lungora"
          className={`${
            isSidebarOpen ? "w-12 h-12" : "w-10 h-10"
          } rounded-full border-2 border-white object-cover shadow-md hover:scale-105 transition-transform duration-300`}
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      {isSidebarOpen && (
        <div className="ml-3 text-white">
          <h2 className="text-base font-bold truncate">Lungora</h2>
          <p className="text-xs opacity-90">AI MODEL</p>
        </div>
      )}
    </motion.div>
  </Link>
);

/**
 * Menu item component
 */
const MenuItem = ({ item, isActive, isSidebarOpen, theme, onClick }) => {
  const { to, label, icon } = item;

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 3 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={to}
        onClick={onClick}
        className={`flex ${
          !isSidebarOpen ? "justify-center" : "justify-start"
        } items-center py-4 px-3 w-full rounded-lg transition-all duration-300 ${
          isActive
            ? theme === "light"
              ? "bg-gradient-to-r from-sky-500 to-sky-700 shadow-lg text-white"
              : "bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg text-white"
            : theme === "light"
            ? "bg-white text-slate-700 shadow-md hover:bg-sky-200"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        <i
          className={`${icon} ${
            isSidebarOpen
              ? "text-cyan-800 text-lg mr-3"
              : theme === "light"
              ? "text-sky-700"
              : "text-gray-300"
          }`}
        ></i>

        {isSidebarOpen && (
          <span
            className={`text-sm font-medium truncate ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
          >
            {label}
          </span>
        )}
      </Link>
    </motion.div>
  );
};

/**
 * Logout modal component
 */
const LogoutModal = ({ onConfirm, onCancel, theme }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className={`w-80 overflow-hidden rounded-xl shadow-2xl ${
        theme === "light"
          ? "bg-white text-gray-800"
          : "bg-gray-800 text-gray-200"
      }`}
      initial={{ scale: 0.8, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350 }}
    >
      {/* Modal header */}
      <div
        className={`p-4 ${
          theme === "light" ? "bg-sky-600 text-white" : "bg-gray-700 text-white"
        }`}
      >
        <h2 className="text-lg font-semibold flex items-center">
          <i className="fa-solid fa-sign-out-alt mr-2"></i>
          Confirm Logout
        </h2>
      </div>

      {/* Modal body */}
      <div className="p-5">
        <p
          className={`text-gray-600 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to logout from your account?
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <motion.button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors ${
              theme === "light"
                ? "bg-red-500 text-white"
                : "bg-red-700 text-gray-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default Sidebar;
