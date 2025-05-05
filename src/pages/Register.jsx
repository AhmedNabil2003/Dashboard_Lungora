// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import RegisterForm from "../features/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-brfrom-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md grid grid-cols-1 bg-white rounded-2xl shadow-xl overflow-hidden p-4"
      >
        <RegisterForm />
      </motion.div>
    </div>
  );
};

export default Register;
