
"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { useUser } from "@/app/context/UserContext";
import Modal from "@/app/components/login-modal";



interface Clients {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    service_name: string;
    staffs_name: string;
    branch_name: string;
    price: string;
}

export default function page() {


    const [showAddClient, setShowAddClient] = useState(false);

    const [branches, setBranches] = useState<Clients[]>([]);
    const [services, setServices] = useState<Clients[]>([]);
    const [staff, setStaff] = useState<Clients[]>([]);

    const [clients, setClients] = useState<Clients[]>([]);

    const [modalType, setModalType] = useState<"success" | null>(null);
    const [modalMessage, setModalMessage] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});



    const { user } = useUser();

    // Service api use 

    const fetchServices = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await fetch("/api/all-services", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();

            console.log("Services.data", result);

            if (res.ok && result.success && Array.isArray(result.data)) {
                setServices(result.data);
            } else {
                setServices([]);
            }
        } catch (err) {
            console.error("Error fetching Branches:", err);
            setServices([]);
        }

    }

    useEffect(() => {
        if (user?.companies_id) {
            fetchServices();
        }
    }, [user?.companies_id]);


    // staff api use

    // const fatchstaff





    // branch api use 

    const fetchBranches = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await fetch("/api/branches", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();

            console.log("Branches.data", result);

            if (res.ok && result.success && Array.isArray(result.data)) {
                setBranches(result.data);
            } else {
                setBranches([]);
            }
        } catch (err) {
            console.error("Error fetching Branches:", err);
            setBranches([]);
        }
    };

    useEffect(() => {
        if (user?.companies_id) {
            fetchBranches();
        }
    }, [user?.companies_id]);



    // get staff data 

    const fetchStaff = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await fetch("/api/staff", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();

            console.log("staff.data", result);

            if (res.ok && result.success && Array.isArray(result.data)) {
                setStaff(result.data);
            } else {
                setStaff([]);
            }
        } catch (err) {
            console.error("Error fetching staff:", err);
            setStaff([]);
        }
    };

    useEffect(() => {
        if (user?.companies_id) {
            fetchStaff();
        }
    }, [user?.companies_id]);


    const validateForm = () => {
        const newErrors: any = {};
        if (!name.trim()) newErrors.name = "Client name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        if (!phone.trim()) newErrors.phone = "Phone is required";
        if (!gender) newErrors.gender = "Gender is required";
        if (!selectedService) newErrors.service = "Service is required";
        if (!selectedStaff) newErrors.staff = "Staff is required";
        if (!selectedBranch) newErrors.branch = "Branch is required";
        if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = "Valid price is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("/api/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    gender,
                    services_id: selectedService, // ✅ match API
                    staffs_id: selectedStaff,     // ✅ match API
                    branch_id: selectedBranch,
                    price,
                }),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setModalMessage("Service added successfully!");
                setModalType("success");
                // reset form
                setName("");
                setEmail("");
                setPhone("");
                setGender("");
                setSelectedService("");
                setSelectedStaff("");
                setSelectedBranch("");
                setPrice("");
                setShowAddClient(false);


            } else {
                setModalMessage(result.message || "Something went wrong");
                setModalType("success");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setModalMessage("Something went wrong");
            setModalType("success");
        }
    };


    const fetchClients = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/clients", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const result = await res.json();

            console.log("clients.data", result);

            if (res.ok && result.success && Array.isArray(result.data)) {
                setClients(result.data);
            } else {
                console.error("Unexpected data format", result);
                setClients([]);
            }
        } catch (err) {
            console.error("Error fetching clients:", err);
            setClients([]);
        }
    };


    useEffect(() => {
        if (user?.companies_id) {
            fetchClients();
        }
    }, [user?.companies_id]);





 const handleDeleteClient = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/clients", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setClients(prev => prev.filter(clients => clients.id !== id));
      } else {
        console.error("Delete failed:", result.message);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };



    return (
        <div className="max-w-4xl mx-auto">


            {modalType && (
                <Modal
                    modalType={modalType}
                    message={modalMessage}
                    errors={{}}
                    onClose={() => setModalType(null)}
                />
            )}

            <div className="rounded-lg p-6 border bg-[#1a1a1a] border-gray-800 mb-6">
                <h1 className="text-2xl font-bold">All Clients </h1>
            </div>

            <div>

                {!showAddClient ? (
                    <div>

                        <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
                            <h2 className="text-lg font-medium">List of Clients</h2>
                            <button
                                onClick={() => setShowAddClient(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                                <FiPlus className="w-4 h-4" /> Add New Client
                            </button>
                        </div>




                        <div className="rounded-b-lg p-6 mb-6 border bg-[#1a1a1a] border-gray-800">
                            <div className="overflow-x-auto whitespace-nowrap">
                                <table className="w-full border border-gray-800">
                                    <thead>
                                        <tr>
                                            <th className="text-left py-4 px-6 border border-gray-600">Clients Name</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Email</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Phone</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Gender</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Service</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Staff</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Branch</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Price</th>
                                            <th className="text-left py-4 px-6 border border-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map((client) => (
                                            <tr key={client.id} className="border-b border-gray-800">
                                                <td className="py-4 px-6 border-r border-gray-800">{client.name}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">{client.email}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">{client.phone}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">{client.gender}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">{client.service_name}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">{client.staffs_name}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">{client.branch_name}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">{client.price}</td>
                                                <td className="py-4 px-6 border-r border-gray-800">
                                                    <div className="flex gap-2">
                                                       
                                                        <button onClick={() => handleDeleteClient(client.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex gap-1 items-center">
                                                            <FiTrash2 className="w-3 h-3" /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (

                    <div>
                        <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
                            <h2 className="text-lg font-medium">Add New Client</h2>
                            <button
                                onClick={() => setShowAddClient(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2"
                            >
                                <IoMdArrowBack className="w-4 h-4" /> Back to List
                            </button>
                        </div>

                        <div className="rounded-b-lg p-6 border bg-[#1a1a1a] border-gray-800 text-white">
                            {/* Name */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Client Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm">{errors.phone}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full px-3 py-3 rounded-lg border bg-[#252525] border-gray-700"
                                >
                                    <option value="">--- Select ---</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm">{errors.gender}</p>
                                )}
                            </div>

                            {/* Service */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Select Service <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="w-full px-3 py-3 rounded-lg border bg-[#252525] border-gray-700"
                                >
                                    <option value="">--- Select ---</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.service && (
                                    <p className="text-red-500 text-sm">{errors.service}</p>
                                )}
                            </div>

                            {/* Staff */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Select Staff <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedStaff}
                                    onChange={(e) => setSelectedStaff(e.target.value)}
                                    className="w-full px-3 py-3 rounded-lg border bg-[#252525] border-gray-700"
                                >
                                    <option value="">--- Select ---</option>
                                    {staff.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.staff && (
                                    <p className="text-red-500 text-sm">{errors.staff}</p>
                                )}
                            </div>

                            {/* Branch */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Select Branch <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    className="w-full px-3 py-3 rounded-lg border bg-[#252525] border-gray-700"
                                >
                                    <option value="">--- Select ---</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.branch && (
                                    <p className="text-red-500 text-sm">{errors.branch}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">
                                    Price (MXN) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm">{errors.price}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-center pt-6">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>
    )
}
