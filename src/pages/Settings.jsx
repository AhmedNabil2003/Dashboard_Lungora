import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  X, 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  ChevronDown,
  LogOut
} from 'lucide-react';

const Settingss = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
      dataSharing: false
    },
    twoFactorAuth: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        marketing: false
      },
      privacy: {
        profileVisibility: 'public',
        activityStatus: true,
        dataSharing: false
      },
      twoFactorAuth: false
    });
  };

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 lg:p-8 bg-white shadow-lg rounded-2xl max-w-4xl mx-auto my-8 relative overflow-hidden"
    >
      {/* Background Design Element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-sky-400 to-sky-600 -z-10 rounded-t-2xl" />
      
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 left-4 bg-green-100 text-green-700 p-3 rounded-lg text-center"
          >
            Settings updated successfully!
          </motion.div>
        )}
      </AnimatePresence>
      
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-center text-sky-700">
        Dashboard Settings
      </h1>
      
      <div className="mt-8">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm md:text-base transition-all ${
                activeTab === tab.id 
                  ? 'text-sky-600 border-b-2 border-sky-500 -mb-px font-medium' 
                  : 'text-gray-600 hover:text-sky-500'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="language">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all appearance-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ar">العربية</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.theme === 'light' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-200'
                    }`}>
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={formData.theme === 'light'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Sun size={20} className={formData.theme === 'light' ? 'text-sky-500' : 'text-gray-500'} />
                      <span>Light</span>
                    </label>
                    <label className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.theme === 'dark' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-200'
                    }`}>
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={formData.theme === 'dark'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Moon size={20} className={formData.theme === 'dark' ? 'text-sky-500' : 'text-gray-500'} />
                      <span>Dark</span>
                    </label>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="twoFactorAuth">
                      Two-Factor Authentication
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="twoFactorAuth"
                        name="twoFactorAuth"
                        checked={formData.twoFactorAuth}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Enhance your account security by requiring a verification code in addition to your password when signing in.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>

                {/* Email Notification */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700" htmlFor="notifications.email">
                    Email Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="notifications.email"
                    name="notifications.email"
                    checked={formData.notifications.email}
                    onChange={handleInputChange}
                    className="toggle-checkbox"
                  />
                </div>

                {/* Push Notification */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700" htmlFor="notifications.push">
                    Push Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="notifications.push"
                    name="notifications.push"
                    checked={formData.notifications.push}
                    onChange={handleInputChange}
                    className="toggle-checkbox"
                  />
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700" htmlFor="notifications.marketing">
                    Marketing Emails
                  </label>
                  <input
                    type="checkbox"
                    id="notifications.marketing"
                    name="notifications.marketing"
                    checked={formData.notifications.marketing}
                    onChange={handleInputChange}
                    className="toggle-checkbox"
                  />
                </div>
              </motion.div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-700">Privacy</h3>
                
                {/* Profile Visibility */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="privacy.profileVisibility">
                    Profile Visibility
                  </label>
                  <select
                    id="privacy.profileVisibility"
                    name="privacy.profileVisibility"
                    value={formData.privacy.profileVisibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {/* Activity Status */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700" htmlFor="privacy.activityStatus">
                    Show Activity Status
                  </label>
                  <input
                    type="checkbox"
                    id="privacy.activityStatus"
                    name="privacy.activityStatus"
                    checked={formData.privacy.activityStatus}
                    onChange={handleInputChange}
                    className="toggle-checkbox"
                  />
                </div>

                {/* Data Sharing */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700" htmlFor="privacy.dataSharing">
                    Share Data with Third-Party
                  </label>
                  <input
                    type="checkbox"
                    id="privacy.dataSharing"
                    name="privacy.dataSharing"
                    checked={formData.privacy.dataSharing}
                    onChange={handleInputChange}
                    className="toggle-checkbox"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700'}`}
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Settingss;
