import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/apiAuth";  // استيراد registerUser من apiAuth
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ name, placeholder, formik }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex items-center">
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
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

const RegisterForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "*Name must be at least 3 characters")
      .required("*Name is required"),
    email: Yup.string().email("*Invalid email").required("*Email is required"),
    password: Yup.string()
      .min(6, "*Password must be at least 6 characters")
      .required("*Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      const loadingId = toast.loading("Signing Up...");
      try {
        // استخدم registerUser من apiAuth.js
        const data = await registerUser(values);

        if (data.statusCode === 201) {
          toast.success("Signup successful! Please log in.");
          setTimeout(() => {
            navigate("/login");  // Redirect to login page
          }, 2000);
        }
      } catch (error) {
        toast.error(
          "Signup error: " + (error.response?.data?.message || error.message)
        );
      } finally {
        toast.dismiss(loadingId);
      }
    },
  });

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold text-gray-800 text-center">Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          <Input
            type="email"
            name="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <PasswordInput
            name="password"
            placeholder="Password"
            formik={formik}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm Password"
            formik={formik}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300"
          >
            Sign Up
          </button>

          <a
            href="/"
            className="block text-center mt-4 text-sm text-gray-500 transition duration-300"
          >
            <span>Already have an account? </span>
            <span className="text-blue-500 hover:underline">Log in</span>
          </a>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
