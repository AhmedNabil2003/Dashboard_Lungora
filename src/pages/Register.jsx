// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import RegisterForm from "../features/auth/RegisterForm";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

const Register = () => {     
  const { theme } = useContext(ThemeContext);
  return (
   <div className={`min-h-screen flex items-center justify-center p-4 ${
  theme === 'light' 
    ? 'bg-gradient-to-br from-gray-50 to-gray-100' 
    : 'bg-gradient-to-br from-gray-800 to-gray-900'
}`}>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className={`relative z-10 w-full max-w-md grid grid-cols-1 rounded-2xl shadow-xl overflow-hidden p-4 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-700'
    }`}
  >
    <RegisterForm />
  </motion.div>
    </div>
  );
};

export default Register;
