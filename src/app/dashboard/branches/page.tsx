"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"
import { IoMdArrowBack } from "react-icons/io";
import Modal from "@/app/components/login-modal";
import { useUser } from "@/app/context/UserContext";

interface Branch {
  id: number
  name: string
}

export default function Page() {

  const [branches, setBranches] = useState<Branch[]>([]);



  const [showAddBranch, setShowAddBranch] = useState(false)

  const [name, setName] = useState("")
  const [modalType, setModalType] = useState<"success" | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const { user } = useUser();


  const handleEdit = (id: number) => {
    const branch = branches.find((b) => b.id === id);
    if (branch) {
      setEditingBranch(branch);
      setEditedName(branch.name);
      setIsEditModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setShowAddBranch(true)
  }

  const handleBack = () => {
    setShowAddBranch(false)
  }


  // show all branch

const fetchCategory = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/branches", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

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
    fetchCategory();
  }
}, [user?.companies_id ]);



  // save barnch in database 

const handleSubmit = async () => {
  
  const newErrors: { name?: string } = {};

  if (!name.trim()) {
    newErrors.name = "Name is required";
    setErrors(newErrors);
    return;
  }

  setErrors({});
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }), // user_id and companies_id now come from token on backend
    });

    const data = await res.json();

    if (res.ok) {
      setName("");
      setModalMessage("Branch added successfully!");
      setModalType("success");
      fetchCategory();
      setShowAddBranch(false);
    } else {
      if (data.message?.toLowerCase().includes("branch already exists")) {
        setModalMessage("Branch already exists");
        setModalType("success");
      }
    }
  } catch (err) {
    console.error("Branch error:", err);
    setModalMessage("Something went wrong");
    setModalType("success");
  }
};



  // barnch delet code 


const handleDelete = async (id: number) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/branches", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setBranches(branches.filter((branch) => branch.id !== id));
    } else {
      console.error("Failed to delete branch:", result.message);
    }
  } catch (err) {
    console.error("Error deleting branch:", err);
  }
};




  // update submit

const handleUpdateSubmit = async () => {
  if (!editingBranch) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/branches", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: editingBranch.id,
        name: editedName,
      }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranch.id ? { ...b, name: editedName } : b
        )
      );
      setIsEditModalOpen(false);
      setEditingBranch(null);
    } else {
      console.error("Update failed:", result.message);
    }
  } catch (err) {
    console.error("Error updating branch:", err);
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

      {/* Header */}
      <div className="rounded-lg p-6 border bg-[#1a1a1a] border-gray-800 mb-6">
        <h1 className="text-2xl font-bold">Branch</h1>
      </div>


      {!showAddBranch ? (

        <div>
          <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
            <h2 className="text-lg font-medium">List Of Your Approved Branch</h2>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Add New Branch
            </button>
          </div>

          <div className="rounded-b-lg p-6 mb-6 border bg-[#1a1a1a] border-gray-800">
            <div className="overflow-hidden">
              <table className="w-full border border-gray-800">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold border border-gray-600">Branch Name</th>
                    <th className="text-left py-4 px-6 font-semibold border border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.id} className="border-b border-gray-800">
                      <td className="border-r border-gray-800 py-4 px-6">{branch.name}</td>
                      <td className="border-r border-gray-800 py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(branch.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                          >
                            <FiEdit2 className="w-3 h-3" />
                            <span>  Edit </span>
                          </button>
                          <button
                            onClick={() => handleDelete(branch.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                          >
                            <FiTrash2 className="w-3 h-3" />
                            <span>  Delete </span>
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
            <h2 className="text-lg font-medium">Add Of Your Approved Branch</h2>
            <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer"
            >
              <IoMdArrowBack className="w-4 h-4" />
              Back to List
            </button>
          </div>

          <div className="rounded-b-lg p-6 border bg-[#1a1a1a] border-gray-800 text-white">

            <div>
              <label className="block text-sm font-medium mb-2">

                First Name <span className="text-red-500">*</span>
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
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}


      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center text-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Branch</h2>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-auto px-10 py-1 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6 font-semibold cursor-pointer" style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px rgba(255, 165, 0, 0.5)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="w-auto px-10 py-1 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6 font-semibold cursor-pointer" style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px rgba(255, 165, 0, 0.5)" }}
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
