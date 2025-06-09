"use client"

import { CiSearch, CiBellOn } from "react-icons/ci";
import { useEffect, useState } from "react";

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
      if (!token) return;

      const res = await fetch("/api/get-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("API response:", result);

      if (result.success) {
        const firstName = result.data.name || "";       
        const lastName = result.data.lastName || "";    // last name
        const fullName = `${firstName} ${lastName}`.trim();

        setUser({
          name: fullName,
          image: result.data.image,
        });
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p className="text-gray-400">Loading...</p>;
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase();
  };

  return (
    <header className="border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 bg-[#121212] z-10">
      <div className="relative w-1/2">
        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search campaign, customer, etc."
          className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">
          <CiBellOn />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg border-[1px] border-[#909090] text-[13px] px-3 py-1 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
