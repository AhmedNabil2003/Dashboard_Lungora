import { motion } from "framer-motion";
import LoginForm from "../features/auth/LoginForm";
import { BrainCircuit } from "lucide-react";

const Login = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl grid grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <LoginForm />

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 text-white p-8 text-center rounded-br-2xl rounded-tr-2xl shadow-lg"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <BrainCircuit className="w-16 h-16 text-white mb-4" />
          </motion.div>
          <h2 className="text-3xl font-extrabold">Welcome to Your Dashboard!</h2>
          <p className="mt-2 text-lg">Your hub for seamless management and smart decisions.🤖🚀</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;