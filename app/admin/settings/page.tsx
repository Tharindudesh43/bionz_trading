import React from "react";

// --- DUMMY DATA ---
const ADMIN_USER = {
    name: "Admin John",
    email: "admin.john@bionz.com",
    role: "Administrator",
    lastLogin: "2025-12-08 06:30 AM",
};

export default function SettingsPage() {
    
    // Placeholder for a function to handle password change
    const handleChangePassword = () => {
        alert("Password change form should open here!");
    };

    return (
        <div className="min-h-full space-y-8">
            <h1 className="text-3xl font-extrabold text-white border-b border-gray-700 pb-3">
                Settings & Administration
            </h1>

            {/* --- 1. ADMIN PROFILE (Settings for the current user) --- */}
            <section className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">My Profile</h2>
                
                <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    {/* User Info */}
                    <div className="space-y-3 flex-1">
                        <div className="text-sm">
                            <p className="text-gray-400">Name:</p>
                            <p className="font-medium text-white">{ADMIN_USER.name}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-400">Email:</p>
                            <p className="font-medium text-white">{ADMIN_USER.email}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-400">Role:</p>
                            <p className="font-medium text-green-400">{ADMIN_USER.role}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-400">Last Login:</p>
                            <p className="font-medium text-white">{ADMIN_USER.lastLogin}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 pt-4 md:pt-0">
                        {/* Replace with your actual Button component */}
                        <button 
                            // onClick={handleChangePassword}
                            className="w-full py-2 px-4 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Change Password
                        </button>
                        {/* Example of another action */}
                        <button 
                            className="w-full py-2 px-4 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 transition-colors shadow-md"
                        >
                            Update Details
                        </button>
                    </div>
                </div>
            </section>
            
            <hr className="border-gray-800" />

            {/* --- 2. APPLICATION SETTINGS --- */}
            <section className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">Application Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Setting Card 1: Theme */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Default Theme</h3>
                        <p className="text-gray-400 text-sm mb-3">Set the default color scheme for the application front-end.</p>
                        <select className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm focus:ring-blue-500">
                            <option>Dark Mode</option>
                            <option>Light Mode (Coming Soon)</option>
                        </select>
                    </div>

                    {/* Setting Card 2: API Keys */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">API Key Management</h3>
                        <p className="text-gray-400 text-sm mb-3">View and regenerate internal API access keys.</p>
                        <button className="py-2 px-4 rounded-lg text-sm font-semibold bg-yellow-600 hover:bg-yellow-700 transition-colors">
                            Manage Keys
                        </button>
                    </div>
                </div>
            </section>

            <hr className="border-gray-800" />

            {/* --- 3. USER MANAGEMENT (Admin-only task) --- */}
            <section className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">User Management</h2>
                <p className="text-gray-300 mb-4">Manage user roles, subscriptions, and access permissions.</p>
                <button className="py-2 px-4 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                    Go to User List
                </button>
            </section>
        </div>
    );
}