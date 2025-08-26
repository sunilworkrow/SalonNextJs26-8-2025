"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { AiOutlineBranches } from "react-icons/ai";
import { FaServicestack } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuUsersRound } from "react-icons/lu";
import { FaUserTie } from "react-icons/fa";
import Image from "next/image";

interface SidebarProps {
  darkMode: boolean;
}

export default function Sidebar({ darkMode }: SidebarProps) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false); // for dropdown toggle

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { href: "/dashboard/branches", label: "Branches", icon: <AiOutlineBranches /> },
    { href: "/dashboard/qr-builder", label: "QR Builder", icon: <IoQrCodeOutline /> },
    { label: "Services", icon: <FaServicestack />, isDropdown: true },
    { href: "/dashboard/report", label: "Report", icon: <TbReportAnalytics /> },
    { href: "/dashboard/staff", label: "Staff", icon: <LuUsersRound  /> },
    { href: "/dashboard/clients", label: "Clients", icon: <FaUserTie /> },
    { href: "/dashboard/profile", label: "Profile", icon: <CiUser /> },
  ];

  return (
    <div className={`w-64 h-full ${darkMode ? "bg-[#1a1a1a]" : "bg-gray-100"} border-r border-gray-800 flex flex-col`}>
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <div className="w-6 h-6 bg-[#000000] rounded-full flex items-center justify-center">
          <Image src="/img/logo.png" alt="" height={60} width={60} />
        </div>
        <h1 className="font-bold text-lg">Workrow</h1>
      </div>

      <div className="p-4 border-b border-gray-800">
        <span className="text-sm text-gray-400">Salon</span>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        {navItems.map((item) =>
          item.isDropdown ? (
            <div key="services-dropdown">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
                  pathname.includes("/dashboard/services") ? "bg-blue-600 text-white" : "border border-[#434343]"
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {servicesOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {servicesOpen && (
                <div className="ml-8 mt-2 space-y-1">
                  <Link
                    href="/dashboard/services/category"
                    className={`block px-3 py-2 rounded-md ${
                      pathname === "/dashboard/services/category" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Services Category
                  </Link>
                  <Link
                    href="/dashboard/services/all-services"
                    className={`block px-3 py-2 rounded-md ${
                      pathname === "/dashboard/services/all-services" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    All Services
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                pathname === item.href ? "bg-blue-600 text-white" : "border border-[#434343]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
