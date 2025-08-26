"use client"

import { CiSearch, CiBellOn } from "react-icons/ci";
import { useEffect, useState } from "react";
import Image from "next/image";
import router from "next/router";

type Props = {
  onLogout: () => void;
};

type UserType = {
  name: string;
  image?: string;
};

export default function DashboardHeader({ onLogout }: Props) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");;

      try {
        const res = await fetch("/api/get-profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (result.success) {
          const firstName = result.data.name || "";
          const lastName = result.data.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim();

          setUser({
            name: fullName,
            image: result.data.image,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <header className="sticky top-0 z-10 g-[#121212] custom-shadow p-4 text-sm text-gray-400">
        Loading...
      </header>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase();
  };

  return (
    <header className="border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 bg-[#121212] z-10">
      {/* Search Bar */}
      <div className="relative w-1/2">
        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search campaign, customer, etc."
          className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative text-white">
          <CiBellOn size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* User Avatar + Name + Logout */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex items-center justify-center">
            {user.image ? (
              <Image
                src={user.image}
                alt="User"
                className="w-full h-full object-cover"
                height={30}
                width={30}
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {getInitials(user.name)}
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="hidden md:block">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>

          {/* Logout Button */}
          <button
           onClick={onLogout}
            className="rounded-lg border border-[#909090] text-xs px-3 py-1 text-white hover:bg-red-500 hover:border-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
