"use client"

import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"
import { IoMdArrowBack } from "react-icons/io";
import Modal from "@/app/components/login-modal";
import { useUser } from "@/app/context/UserContext";

interface Staff {
    id: number
    name: string
    email: string
    role: string
    phone: number
    staff_join_date: string
    address: string
}


export default function Page() {

    const [staff, setStaff] = useState<Staff[]>([]);

    const [showAddStaff, setShowAddStaff] = useState(false);

    const [name, setName] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");


    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [modalType, setModalType] = useState<"success" | null>(null);
    const [modalMessage, setModalMessage] = useState("");

    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const [editName, setEditName] = useState("");
    const [editJoinDate, setEditJoinDate] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    const { user } = useUser();


    const handleAddNew = () => {
        setShowAddStaff(true)
    }

    const handleBack = () => {
        setShowAddStaff(false)
    }




    // get staff 


    const fatchStaff = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await fetch("/api/staff", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();

            console.log("staff result", result)

            if (res.ok && result.success && Array.isArray(result.data)) {
                setStaff(result.data);
            } else {
                setStaff([]);
            }

        } catch (err) {
            console.error("Error fetching Branches:", err);
            setStaff([]);
        }

    }

    useEffect(() => {
        if (user?.companies_id) {
            fatchStaff();
        }
    }, [user?.companies_id])





    function formatDate(inputDate: string): string {
        const date = new Date(inputDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }





    const validateForm = () => {

        const newErrors: { [key: string]: string } = {};


        if (!name.trim()) newErrors.name = "Staff  name is required";
        if (!email.trim()) newErrors.email = "Staff email is required";
        if (!role.trim()) newErrors.role = "Staff role is required";
        if (!phone.trim()) newErrors.phone = "Staff phone is required";
        if (!address.trim()) newErrors.address = "Staff address is required";
        if (!joinDate.trim() || isNaN(Date.parse(joinDate))) {
            newErrors.staff_join_date = "Staff Join Date is invalid or required";
        }

        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;
    };

    // add staff


    const handleSubmit = async () => {

        if (!validateForm()) return;

        const token = localStorage.getItem("token");

        try {

            const res = await fetch("/api/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    role: role,
                    phone: phone,
                    address: address,
                    staff_join_date: joinDate,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setName("");
                setEmail("");
                setRole("");
                setPhone("");
                setAddress("");
                setJoinDate("");
                setModalMessage("Staff added successfully!");
                setModalType("success");
                setShowAddStaff(false);
                await fatchStaff();
            } else {
                if (data.message?.toLowerCase().includes("Staff already exists")) {
                    setModalMessage("Staff already exists");
                    setModalType("success");
                }
            }

        } catch (error) {

        }

    }


    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        try {

            const res = await fetch("/api/staff", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify({ id }),
            });

            const result = await res.json();

            console.log("result result result", result)

            if (res.ok && result.success) {
                setStaff(staff.filter((staff) => staff.id !== id));
            } else {
                console.error("Failed to delete staff:", result.message);
            }
        } catch (err) {
            console.error("Error deleting staff:", err);
        }

    }



