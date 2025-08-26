"use client";

import Sidebar from "@/app/components/Sidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { UserProvider, useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import CompanyRegisterModal from "@/app/components/CompanyRegisterModal";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const darkMode = true;

  const router = useRouter();
  const pathname = usePathname();

  // Show loader on route changes
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.prefetch(pathname); // optional for smoother navigation

    // Simulate route change events manually
    const observer = new MutationObserver(() => {
      setLoading(true);
      setTimeout(() => setLoading(false), 500); // simulate delay
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  // Check if company is registered
  useEffect(() => {
    const checkCompany = async () => {
      if (!user?.id) return;
      setLoading(true);
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "check", userId: user.id }),
      });

      const data = await res.json();
      setLoading(false);
      if (!data.exists) {
        setShowModal(true);
      }
    };

    checkCompany();
  }, [user?.id]);

  return (
    <>
      {loading && <Loader />}
      <div className={`flex h-screen ${darkMode ? "bg-[#121212] text-white" : "bg-white text-black"}`}>
        <Sidebar darkMode={darkMode} />
        <div className="flex-1 overflow-auto">
          <DashboardHeader onLogout={logout} />
          <main className="px-6 py-4">
            {showCompanyModal ? (
              <CompanyRegisterModal onClose={() => setShowCompanyModal(false)} userId={user?.id} />
            ) : (
              children
            )}
          </main>
        </div>
      </div>

      {showModal && (
        <CompanyRegisterModal
          userId={user?.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
