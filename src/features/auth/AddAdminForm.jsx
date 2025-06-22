import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const PasswordInput = ({ name, formik, label }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isFilled = formik.values[name] !== "";
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="relative mt-6">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name={name}
          id={name}
          {...formik.getFieldProps(name)}
          className={`block w-full px-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 peer ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-600 focus:ring-sky-500"
              : "bg-white text-gray-800 border-gray-300 focus:ring-sky-400"
          } ${hasError ? "border-red-500" : ""}`}
        />
        <label
          htmlFor={name}
          className={`absolute left-4 top-0.5 transition-all duration-200 transform ${
            isFilled ? "-translate-y-6 text-sm" : ""
          } ${
            theme === "dark"
              ? "text-gray-400 peer-focus:text-sky-400"
              : "text-gray-500 peer-focus:text-sky-600"
          } ${hasError ? "text-red-500" : ""} pointer-events-none peer-focus:-translate-y-6 peer-focus:text-sm`}
        >
          {label}
        </label>
        <button
          type="button"
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff
              size={20}
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            />
          ) : (
            <Eye
              size={20}
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            />
          )}
        </button>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );
};

const AddAdminForm = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { addAdmin } = useAuth();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(9, "Password must be at least 9 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Must contain at least one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      const loadingId = toast.loading("Creating admin...");
      try {
        await addAdmin(values);
        setTimeout(() => {
          navigate("/dashboard/users");
        }, 500);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Errors are handled in useAuth.js via toast
      } finally {
        toast.dismiss(loadingId);
      }
    },
  });

  return (
      <div className="w-full">
        <div className="max-w-md mx-auto shadow-xl rounded-xl overflow-hidden my-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative overflow-hidden ${
            theme === "dark"
              ? "bg-gradient-to-br from-sky-900 via-sky-700 to-sky-600"
              : "bg-gradient-to-br from-sky-700 via-sky-800 to-sky-500"
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/5"></div>
          </div>

          <div className="relative z-10 p-0 md:p-5">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </motion.button>

              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-3 rounded-xl ${
                  theme === "dark"
                    ? "bg-sky-800/30 border border-sky-700/50"
                    : "bg-white/20 border border-white/30"
                }`}
              >
                <UserPlus size={26} className="text-white" strokeWidth={2} />
              </motion.div>
            </div>

            <div className="mt-2 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-2xl font-bold text-white"
              >
                Add New Admin
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`mt-2 text-xs md:text-base ${
                  theme === "dark" ? "text-sky-100/90" : "text-white/90"
                }`}
              >
                Streamline permissions and expand management capabilities
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 md:p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="relative mt-1">
              <Input
                type="text"
                name="name"
                id="name"
                {...formik.getFieldProps("name")}
                className={`block w-full px-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-600 focus:ring-sky-500"
                    : "bg-white text-gray-800 border-gray-300 focus:ring-sky-400"
                } ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }`}
              />
              <label
                htmlFor="name"
                className={`absolute left-4 top-0.5 transition-all duration-200 transform ${
                  formik.values.name ? "-translate-y-6 text-sm" : ""
                } ${
                  theme === "dark"
                    ? "text-gray-400 peer-focus:text-sky-400"
                    : "text-gray-500 peer-focus:text-sky-600"
                } ${
                  formik.touched.name && formik.errors.name
                    ? "text-red-500"
                    : ""
                } pointer-events-none peer-focus:-translate-y-6 peer-focus:text-sm`}
              >
                Full Name
              </label>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-2 text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>

            <div className="relative mt-7">
              <Input
                type="email"
                name="email"
                id="email"
                {...formik.getFieldProps("email")}
                className={`block w-full px-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-600 focus:ring-sky-500"
                    : "bg-white text-gray-800 border-gray-300 focus:ring-sky-400"
                } ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              <label
                htmlFor="email"
                className={`absolute left-4 top-0.5 transition-all duration-200 transform ${
                  formik.values.email ? "-translate-y-6 text-sm" : ""
                } ${
                  theme === "dark"
                    ? "text-gray-400 peer-focus:text-sky-400"
                    : "text-gray-500 peer-focus:text-sky-600"
                } ${
                  formik.touched.email && formik.errors.email
                    ? "text-red-500"
                    : ""
                } pointer-events-none peer-focus:-translate-y-6 peer-focus:text-sm`}
              >
                Email Address
              </label>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <PasswordInput
              name="password"
              formik={formik}
              label="Password"
            />

            <PasswordInput
              name="confirmPassword"
              formik={formik}
              label="Confirm Password"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full py-3 px-6 mt-6 text-base font-semibold rounded-lg shadow-md transition duration-300 disabled:opacity-70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-sky-700 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white focus:ring-sky-500 focus:ring-offset-gray-800"
                  : "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-600 text-white focus:ring-sky-400 focus:ring-offset-white"
              }`}
            >
              {formik.isSubmitting ? "Creating..." : "Create Admin"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddAdminForm;