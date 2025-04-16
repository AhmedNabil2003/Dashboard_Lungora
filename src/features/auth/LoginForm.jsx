import { useContext, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext";

const PasswordInput = ({ name, placeholder, value, onChange, onBlur, error, ref }) => {
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
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 ease-in-out`}
        ref={ref}
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

const LoginForm = () => {
  const { setToken } = useContext(AuthContext);
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
      const loadingId = toast.loading("Waiting...");
      try {
        const { data } = await axios.post(
          "https://lungora.runasp.net/api/Auth/Login",
          values
        );
        if (data.statusCode === 200) {
          setToken(data.result.token);
          localStorage.setItem("token", data.result.token);
          toast.success("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          toast.error("Login failed. Please try again.");
          if (data.result.message.includes("Invalid email")) {
            formik.setFieldTouched("email", true);
            emailRef.current.focus(); 
          } else if (data.result.message.includes("Invalid password")) {
            formik.setFieldTouched("password", true);
            passwordRef.current.focus();
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Invalid credentials. Please check your email and password.");
          if (error.response.data.message.includes("Invalid email")) {
            formik.setFieldTouched("email", true);
            emailRef.current.focus();
          } else if (error.response.data.message.includes("Invalid password")) {
            formik.setFieldTouched("password", true);
            passwordRef.current.focus();
          }
        } else {
          toast.error("Login error: " + (error.response?.data?.message || error.message));
        }
      } finally {
        setLoading(false);
        toast.dismiss(loadingId);
      }
    },
  });

  return (
    <Card className="shadow-xl rounded-lg p-8 max-w-md mx-auto bg-white">
  <CardContent>
    {/* Header with a welcoming message */}
    <div className="text-center mb-6 mt-4">
      <h1 className="text-3xl font-semibold text-gray-800">LOGIN</h1>
      <p className="text-sm text-gray-500 mt-2">Please sign in to continue.</p>
    </div>

    {/* Form starts here */}
    <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
      
      {/* Email Input */}
      <div>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          {...formik.getFieldProps("email")}
          onBlur={(e) => formik.handleBlur(e)}
          ref={emailRef}
          className={`w-full border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 ease-in-out shadow-sm`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
        )}
      </div>

      {/* Password Input (Using PasswordInput Component) */}
      <div>
        <PasswordInput
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
          ref={passwordRef}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="rememberMe"
          checked={formik.values.rememberMe}
          onChange={formik.handleChange}
          className="mr-2 rounded-sm"
        />
        <label className="text-sm text-gray-700">Remember Me</label>
      </div>

      {/* Forgot Password Link */}
      <p className="text-right text-sm text-sky-500 mt-2 cursor-pointer hover:underline">
        Forgot your password?
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-sky-600 hover:to-indigo-700 transition duration-300 ease-in-out"
        disabled={loading}
      >
        {loading ? "Logging in..." : "LOGIN"}
      </button>
    </form>
  </CardContent>
</Card>

  );
};

export default LoginForm;
