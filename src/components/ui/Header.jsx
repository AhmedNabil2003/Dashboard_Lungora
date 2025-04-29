import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const Header = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({ name: "", avatar: "", online: false });
  const [isOpen, setIsOpen] = useState(false);
  const { theme,toggleTheme} = useContext(ThemeContext);


  // جلب بيانات المستخدم عند تحميل الصفحة
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


  return (
    <header className={`shadow-md p-3 flex justify-between items-center border-b border-gray-300 ${theme === "light" ? "bg-gradient-to-r from-sky-800 to-sky-500" : "bg-gradient-to-r from-gray-800 to-gray-600"}`}>
      {/* Left: Model Trigger Button */}
      <div className="flex items-center space-x-4 hidden sm:flex">
        <button className="text-white hover:text-sky-200 text-2xl transition duration-300 ease-in-out">
          <Link
            to="/dashboard/lungora-ai"
            className="flex items-center space-x-2 h-full px-2 text-white hover:text-sky-200 text-2xl transition duration-300 ease-in-out"
          >
            <i className="fa-solid fa-robot text-xl"></i>
            <span className="font-semibold text-base md:text-lg">Lungora AI</span>
          </Link>
        </button>
      </div>

      {/* Center: Only Lungora AI Model Icon in the Middle */}
      <div className="flex justify-center items-center flex-grow">
        <div className="flex items-center space-x-2">
          <button className="text-white hover:text-sky-200 text-2xl transition duration-300 ease-in-out sm:hidden">
            <Link
              to="/dashboard/lungora-ai"
              className="flex items-center space-x-2 h-full px-2 text-white hover:text-sky-200 text-2xl transition duration-300 ease-in-out"
            >
              <i className="fa-solid fa-robot text-xl"></i>
              <span className="font-semibold text-base md:text-lg">Lungora AI</span>
            </Link>
          </button>
        </div>
      </div>

      {/* Right: User Info & Actions */}
      <div className="flex items-center space-x-2">
        {/* Add User Icon */}
        <Link to="/dashboard/signup" className="text-white h-full px-2 flex items-center">
          <i className="fa-solid fa-user-plus text-sm sm:text-base hover:text-sky-300 transition-colors"></i>
        </Link>

        {/* Settings Icon */}
        <Link to="/dashboard/settings" className="text-white h-full px-2 flex items-center">
          <i className="fa-solid fa-cog text-sm sm:text-base hover:text-sky-300 transition-colors"></i>
        </Link>

        {/* Notifications Icon */}
        <button className="text-white h-full px-2 flex items-center">
          <i className="fa-solid fa-bell text-sm sm:text-base hover:text-sky-300 transition-colors"></i>
        </button>

        {/* Theme Toggle Icon */}
        <button onClick={toggleTheme} className="text-white h-full px-2 flex items-center">
          <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"} text-sm sm:text-base hover:text-sky-300 transition-colors`}></i>
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



// **************
// import { useContext, useEffect, useState } from "react";
// import AuthContext from "../../context/AuthContext";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Header = () => {
//   const { logout } = useContext(AuthContext);
//   const [user, setUser] = useState({ name: "", avatar: "", online: false });
//   const [isOpen, setIsOpen] = useState(false);
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(
//           "https://lungora.runasp.net/api/Auth/GetDataUser",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         setUser({
//           name: response.data.name || "Guest",
//           avatar: response.data.avatar || "/images/default-avatar.png",
//           online: response.data.online || false,
//         });
//       } catch (error) {
//         console.error("Error fetching user data", error);
//       }
//     };

//     fetchUser();
    
//     // Check if mobile device
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Toggle theme between light and dark
//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.toggle("dark", newTheme === "dark");
//   };

//   return (
//     <header className="bg-sky-500 shadow-md flex justify-between items-center h-12 z-10">
//       {/* Left section with proper spacing for sidebar button (rendered elsewhere) */}
//       <div className="flex items-center h-full pl-12 md:pl-4">
//         {/* Logo and App name */}
//         <Link 
//           to="/dashboard" 
//           className="flex items-center h-full px-2 text-white"
//         >
//           <i className="fa-solid fa-robot text-lg mr-1"></i>
//           <span className="font-semibold text-base md:text-lg">Lungora AI</span>
//         </Link>
//       </div>

//       {/* Right: Icons and User Profile */}
//       <div className="flex items-center h-full">
//         {/* User Management Icon - hidden on smallest screens */}
//         <Link
//           to="/dashboard/users"
//           className="text-white h-full px-2 hidden sm:flex items-center hover:bg-sky-600 transition-colors"
//         >
//           <i className="fa-solid fa-user-plus text-sm sm:text-base"></i>
//         </Link>

//         {/* Settings Icon */}
//         <Link
//           to="/dashboard/settings"
//           className="text-white h-full px-2 flex items-center hover:bg-sky-600 transition-colors"
//         >
//           <i className="fa-solid fa-cog text-sm sm:text-base"></i>
//         </Link>

//         {/* Notifications Icon */}
//         <button 
//           className="text-white h-full px-2 flex items-center hover:bg-sky-600 transition-colors"
//         >
//           <i className="fa-solid fa-bell text-sm sm:text-base"></i>
//         </button>

//         {/* Theme Toggle */}
//         <button 
//           onClick={toggleTheme}
//           className="text-white h-full px-2 flex items-center hover:bg-sky-600 transition-colors"
//         >
//           <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"} text-sm sm:text-base`}></i>
//         </button>

//         {/* User Profile */}
//         <div
//           className="relative h-full"
//           onClick={() => setIsOpen(!isOpen)}
//           onMouseEnter={() => !isMobile && setIsOpen(true)}
//           onMouseLeave={() => !isMobile && setIsOpen(false)}
//         >
//           <div className="flex items-center h-full px-2 cursor-pointer hover:bg-sky-600 transition-colors">
//             <div className="relative">
//               <img
//                 src={user.avatar || "/images/default-avatar.png"}
//                 alt="User Avatar"
//                 className="w-8 h-8 rounded-full border-2 border-white object-cover"
//               />
//               {/* Online/Offline Indicator */}
//               <div
//                 className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${user.online ? "bg-green-400" : "bg-red-400"} border border-white`}
//               ></div>
//             </div>
//             <span className="ml-2 text-white font-medium text-sm hidden md:block">
//               {user.name || "Guest"}
//             </span>
//           </div>

//           {/* Dropdown Menu */}
//           {isOpen && (
//             <div className="absolute right-0 bg-white shadow-lg rounded-lg mt-1 w-40 py-2 px-1 z-50">
//               <Link
//                 to="/dashboard/profile"
//                 className="block text-gray-700 hover:bg-gray-100 rounded-lg py-2 px-3 text-sm"
//               >
//                 <i className="fa-solid fa-user-edit mr-2"></i>
//                 Edit Profile
//               </Link>
//               <div className="border-t border-gray-200 my-1"></div>
//               <button
//                 onClick={logout}
//                 className="block text-gray-700 hover:bg-gray-100 rounded-lg py-2 px-3 w-full text-left text-sm"
//               >
//                 <i className="fa-solid fa-sign-out-alt mr-2"></i>
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;