"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function CompanyRegisterModal({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: number | undefined;
}) {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const { user, setUser } = useUser();


  const handleSubmit = async () => {
    if (!companyName || !industry || !address) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "register",
        userId,
        companyName,
        industry,
        address,
      }),
    });

    const data = await res.json();

    if (data.success && data.companies_id) {

      setUser({
        ...user!,
        companies_id: data.companies_id,
      });


      setMessage("Company registered successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    else {
      setMessage(data.message || "Failed to register company.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#00000080] bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Register Your Company</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Company"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
