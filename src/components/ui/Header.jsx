import { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setUser({
          name: userData.fullName || "Guest",
          avatar: userData.imageUser || "/images/default-avatar.png",
          online: true,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, []);

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
      {/* Left: Model Trigger Button */}
      <div className="flex justify-center items-center flex-grow lg:flex-grow-0">
        <motion.div
          className="w-fit flex justify-center items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/dashboard/lungora-ai"
            className="flex items-center space-x-2 px-2 text-white hover:text-sky-200 text-2xl transition duration-300 ease-in-out"
          >
            <motion.i
              className="fa-solid fa-robot text-xl"
              initial={{ rotate: -15, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <span className="font-semibold text-base md:text-lg">
              Lungora AI
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Right: User Info & Actions */}
      <div className="flex items-center space-x-2">
        {/* Add User Icon */}
        <Link
          to="/dashboard/signup"
          className="text-white h-full px-2 flex items-center"
        >
          <i className="fa-solid fa-user-plus text-sm sm:text-base hover:text-sky-300 transition-colors"></i>
        </Link>

        {/* Settings Icon */}
        <Link
          to="/dashboard/settings"
          className="text-white h-full px-2 flex items-center"
        >
          <i className="fa-solid fa-cog text-sm sm:text-base hover:text-sky-300 transition-colors"></i>
        </Link>

        {/* Notifications Icon */}
        <button className="text-white h-full px-2 flex items-center cursor-pointer">
          <i className="fa-solid fa-bell text-sm sm:text-base hover:text-sky-300 transition-colors"></i>
        </button>

        {/* Theme Toggle Icon */}
        <button
          onClick={toggleTheme}
          className="text-white h-full px-2 flex items-center cursor-pointer"
        >
          <i
            className={`fa-solid ${
              theme === "light" ? "fa-moon" : "fa-sun"
            } text-sm sm:text-base hover:text-sky-300 transition-colors`}
          ></i>
        </button>

        {/* User Profile */}
        <div
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <img
                src={user.avatar || "/images/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white hover:text-sky-300 transition-colors"
              />
              {/* Online/Offline Indicator */}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  user.online ? "bg-green-400" : "bg-red-400"
                }`}
                style={{ border: "2px solid white" }}
              ></div>
            </div>
            <div className="text-white">
              <h2 className="font-semibold">{user.name || "Guest"}</h2>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 py-2 px-4 z-50 rounded-lg shadow-lg transition-all
              ${
                theme === "light"
                  ? "bg-white text-gray-700"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              <Link
                to="/dashboard/profile"
                className={`block rounded-lg py-2 px-3 transition-colors 
                  ${
                    theme === "light"
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-700"
                  }`}
              >
                Edit Profile
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className={`block w-full text-left rounded-lg py-2 px-3 transition-colors cursor-pointer
                  ${
                    theme === "light"
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-700"
                  }`}
              >
                Logout
              </button>
            </div>
          )}
          <AnimatePresence>
            {showModal && (
              <LogoutModal
                onConfirm={handleLogout}
                onCancel={() => setShowModal(false)}
                theme={theme}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
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
export default Header;
