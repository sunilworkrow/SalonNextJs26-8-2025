"use client"

import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
import Sidebar from "./sidebar"
import DashboardHeader from "./dashboard-header"
import ProfileForm from "./profile-form"

interface ProfileFormProps {
  darkMode: boolean;
}

export default function page() {

  const [darkMode, setDarkMode] = useState(true)

  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login')
      return;
    }

    try {

      const decode = jwt.decode(token);
     

      setUser(decode)

      

    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }

  }, [])


  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };



  return (
    <div className={`flex h-screen ${darkMode ? "bg-[#121212] text-white" : "bg-white text-black"}`}>
      <Sidebar darkMode={darkMode} />
      <div className="flex-1 overflow-auto">
        <DashboardHeader onLogout={logout} />
        <main className="px-6 py-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-sm text-gray-400">Manage your account settings and preferences</p>
          </div>




          <ProfileForm darkMode={darkMode}  user={user} />
        </main>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-4 left-4 flex items-center gap-2 px-3 py-2 text-xs bg-[#1e1e1e] rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-moon"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        Dark Mode
        <div className={`w-4 h-4 rounded-full ${darkMode ? "bg-blue-500" : "bg-gray-400"}`}></div>
      </button>
    </div>
  )
}
