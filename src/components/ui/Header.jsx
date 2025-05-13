import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { getUserData } from "../../services/apiAuth";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({ name: "", avatar: "", online: false });
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setUser({
          name: userData.fullName || "Guest",
          avatar: userData.imageUser || "/images/default-avatar.png",
          email: userData.email||"No Email",
          online: true,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".user-dropdown")) {
        setIsOpen(false);
      }
      
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest(".mobile-menu-button")) {
        setIsMobileMenuOpen(false);
      }
    };

    // Close mobile menu when screen size changes to desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <header
      className={`shadow-md p-3 flex justify-between items-center border-b border-gray-300 ${
        theme === "light"
          ? "bg-gradient-to-r from-sky-800 to-sky-500"
          : "bg-gradient-to-r from-gray-800 to-gray-600"
      }`}
    >
      {/* Left: Logo and AI Model */}
      <div className="flex items-center space-x-4">
        <motion.div
          className="w-fit flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/dashboard/lungora-ai"
            className="flex items-center space-x-2 text-white hover:text-sky-200 transition duration-300 ease-in-out"
          >
            <motion.i
              className="fa-solid fa-robot text-xl"
              initial={{ rotate: -15, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <span className="font-semibold text-lg">Lungora AI</span>
          </Link>
        </motion.div>
      </div>
      
      {/* Mobile Menu Button - Visible only on small screens */}
      <div className="md:hidden flex justify-center">
        <button 
          className="text-white p-1 rounded-md mobile-menu-button cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Right: User Info & Actions - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Add User Button */}
        <Link
          to="/dashboard/signup"
          className="text-white flex items-center hover:text-sky-200 transition-colors"
          title="Add User"
        >
          <i className="fa-solid fa-user-plus mr-1"></i>
          <span>Add User</span>
        </Link>

        {/* Settings Button */}
        <Link
          to="/dashboard/settings"
          className="text-white flex items-center hover:text-sky-200 transition-colors"
          title="Settings"
        >
          <i className="fa-solid fa-cog mr-1"></i>
          <span>Settings</span>
        </Link>

        {/* Notifications Button with Counter */}
        <button
          className="text-white flex items-center cursor-pointer hover:text-sky-200 transition-colors"
          title="Notifications"
        >
          <div className="relative">
            <i className="fa-solid fa-bell mr-1"></i>
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
          <span>Notifications</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="text-white flex items-center cursor-pointer hover:text-sky-200 transition-colors"
          title={theme === "light" ? "Dark Mode" : "Light Mode"}
        >
          <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"} mr-1`}></i>
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>

        {/* User Profile */}
        <div
          className="relative user-dropdown"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <img
                src={user.avatar || "/images/default-avatar.png"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              {/* Online/Offline Indicator */}
              <div
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                  user.online ? "bg-green-400" : "bg-red-400"
                } border-2 border-white`}
              ></div>
            </div>
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg z-50 ${
                  theme === "light"
                    ? "bg-white text-gray-700"
                    : "bg-gray-800 text-gray-100"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">{user.name || "Guest"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">user@example.com</p>
                </div>
                
                <Link
                  to="/dashboard/profile"
                  className={`block rounded py-2 px-4 text-sm transition-colors flex items-center ${
                    theme === "light"
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <i className="fa-solid fa-user-edit mr-2"></i>
                  Edit Profile
                </Link>
                
                <Link
                  to="/dashboard/settings"
                  className={`block rounded py-2 px-4 text-sm transition-colors flex items-center ${
                    theme === "light"
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <i className="fa-solid fa-cog mr-2"></i>
                  Settings
                </Link>
                
                <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                  <button
                    onClick={() => setShowModal(true)}
                    className={`block w-full text-left rounded py-2 cursor-pointer px-4 text-sm transition-colors flex items-center text-red-500 hover:text-red-700 ${
                      theme === "light"
                        ? "hover:bg-gray-100"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <i className="fa-solid fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="absolute left-0 right-0 top-16 mx-auto w-11/12 max-w-md z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`shadow-lg rounded-lg overflow-hidden ${
              theme === "light" 
                ? "bg-white text-gray-800 border border-gray-200" 
                : "bg-gray-800 text-white border border-gray-700"
            }`}>
              {/* User Profile in Mobile Menu */}
              <div className={`p-4 flex items-center space-x-3 border-b ${
                theme === "light" ? "border-gray-200" : "border-gray-700"
              }`}>
                <div className="relative">
                  <img
                    src={user.avatar || "/images/default-avatar.png"}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      user.online ? "bg-green-400" : "bg-red-400"
                    } border-2 border-white`}
                  ></div>
                </div>
                <div>
                  <p className="font-medium">{user.name || "Guest"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email||"user@gmail.com"}</p>
                </div>
              </div>
              
              {/* Mobile Menu Items */}
              <div className="p-2">
                <Link
                  to="/dashboard/signup"
                  className={`flex items-center p-3 rounded-md ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-user-plus w-6 text-center"></i>
                  <span>Add User</span>
                </Link>
                
                <Link
                  to="/dashboard/settings"
                  className={`flex items-center p-3 rounded-md ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-cog w-6 text-center"></i>
                  <span>Settings</span>
                </Link>
                
                <button
                  className={`w-full flex items-center p-3 rounded-md text-left ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-6 text-center relative">
                    <i className="fa-solid fa-bell"></i>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <span>Notifications</span>
                </button>
                
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-md text-left ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  } transition-colors`}
                >
                  <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"} w-6 text-center`}></i>
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </button>
                
                <div className={`border-t my-2 ${
                  theme === "light" ? "border-gray-200" : "border-gray-700"
                }`}></div>
                
                <Link
                  to="/dashboard/profile"
                  className={`flex items-center p-3 rounded-md ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-user-edit w-6 text-center"></i>
                  <span>Edit Profile</span>
                </Link>
                
                <button
                  onClick={() => {
                    setShowModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-md text-left text-red-500 ${
                    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                  } transition-colors`}
                >
                  <i className="fa-solid fa-sign-out-alt w-6 text-center"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </header>
  );
};

const LogoutModal = ({ onConfirm, onCancel, theme }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center z-100"
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
          className={`${
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

export default Header;