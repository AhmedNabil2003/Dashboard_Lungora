import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/apiAuth";  // استيراد registerUser من apiAuth
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const PasswordInput = ({ name, placeholder, formik }) => {
  const [showPassword, setShowPassword] = useState(false);
const { theme } = useContext(ThemeContext);

return (
  <div className="relative flex items-center">
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
        className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${
          theme === "dark" ? "bg-gray-700 text-white" : ""
        }`}
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  
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
     <div className={`max-w-sm mx-auto p-6 shadow-lg rounded-lg ${
       theme === "dark" ? "bg-gray-800" : "bg-white"
    }`}>
      <div className="mb-6 text-center">
        <div className="flex items-center mb-4 gap-2">
             <button
              onClick={() => navigate(-1)}
              className={`p-1.5 rounded-full mr-3 ${
                theme === "dark" ? "bg-sky-800 hover:bg-sky-700" : "bg-sky-100 hover:bg-sky-200"
              } cursor-pointer transition-colors duration-200`}
            >
              <ArrowLeft className={theme === "dark" ? "text-gray-300 " : "text-sky-600" } size={20} />
            </button>
            <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Add New User
            </h1>
          </div>
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
  disabled={formik.isSubmitting}
  className={`
    w-full py-3 px-6 text-lg font-semibold rounded-lg shadow-md 
    transition duration-300 disabled:opacity-70 cursor-pointer
    ${
      theme === "dark" 
        ? "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white"
        : "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-indigo-600 text-white"
    }
  `}
>
  {formik.isSubmitting ? "Creating..." : "Create User"}
</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
