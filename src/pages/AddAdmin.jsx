// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AddAdminForm from "../features/auth/AddAdminForm";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

const AddAdmin = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <AddAdminForm />
      </motion.div>
    </div>
  );
};

export default AddAdmin;