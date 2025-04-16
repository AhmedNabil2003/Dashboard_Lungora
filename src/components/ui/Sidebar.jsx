import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import LungoraImage from "../../assets/images.jpg";
import AuthContext from "../../context/AuthContext";

// مكون لتمثيل العنصر في القائمة
const MenuItem = ({ to, label, icon, isActive, isSidebarOpen, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center py-3 px-3 w-full rounded-lg transition-all duration-300 transform hover:bg-gradient-to-r from-sky-400 to-sky-600 shadow-md ${
        isActive ? "bg-gradient-to-r from-sky-500 to-sky-700 shadow-lg" : ""
      }`}
    >
      <i
        className={`${icon}  transition-all duration-300 ${
          isSidebarOpen ? "text-2xl mr-4" : "text-l mx-auto"
        } ${isActive ? "text-white" : "text-cyan-800"}`}
        style={{
          display: isSidebarOpen ? "inline-block" : "block",
        }}
      ></i>

      {isSidebarOpen && (
        <span
          className={`text-sm font-semibold transition-all duration-300 ${
            isActive ? "text-white" : "text-slate-700"
          }`}
        >
          {label}
        </span>
      )}
    </Link>
    <div className="w-full border-t border-slate-300 my-2" />
  </motion.div>
);

// مكون لتمثيل الصورة الشخصية والاسم في الشريط الجانبي
const Profile = () => (
  <Link to="/dashboard">
    <motion.div
      className="flex items-center space-x-3 mb-6 bg-sky-700 p-3 rounded-lg cursor-pointer"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <img
        src={LungoraImage}
        alt="Lungora"
        className="w-14 h-14 rounded-full border-4 border-white hover:scale-110 transition-transform duration-300"
      />
      <div>
        <h2 className="text-lg font-bold">Lungora</h2>
        <p className="text-xs opacity-90">AI MODEL</p>
      </div>
    </motion.div>
  </Link>
);

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);  // حالة لإظهار المودال
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  // ✅ إغلاق الشريط الجانبي تلقائيًا عند تصغير الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // أول مرة عند التحميل
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  ];

  // وظيفة لإغلاق المودال وتسجيل الخروج
  const handleLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`${
        isSidebarOpen ? "w-52" : "w-30"
      } h-screen bg-gradient-to-b from-sky-800 to-sky-500 text-white flex flex-col p-4 shadow-2xl relative`}
    >
      {/* Toggle Sidebar Icon */}
      <motion.div
        className="relative left-4 bottom-2 cursor-pointer z-10"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <i
          className={`fa-solid ${
            isSidebarOpen ? "fa-angle-left" : "fa-angle-right"
          } text-2xl text-white transition-all duration-300 ${
            isSidebarOpen ? "" : "scale-125"
          }`}
        ></i>
      </motion.div>

      {/* Top Section (Profile) */}
      {isSidebarOpen && <Profile />}

      {/* Middle Section (Navigation Menu) */}
      <nav className="flex-grow flex flex-col items-start space-y-2 bg-white shadow-lg p-4 rounded-xl overflow-hidden">
        {menuItems.map((item) => (
          <MenuItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            isActive={location.pathname === item.to}
            isSidebarOpen={isSidebarOpen}
          />
        ))}

        {/* Logout as Menu Item */}
        <MenuItem
          to="#"
          label="Logout"
          icon="fa-solid fa-sign-out-alt"
          isActive={location.pathname === "/"}
          isSidebarOpen={isSidebarOpen}
          onClick={() => setShowModal(true)} // فتح المودال
        />
      </nav>

      {/* مودال تأكيد تسجيل الخروج بدون خلفية */}
      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl w-80"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600">Are you sure you want to logout?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <motion.button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
