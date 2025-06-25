import { useState, useContext, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Settings,
  Lock,
  Monitor,
  Moon,
  Sun,
  Upload,
  Check,
  X,
  Image,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/themeContext";
import Input from "../components/ui/inputField";
import { useDashboard } from "../context/dashboardContext";
import { changePassword } from "../services/apiAuth";

const SettingsPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const { dashboardSettings, updateDashboardSettings } = useDashboard();

  useEffect(() => {
    if (dashboardSettings.logoPreview) {
      setLogoPreview(dashboardSettings.logoPreview);
    } else {
      const storedLogo = localStorage.getItem("dashboardLogo");
      if (storedLogo) {
        setLogoPreview(storedLogo);
      }
    }
  }, [dashboardSettings.logoPreview]);

  const validationSchema = Yup.object({
    dashboard: Yup.object({
      dashboardName: Yup.string().required("Dashboard name is required"),
      description: Yup.string().max(
        200,
        "Description must be less than 200 characters"
      ),
    }),
    changePassword: Yup.object({
      currentPassword: Yup.string().when("newPassword", {
        is: (newPassword) => !!newPassword,
        then: (schema) =>
          schema
            .required("Current password is required")
            .test(
              "current-password-requirements",
              "Current password must be at least 9 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              function (value) {
                if (!value) return true;
                return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}/.test(
                  value
                );
              }
            ),
      }),
      newPassword: Yup.string().test(
        "password-requirements",
        "Password must be at least 9 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        function (value) {
          if (!value) return true;
          return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}/.test(
            value
          );
        }
      ),
      confirmNewPassword: Yup.string().when("newPassword", {
        is: (newPassword) => !!newPassword,
        then: (schema) =>
          schema
            .oneOf([Yup.ref("newPassword")], "Passwords must match")
            .required("Confirm password is required"),
      }),
    }),
    twoFactorAuth: Yup.boolean(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      dashboard: {
        dashboardName: dashboardSettings.dashboardName || "",
        description: dashboardSettings.description || "",
      },
      changePassword: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      twoFactorAuth: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const loadingId = toast.loading("Saving settings...");

      try {
        if (values.changePassword.newPassword) {
          const response = await changePassword({
            currentPassword: values.changePassword.currentPassword,
            newPassword: values.changePassword.newPassword,
          });

          console.log("Password change response:", response);

          if (response.isSuccess) {
            toast.success("Password changed successfully");
            formik.setFieldValue("changePassword.currentPassword", "");
            formik.setFieldValue("changePassword.newPassword", "");
            formik.setFieldValue("changePassword.confirmNewPassword", "");
          } else {
            throw new Error(
              response.errors?.[0] || "Failed to change password"
            );
          }
        }

        if (!values.changePassword.newPassword) {
          await updateDashboardSettings({
            dashboardName: values.dashboard.dashboardName,
            description:
              values.dashboard.description || dashboardSettings.description,
            logo: logoFile,
            logoPreview: logoPreview || dashboardSettings.logoPreview,
          });
          if (logoFile && logoPreview) {
            localStorage.setItem("dashboardLogo", logoPreview);
          }
          toast.success("Dashboard settings updated successfully");
          setLogoFile(null);
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
        toast.dismiss(loadingId);
      }
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <Settings size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 lg:p-8 shadow-lg rounded-2xl max-w-4xl mx-auto my-8 overflow-hidden ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-lg ${
              theme === "light"
                ? "bg-gradient-to-r from-sky-700 to-sky-600"
                : "bg-gradient-to-r from-sky-800 to-sky-700"
            }`}
          >
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1
              className={`text-2xl lg:text-3xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-gray-200"
              }`}
            >
              Admin Settings
            </h1>
            <p
              className={`text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Customize your admin panel settings
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm md:text-base transition-all ${
              activeTab === tab.id
                ? "text-sky-600 border-b-2 border-sky-500 -mb-px font-medium"
                : theme === "dark"
                ? "text-gray-300 hover:text-sky-400"
                : "text-gray-600 hover:text-sky-500"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {/* Dashboard Settings */}
          {activeTab === "general" && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Dashboard Customization
              </h3>
              {/* Theme Toggle */}
              <div className="space-y-3">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Theme Preference
                </label>
                <div className="flex gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all flex-1 ${
                      theme === "light"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : theme === "dark"
                        ? "border-gray-600 hover:border-sky-400 text-gray-300"
                        : "border-gray-300 hover:border-sky-400 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === "light"}
                      onChange={() => toggleTheme("light")}
                      className="sr-only"
                    />
                    <Sun
                      size={20}
                      className={
                        theme === "light" ? "text-sky-500" : "text-gray-500"
                      }
                    />
                    <div>
                      <span className="font-medium">Light Mode</span>
                      <p className="text-xs opacity-75">
                        Classic bright interface
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all flex-1 ${
                      theme === "dark"
                        ? "border-sky-500 bg-gray-700 text-sky-300"
                        : "border-gray-300 hover:border-sky-400 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === "dark"}
                      onChange={() => toggleTheme("dark")}
                      className="sr-only"
                    />
                    <Moon
                      size={20}
                      className={
                        theme === "dark" ? "text-sky-400" : "text-gray-500"
                      }
                    />
                    <div>
                      <span className="font-medium">Dark Mode</span>
                      <p className="text-xs opacity-75">Easy on the eyes</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Logo Section */}
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Dashboard Logo
                  </label>
                  {/* Logo Preview */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden ${
                        theme === "dark"
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      {logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </>
                      ) : (
                        <Image className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all font-medium ${
                          theme === "dark"
                            ? "border-gray-600 hover:border-sky-400 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 hover:border-sky-500 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Upload size={16} />
                        Choose Logo
                      </label>
                      {logoFile && (
                        <div className="mt-2 flex items-center gap-2">
                          <Check size={16} className="text-green-500" />
                          <p className="text-sm text-green-600">
                            {logoFile.name} ({(logoFile.size / 1024).toFixed(1)}{" "}
                            KB)
                          </p>
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        PNG, JPG up to 5MB. Recommended: 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Name */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="dashboard.dashboardName"
                  >
                    Dashboard Name
                  </label>
                  <Input
                    type="text"
                    id="dashboard.dashboardName"
                    name="dashboard.dashboardName"
                    value={formik.values.dashboard.dashboardName}
                    onChange={formik.handleChange}
                    placeholder="Enter dashboard name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {formik.touched.dashboard?.dashboardName &&
                    formik.errors.dashboard?.dashboardName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.dashboard.dashboardName}
                      </p>
                    )}
                </div>

                {/* Description */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="dashboard.description"
                  >
                    Description
                  </label>
                  <textarea
                    id="dashboard.description"
                    name="dashboard.description"
                    value={formik.values.dashboard.description}
                    onChange={formik.handleChange}
                    placeholder="Brief description of your dashboard"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {formik.touched.dashboard?.description &&
                      formik.errors.dashboard?.description && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.dashboard.description}
                        </p>
                      )}
                    <p
                      className={`text-sm ml-auto ${
                        formik.values.dashboard.description.length > 180
                          ? "text-red-500"
                          : theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {formik.values.dashboard.description.length}/200
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="changePassword.currentPassword"
                  >
                    Current Password
                  </label>
                  <Input
                    type="password"
                    id="changePassword.currentPassword"
                    name="changePassword.currentPassword"
                    value={formik.values.changePassword.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter current password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {formik.touched.changePassword?.currentPassword &&
                    formik.errors.changePassword?.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.changePassword.currentPassword}
                      </p>
                    )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="changePassword.newPassword"
                  >
                    New Password
                  </label>
                  <Input
                    type="password"
                    id="changePassword.newPassword"
                    name="changePassword.newPassword"
                    value={formik.values.changePassword.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter new password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {formik.touched.changePassword?.newPassword &&
                    formik.errors.changePassword?.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.changePassword.newPassword}
                      </p>
                    )}
                  <p
                    className={`text-xs mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Password must be at least 9 characters with uppercase,
                    lowercase, number, and special character
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="changePassword.confirmNewPassword"
                  >
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    id="changePassword.confirmNewPassword"
                    name="changePassword.confirmNewPassword"
                    value={formik.values.changePassword.confirmNewPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {formik.touched.changePassword?.confirmNewPassword &&
                    formik.errors.changePassword?.confirmNewPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.changePassword.confirmNewPassword}
                      </p>
                    )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Save Button */}
        <div className="flex justify-center pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : theme === "dark"
                ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white hover:from-sky-700 hover:to-sky-800 shadow-sky-500/25"
                : "bg-gradient-to-r from-sky-600 to-sky-700 text-white hover:from-sky-700 hover:to-sky-800 shadow-sky-500/25"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SettingsPage;
