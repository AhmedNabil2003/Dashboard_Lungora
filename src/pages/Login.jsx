// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoginForm from "../features/auth/LoginForm";
import { BrainCircuit } from "lucide-react";

const Login = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 md:from-sky-100 md:to-indigo-200 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Welcome Header - Mobile Only */}
        <div className="md:hidden flex flex-col justify-center items-center p-6 w-full text-center bg-gradient-to-r from-sky-500 to-indigo-500 rounded-t-xl">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex items-center justify-center mb-3" 
          >
            <BrainCircuit className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white text-sm mb-4">Log in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="flex flex-col items-center justify-center p-6 pt-0 md:pt-6">
          <LoginForm />
        </div>

        {/* Welcome section - desktop only */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:flex flex-col items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 text-white p-6 text-center rounded-r-xl"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex items-center justify-center mb-6" 
          >
            <BrainCircuit className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-3xl font-extrabold mb-4">Welcome to Your Dashboard!</h2>
          <p className="text-lg mb-6">Your hub for seamless management and smart decisions.🤖</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

