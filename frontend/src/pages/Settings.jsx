import React from 'react';
import { useTheme } from '../Context/ThemeContext'; // Adjust path if needed
import { Link } from 'react-router-dom';
import { FiMoon, FiSun, FiShield, FiUser } from 'react-icons/fi';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="max-w-4xl mx-auto p-6 mt-8">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

            <div className="grid gap-6">
                {/* Theme Preferences */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
                        Appearance
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium dark:text-gray-200">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {theme === 'dark' ? <FiSun className="text-yellow-400 text-xl" /> : <FiMoon className="text-gray-600 text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Support & Resolution Center */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
                        Support
                    </h2>
                    <Link 
                        to="/disputes" // Make sure this matches your actual dispute route
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                <FiShield className="text-blue-600 dark:text-blue-400 text-xl" />
                            </div>
                            <div>
                                <p className="font-medium dark:text-gray-200">Resolution Center</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage disputes and report issues</p>
                            </div>
                        </div>
                        <span className="text-gray-400 dark:text-gray-500">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Settings;