import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({ name: "", avatar: "", online: false });
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://lungora.runasp.net/api/Auth/GetDataUser",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUser({
          name: response.data.name || "Guest",
          avatar: response.data.avatar || "/images/default-avatar.png",
          online: response.data.online || false,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="bg-gradient-to-r from-sky-800 to-sky-500 shadow-md p-3 flex justify-between items-center border-b border-gray-300">
      {/* Left: Model Trigger Button */}
      <div className="flex items-center space-x-4">
        <button className="text-white hover:text-sky-200 text-2xl transition duration-300 ease-in-out">
          <Link to="/dashboard/lungora-ai" className="flex items-center space-x-2">
            <i className="fa-solid fa-robot text-xl"></i>
            <span className="font-semibold text-lg">Lungora AI</span>
          </Link>
        </button>
      </div>

      {/* Right: User Info & Actions */}
      <div className="flex items-center space-x-6">
        {/* Add User Icon */}
        <Link
          to="/dashboard/signup"
          className="text-white hover:text-sky-200 transition duration-300 ease-in-out"
        >
          <i className="fa-solid fa-user-plus text-2xl"></i>
        </Link>

        {/* Settings Icon */}
        <Link
          to="/dashboard/settings"
          className="text-white hover:text-sky-200 transition duration-300 ease-in-out"
        >
          <i className="fa-solid fa-cog text-xl"></i>
        </Link>

        {/* Notifications Icon */}
        <i className="fa-solid fa-bell text-white hover:text-sky-200 cursor-pointer text-xl transition duration-300 ease-in-out"></i>

        {/* Theme Toggle Icon */}
        <i
          onClick={toggleTheme}
          className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"} text-white hover:text-sky-200 cursor-pointer text-xl transition duration-300 ease-in-out`}
        ></i>

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
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              {/* Online/Offline Indicator (Dot) */}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${user.online ? "bg-green-400" : "bg-red-400"}`}
                style={{ border: "2px solid white" }}
              ></div>
            </div>
            <div className="text-white">
              <h2 className="font-semibold">{user.name || "Guest"}</h2>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 bg-white shadow-lg rounded-lg mt-2 w-48 py-2 px-4 z-50">
              <Link
                to="/dashboard/profile"
                className="block text-gray-700 hover:bg-gray-100 rounded-lg py-2 px-3"
              >
                Edit Profile
              </Link>
              <button
                onClick={logout}
                className="block text-gray-700 hover:bg-gray-100 rounded-lg py-2 px-3 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
