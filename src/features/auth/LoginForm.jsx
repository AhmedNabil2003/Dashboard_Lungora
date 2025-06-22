import { useContext, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import { loginUser } from "../../services/apiAuth";
import { storeToken } from "../../hooks/useLocalStorage";
import { ThemeContext } from "../../context/ThemeContext";

const PasswordInput = ({ name, placeholder, value, onChange, onBlur, error, ref, theme }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative flex items-center">
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full border ${
          error 
            ? 'border-red-500' 
            : theme === 'dark' 
              ? 'border-gray-600' 
              : 'border-gray-300'
        } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white focus:ring-sky-500' 
            : 'bg-white text-gray-800 focus:ring-sky-400'
        } transition-all duration-300 ease-in-out`}
        ref={ref}
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
        ) : (
          <Eye size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
        )}
      </button>
    </div>
  );
};

const LoginForm = () => {
  const { setToken } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "", rememberMe: false },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const loadingId = toast.loading("Logging in...");
      try {
        const data = await loginUser(values);
        console.log("API Response:", data);

        if (data?.token) { 
          const token = data.token;
          setToken(token);
          storeToken(token, values.rememberMe);
          toast.success("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/dashboard",{ replace: true } );
          }, 1000);
        } else {
          toast.error("Login failed. Invalid response structure.");
        }
      } catch (error) {
        const msg = error?.response?.data?.message || error.message || "Login error";
        if (msg.includes("email")) {
          formik.setFieldTouched("email", true);
          emailRef.current?.focus();
        } else if (msg.includes("password")) {
          formik.setFieldTouched("password", true);
          passwordRef.current?.focus();
        }
      } finally {
        setLoading(false);
        toast.dismiss(loadingId);
      }
    },
  });

  return (
    <div className={`shadow-xl rounded-xl p-8 max-w-md mx-auto ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>LOGIN</h1>
        <p className={`text-sm mt-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
        }`}>Please sign in to continue.</p>
      </div>
  
      <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="email" className={`block text-sm mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>Email</label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            onBlur={formik.handleBlur}
            ref={emailRef}
            className={`w-full ${
              formik.touched.email && formik.errors.email 
                ? 'border-red-500' 
                : theme === 'dark' 
                  ? 'border-gray-600' 
                  : 'border-gray-300'
            } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white focus:ring-sky-500' 
                : 'bg-white text-gray-800 focus:ring-sky-400'
            } transition-all duration-300 ease-in-out shadow-sm`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>
  
        <div>
          <label htmlFor="password" className={`block text-sm mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>Password</label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
            ref={passwordRef}
            theme={theme}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>
  
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            className={`mr-2 rounded-sm cursor-pointer ${
              theme === 'dark' ? 'accent-sky-500' : 'accent-sky-600'
            }`}
          />
          <label htmlFor="rememberMe" className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>Remember Me</label>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 text-white font-semibold cursor-pointer rounded-lg shadow-md transition duration-300 ease-in-out ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-sky-700 to-sky-800 hover:from-sky-700 hover:to-sky-900'
              : 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-600 hover:to-sky-800'
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;