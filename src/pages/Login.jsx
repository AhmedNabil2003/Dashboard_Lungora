// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoginForm from "../features/auth/LoginForm";
import { BrainCircuit } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

const Login = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`relative flex items-center justify-center min-h-screen p-4 ${
      theme === "dark" ? "bg-gray-900" : "bg-sky-50"
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2"
      >
        {/* Card Container */}
        <div className={`rounded-l-2xl shadow-xl overflow-hidden ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}>
          {/* Welcome Header - Mobile Only */}
          <div className={`md:hidden flex flex-col justify-center items-center p-6 w-full text-center ${
            theme === "dark" 
              ? "bg-gradient-to-br from-sky-900 via-sky-700 to-sky-600" 
              : "bg-gradient-to-br from-sky-700 via-sky-800 to-sky-500"
          } rounded-t-xl`}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex items-center justify-center mb-3" 
            >
              <BrainCircuit className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className={`text-sm ${
              theme === "dark" ? "text-sky-100/90" : "text-white/90"
            } mb-4`}>Log in to access your dashboard</p>
          </div>

          {/* Login Form */}
          <div className={`flex flex-col items-center justify-center p-6 pt-0 md:pt-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}>
            <LoginForm />
          </div>
        </div>

        {/* Welcome section - desktop only */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className={`hidden md:flex flex-col items-center justify-center ${
            theme === "dark" 
              ? "bg-gradient-to-br from-sky-900 via-sky-700 to-sky-600" 
              : "bg-gradient-to-br from-sky-700 via-sky-800 to-sky-500"
          } text-white p-6 text-center rounded-r-xl`}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex items-center justify-center mb-6" 
          >
            <BrainCircuit className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-3xl font-extrabold mb-4">Welcome to Your Dashboard!</h2>
          <p className={`text-lg mb-6 ${
            theme === "dark" ? "text-sky-100/90" : "text-white/90"
          }`}>Your hub for seamless management and smart decisions.🤖</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
