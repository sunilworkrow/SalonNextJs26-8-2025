"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import Modal from "@/app/components/login-modal";
import { useUser } from "@/app/context/UserContext";


interface Branch {
  id: number;
  name: string;
}

export default function Page() {
  const [Category, setCategory] = useState<Branch[]>([]);

  const [showAddBranch, setShowAddBranch] = useState(false);
  const [name, setName] = useState("");
  const [modalType, setModalType] = useState<"success" | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { user } = useUser();

  console.log("User object:", user);


const fetchCategory = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await fetch("/api/category", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (res.ok && result.success && Array.isArray(result.data)) {
      setCategory(result.data);
    } else {
      setCategory([]);
    }
  } catch (err) {
    console.error("Error fetching Category:", err);
    setCategory([]);
  }
};


useEffect(() => {
  if (user?.companies_id) {
    fetchCategory();
  }
}, [user?.companies_id]);



  // Add new category

 const handleSubmit = async () => {
  const newErrors: { name?: string } = {};
  if (!name.trim()) {
    newErrors.name = "Name is required";
    setErrors(newErrors);
    return;
  }

  setErrors({});

  const user_id = user?.id;
  const companies_id = user?.companies_id;
  const token = localStorage.getItem("token"); // ✅ get token

  if (!user_id || !companies_id || !token) {
    setModalMessage("User, Company ID, or Token is missing");
    setModalType("success");
    return;
  }

  try {
    const res = await fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ add token here
      },
      body: JSON.stringify({ name, user_id, companies_id }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setName("");
      setModalMessage("Category added successfully!");
      setModalType("success");
      fetchCategory();
      setShowAddBranch(false);
    } else {
      setModalMessage(data.message || "Something went wrong");
      setModalType("success");
    }
  } catch (err) {
    console.error("Add error:", err);
    setModalMessage("Something went wrong");
    setModalType("success");
  }
};





  const handleEdit = (id: number) => {
    const branch = Category.find((b) => b.id === id);
    if (branch) {
      setEditingBranch(branch);
      setEditedName(branch.name);
      setIsEditModalOpen(true);
    }
  };

  // update 

const handleUpdateSubmit = async () => {
  if (!editingBranch) return;

  const user_id = user?.id;
  const companies_id = user?.companies_id;

  if (!user_id || !companies_id) {
    console.error("User or Company info missing!");
    return;
  }

  // ✅ Get token (adjust based on your storage)
  const token = localStorage.getItem("token"); // or from context

  if (!token) {
    console.error("Token missing!");
    return;
  }

  try {
    const res = await fetch("/api/category", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Add token here
      },
      body: JSON.stringify({
        id: editingBranch.id,
        name: editedName,
        user_id,
        companies_id,
      }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      fetchCategory();
      setIsEditModalOpen(false);
      setEditingBranch(null);
    } else {
      console.error("Update failed:", result.message);
    }
  } catch (err) {
    console.error("Error updating:", err);
  }
};



  // Delete category
const handleDelete = async (id: number) => {
  // ✅ Get token from localStorage (or wherever you store it)
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token missing!");
    return;
  }

  try {
    const res = await fetch("/api/category", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Token header
      },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      fetchCategory();
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
        <h1 className="text-2xl font-bold">Services Category</h1>
      </div>


      {!showAddBranch ? (
        <div>

          <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
            <h2 className="text-lg font-medium">List of Categories</h2>
            <button
              onClick={() => setShowAddBranch(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" /> Add New Category
            </button>
          </div>


          <div className="rounded-b-lg p-6 mb-6 border bg-[#1a1a1a] border-gray-800">
            <table className="w-full border border-gray-800">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 border border-gray-600">Category Name</th>
                  <th className="text-left py-4 px-6 border border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Category.map((branch) => (
                  <tr key={branch.id} className="border-b border-gray-800">
                    <td className="py-4 px-6 border-r border-gray-800">{branch.name}</td>
                    <td className="py-4 px-6 border-r border-gray-800">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(branch.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex gap-1 items-center"
                        >
                          <FiEdit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(branch.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex gap-1 items-center"
                        >
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
      ) : (
        // Add New Form
        <div>
          <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
            <h2 className="text-lg font-medium">Add New Category</h2>
            <button
              onClick={() => setShowAddBranch(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2"
            >
              <IoMdArrowBack className="w-4 h-4" /> Back to List
            </button>
          </div>

          <div className="rounded-b-lg p-6 border bg-[#1a1a1a] border-gray-800 text-white">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="flex justify-center pt-6 border-t border-gray-700">
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center text-gray-900">
            <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="flex justify-center gap-4 mt-4">
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
  );
}
