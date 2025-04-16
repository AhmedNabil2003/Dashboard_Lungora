import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
    const [language, setLanguage] = useState('en');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('user@example.com');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

    const handleLanguageChange = () => {
        alert(`Language changed to ${language === 'en' ? 'English' : language === 'ar' ? 'Arabic' : 'French'}`);
    };

    const handleEmailChange = () => {
        alert(`Email updated to ${email}`);
    };

    const handlePasswordChange = () => {
        alert('Password updated successfully!');
    };

    const handleTwoFactorChange = () => {
        alert(isTwoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled');
    };

    const handleNotificationsChange = () => {
        alert(notificationsEnabled ? 'Notifications Enabled' : 'Notifications Disabled');
    };

    const handleLogOutAllDevices = () => {
        alert('Logged out from all devices!');
    };

    const handleSaveSettings = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <motion.header
                className="flex justify-between items-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <h1 className="text-sky-600 text-3xl font-bold ">Settings</h1>
            </motion.header>

            {/* General Settings */}
            <motion.div
                className="bg-white p-6 shadow-lg rounded-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <div>
                    <label htmlFor="language" className="block mb-2">Select Language</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-100 p-3 rounded-md w-full"
                    >
                        <option value="en">English</option>
                        <option value="ar">Arabic</option>
                        <option value="fr">French</option>
                    </select>
                </div>
                <motion.button
                    onClick={handleLanguageChange}
                    className="bg-sky-500 text-white px-4 py-2 rounded-lg mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Change Language
                </motion.button>
            </motion.div>

            {/* Account Settings */}
            <motion.div
                className="bg-white p-6 shadow-lg rounded-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-100 p-3 rounded-md w-full"
                    />
                </div>
                <motion.button
                    onClick={handleEmailChange}
                    className="bg-sky-500 text-white px-4 py-2 rounded-lg mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Update Email
                </motion.button>
                <div className="mt-4">
                    <label htmlFor="password" className="block mb-2">Change Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-100 p-3 rounded-md w-full"
                    />
                </div>
                <motion.button
                    onClick={handlePasswordChange}
                    className="bg-sky-500 text-white px-4 py-2 rounded-lg mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Update Password
                </motion.button>
            </motion.div>

            {/* Security Settings */}
            <motion.div
                className="bg-white p-6 shadow-lg rounded-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <div className="flex items-center justify-between">
                    <label htmlFor="twoFactor" className="text-lg">Enable Two-Factor Authentication</label>
                    <input
                        type="checkbox"
                        id="twoFactor"
                        checked={isTwoFactorEnabled}
                        onChange={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
                        className="checkbox-size h-6 w-6"
                    />
                </div>
                <motion.button
                    onClick={handleTwoFactorChange}
                    className="bg-sky-500 text-white px-4 py-2 rounded-lg mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isTwoFactorEnabled ? 'Disable Two-Factor' : 'Enable Two-Factor'}
                </motion.button>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
                className="bg-white p-6 shadow-lg rounded-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                <div className="flex items-center justify-between">
                    <label htmlFor="notifications" className="text-lg">Enable Notifications</label>
                    <input
                        type="checkbox"
                        id="notifications"
                        checked={notificationsEnabled}
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        className="checkbox-size h-6 w-6"
                    />
                </div>
                <motion.button
                    onClick={handleNotificationsChange}
                    className="bg-sky-500 text-white px-4 py-2 rounded-lg mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
                </motion.button>
            </motion.div>

            {/* Sessions Settings */}
            <motion.div
                className="bg-white p-6 shadow-lg rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-4">Sessions</h2>
                <p className="text-gray-600 mb-4">Manage your active sessions across devices.</p>
                <motion.button
                    onClick={handleLogOutAllDevices}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Log Out from All Devices
                </motion.button>
            </motion.div>

            <style>
                {`
                    .checkbox-size {
                        transform: scale(1.25);
                        /* You can adjust the scale here */
                    }

                    /* Optional: media query to adjust for smaller screens */
                    @media (max-width: 768px) {
                        .checkbox-size {
                            transform: scale(1.1); /* Slightly smaller size on smaller screens */
                        }
                    }

                    @media (max-width: 480px) {
                        .checkbox-size {
                            transform: scale(1.0); /* Even smaller size on very small screens */
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Settings;
