import React, { useState, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Settings,
  Bell,
  Lock,
  Image,
  Monitor,
  Globe,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useAuth } from "../features/auth/useAuth";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { changePassword } from "../services/apiAuth";
import axiosInstance from "../services/axiosInstance";

const SettingsPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  // eslint-disable-next-line no-empty-pattern
  const {  } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  // Form validation schema
  const validationSchema = Yup.object({
    notifications: Yup.object({
      email: Yup.boolean(),
      push: Yup.boolean(),
    }),
    dashboard: Yup.object({
      defaultView: Yup.string().required("Default view is required"),
      showStats: Yup.boolean(),
      showSalesChart: Yup.boolean(),
      showAnalysisBox: Yup.boolean(),
    }),
    changePassword: Yup.object({
      currentPassword: Yup.string().when("newPassword", {
        is: (newPassword) => !!newPassword,
        then: (schema) => schema.required("Current password is required"),
      }),
      newPassword: Yup.string().test(
        "password-requirements",
        "Password must be at least 9 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        function (value) {
          if (!value) return true; // Allow empty newPassword (optional)
          return (
            value.length >= 9 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[@$!%*?&]/.test(value)
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
      notifications: {
        email: true,
        push: true,
      },
      dashboard: {
        defaultView: "overview",
        showStats: true,
        showSalesChart: true,
        showAnalysisBox: true,
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
        // Handle logo upload
        if (logoFile) {
          const formData = new FormData();
          formData.append("logo", logoFile);
          await axiosInstance.post("/Settings/UploadLogo", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Logo uploaded successfully");
        }

        // Handle change password
        if (values.changePassword.newPassword) {
          const response = await changePassword({
            currentPassword: values.changePassword.currentPassword,
            newPassword: values.changePassword.newPassword,
          });
          if (response.data.isSuccess) {
            toast.success("Password changed successfully");
          } else {
            throw new Error(response.data.errors?.[0] || "Failed to change password");
          }
        }

        // Save other settings (mock API call)
        await axiosInstance.post("/Settings/Update", {
          language,
          theme,
          notifications: values.notifications,
          dashboard: values.dashboard,
          twoFactorAuth: values.twoFactorAuth,
        });

        toast.success("Settings updated successfully");
      } catch (error) {
        const errorMessage =
          error.response?.data?.errors?.join("\n") ||
          error.message ||
          "Failed to save settings";
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
        toast.dismiss(loadingId);
      }
    },
  });

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <Settings size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
    { id: "dashboard", label: "Dashboard", icon: <Monitor size={18} /> },
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
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-center text-sky-700">
        Admin Settings
      </h1>

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
          {/* General Settings */}
          {activeTab === "general" && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Language Selection */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  htmlFor="language"
                >
                  Language
                </label>
                <div className="relative">
                  <select
                    id="language"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all appearance-none ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-sky-200"
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    } pointer-events-none`}
                  />
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Theme
                </label>
                <div className="flex gap-4">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "light"
                        ? "border-sky-500 bg-sky-50"
                        : theme === "dark"
                        ? "border-gray-600 hover:border-sky-400"
                        : "border-gray-200 hover:border-sky-200"
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
                      className={theme === "light" ? "text-sky-500" : "text-gray-500"}
                    />
                    <span>Light</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "dark"
                        ? "border-sky-500 bg-gray-700"
                        : theme === "dark"
                        ? "border-gray-600 hover:border-sky-400"
                        : "border-gray-200 hover:border-sky-200"
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
                      className={theme === "dark" ? "text-sky-500" : "text-gray-500"}
                    />
                    <span>Dark</span>
                  </label>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  htmlFor="logo"
                >
                  Dashboard Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white border-sky-200"
                  }`}
                />
                {logoFile && (
                  <p className="text-sm text-gray-500">
                    Selected: {logoFile.name}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
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
                Notifications
              </h3>

              <div className="flex items-center justify-between">
                <label
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  htmlFor="notifications.email"
                >
                  Email Notifications
                </label>
                <input
                  type="checkbox"
                  id="notifications.email"
                  name="notifications.email"
                  checked={formik.values.notifications.email}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  htmlFor="notifications.push"
                >
                  Push Notifications
                </label>
                <input
                  type="checkbox"
                  id="notifications.push"
                  name="notifications.push"
                  checked={formik.values.notifications.push}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
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
                Security
              </h3>

              {/* Change Password */}
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-sky-200"
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
                    className={`block text-sm font-medium ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-sky-200"
                    }`}
                  />
                  {formik.touched.changePassword?.newPassword &&
                    formik.errors.changePassword?.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.changePassword.newPassword}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white border-sky-200"
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

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <label
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  htmlFor="twoFactorAuth"
                >
                  Two-Factor Authentication
                </label>
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={formik.values.twoFactorAuth}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
              </div>
            </motion.div>
          )}

          {/* Dashboard Settings */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
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

              {/* Default View */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  htmlFor="dashboard.defaultView"
                >
                  Default Dashboard View
                </label>
                <select
                  id="dashboard.defaultView"
                  name="dashboard.defaultView"
                  value={formik.values.dashboard.defaultView}
                  onChange={formik.handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white border-sky-200"
                  }`}
                >
                  <option value="overview">Overview</option>
                  <option value="articles">Articles</option>
                  <option value="doctors">Doctors</option>
                  <option value="users">Users</option>
                  <option value="categories">Categories</option>
                </select>
                {formik.touched.dashboard?.defaultView &&
                  formik.errors.dashboard?.defaultView && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.dashboard.defaultView}
                    </p>
                  )}
              </div>

              {/* Widget Visibility */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="dashboard.showStats"
                  >
                    Show Stats Widget
                  </label>
                  <input
                    type="checkbox"
                    id="dashboard.showStats"
                    name="dashboard.showStats"
                    checked={formik.values.dashboard.showStats}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="dashboard.showSalesChart"
                  >
                    Show Sales Chart
                  </label>
                  <input
                    type="checkbox"
                    id="dashboard.showSalesChart"
                    name="dashboard.showSalesChart"
                    checked={formik.values.dashboard.showSalesChart}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="dashboard.showAnalysisBox"
                  >
                    Show Analysis Box
                  </label>
                  <input
                    type="checkbox"
                    id="dashboard.showAnalysisBox"
                    name="dashboard.showAnalysisBox"
                    checked={formik.values.dashboard.showAnalysisBox}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : theme === "dark"
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "bg-sky-600 text-white hover:bg-sky-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default SettingsPage;