const handleEdit = (id: number) => {
  const editon = staff.find((s) => s.id === id);
  if (editon) {
    setEditingStaff(editon);

    // Use the edit states (these are used in the modal)
    setEditName(editon.name);
    setEditEmail(editon.email);
    setEditRole(editon.role);
    setEditPhone(editon.phone.toString());
    setEditAddress(editon.address);
    setEditJoinDate(editon.staff_join_date);

    setIsEditModalOpen(true);
  }
};



    const handleUpdateSubmit = async () => {

        if (!editingStaff) return;

        const user_id = user?.id;
        const companies_id = user?.companies_id;

        if (!user_id || !companies_id) {
            console.error("User or Company info missing!");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Token missing!");
            return;
        }


        try {

            const res = await fetch("/api/staff", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: editingStaff.id,
                    name: editName,
                    email: editEmail,
                    role: editRole,
                    phone: editPhone,
                    address: editAddress,
                    staff_join_date: editJoinDate,
                    user_id,
                    companies_id,
                })

            });


            const result = await res.json();

            if (res.ok && result.success) {
                fatchStaff();
                setIsEditModalOpen(false);
                setEditingStaff(null);
            } else {
                console.error("Update failed:", result.message);
            }
        } catch (err) {
            console.error("Error updating:", err);
        }


    }



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
                <h1 className="text-2xl font-bold">Staff</h1>
            </div>



            {
                !showAddStaff ? (

                    <div>
                        <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
                            <h2 className="text-lg font-medium">List Of Your Approved Staff</h2>
                            <button
                                onClick={handleAddNew}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add New Staff
                            </button>
                        </div>


                        <div className="rounded-b-lg p-6 mb-6 border bg-[#1a1a1a] border-gray-800">
                            <div className="overflow-x-auto whitespace-nowrap">
                                <table className="w-full border border-gray-800">
                                    <thead>
                                        <tr >
                                            <th className="text-left py-4 px-6 font-semibold border border-gray-600">Name</th>
                                            <th className="text-left py-4 px-6 font-semibold border border-gray-600">Email</th>
                                            <th className="text-left py-4 px-6 font-semibold border border-gray-600">Role</th>
                                            <th className="text-left py-4 px-6 font-semibold border border-gray-600">Phone</th>
                                            <th className="text-left py-4 px-6 font-semibold border border-gray-600">Address</th>
                                            <th className="text-left py-4 px-6 font-semibold border border-gray-600">Join Date</th>
                                            <th className="text-left py-4 px-6 font-semibold border border-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    {<tbody>
                                        {staff.map((staff) => (
                                            <tr key={staff.id} className="border-b border-gray-800">
                                                <td className="border-r border-gray-800 py-4 px-6"> {staff.name} </td>
                                                <td className="border-r border-gray-800 py-4 px-6"> {staff.email} </td>
                                                <td className="border-r border-gray-800 py-4 px-6"> {staff.role} </td>
                                                <td className="border-r border-gray-800 py-4 px-6"> {staff.phone} </td>
                                                <td className="border-r border-gray-800 py-4 px-6"> {staff.address} </td>
                                                <td className="border-r border-gray-800 py-4 px-6 ">{formatDate(staff.staff_join_date)}</td>
                                                <td className="border-r border-gray-800 py-4 px-6">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(staff.id)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
                                                            <FiEdit2 className="w-3 h-3" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(staff.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
                                                            <FiTrash2 className="w-3 h-3" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}



                                    </tbody>}
                                </table>
                            </div>
                        </div>


                    </div>

                ) : (

                    <div>

                        <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
                            <h2 className="text-lg font-medium">Add Of Your Approved Staff</h2>
                            <button
                                onClick={handleBack}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer"
                            >
                                <IoMdArrowBack className="w-4 h-4" />
                                Back to List
                            </button>
                        </div>

                        <div className="rounded-b-lg p-6 border bg-[#1a1a1a] border-gray-800 text-white">

                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-2">

                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                            </div>


                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-2">

                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-2">

                                    Role <span className="text-red-500">*</span>
                                </label>

                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-3 py-3 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select role</option>

                                    <option value="staff"> Staff </option>

                                </select>

                                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-2">

                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                            </div>



                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-2">

                                    Join Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="Date"
                                    value={joinDate}
                                    onChange={(e) => setJoinDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {errors.staff_join_date && <p className="text-red-500 text-sm">{errors.staff_join_date}</p>}


                            </div>


                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-2">

                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder=" Address..."
                                />

                                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                            </div>


                            <div className="flex justify-center pt-6">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2"
                                >
                                    Submit
                                </button>
                            </div>

                        </div>

                    </div>
                )
            }



            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center text-gray-900">
                        <h2 className="text-2xl font-bold mb-4">Edit Staff</h2>
                        <div className='mb-4'>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>


                        <div className='mb-4'>
                            <input
                                type="text"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className='mb-4'>
                            <input
                                type="text"
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className='mb-4'>
                            <input
                                type="text"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className='mb-4'>
                            <input
                                type="text"
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>


                        <div className='mb-4'>
                            <input
                                type="date"
                                value={editJoinDate.slice(0, 10)} // Fix date format if needed
                                onChange={(e) => setEditJoinDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-auto px-10 py-1 bg-white text-gray-800 border border-gray-300 rounded-full font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateSubmit}
                                className="w-auto px-10 py-1 bg-white text-gray-800 border border-gray-300 rounded-full font-semibold"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>


    )
}
