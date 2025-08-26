"use client";

import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import Modal from "@/app/components/login-modal";
import { useUser } from "@/app/context/UserContext";


interface Service {
  id: number;
  name: string;
  price: string;
  branch_name: string;
  category_name: string;
}

export default function Page() {
  const [Category, setCategory] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Service[]>([]);
  const [modalType, setModalType] = useState<"success" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const [services, setServices] = useState<Service[]>([]);

  const [showAddBranch, setShowAddBranch] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState<{

    name?: string;
    price?: string;
    branch?: string;
    category?: string;
  }>({});

  const { user } = useUser();


  //  console.log("User info hsgdfsdh:", user);


  // category api use 

const fetchCategory = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/category", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        companies_id: user?.companies_id?.toString() || "",  
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

      // console.log("result.data", result);

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



  useEffect(() => {
    fetchCategory();
    fetchBranches();
  }, []);



  const validateForm = () => {
    const newErrors: {
      name?: string;
      price?: string;
      branch?: string;
      category?: string;
    } = {};

    if (!name.trim()) newErrors.name = "Service name is required";
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = "Valid price is required";
    if (!selectedBranch) newErrors.branch = "Branch is required";
    if (!selectedCategory) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!validateForm()) return;

    try {
      const response = await fetch("/api/all-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price,
          branch_id: selectedBranch,
          category_id: selectedCategory,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setModalMessage("Service added successfully!");
        setModalType("success");

        const branchName = branches.find(b => b.id.toString() === selectedBranch)?.name || "";
        const categoryName = Category.find(c => c.id.toString() === selectedCategory)?.name || "";

        setServices(prev => [
          ...prev,
          {
            id: result.insertId || Date.now(),
            name,
            price,
            branch_name: branchName,
            category_name: categoryName,
          },
        ]);

        setName("");
        setPrice("");
        setSelectedBranch("");
        setSelectedCategory("");
        setShowAddBranch(false);
      } else {
        setModalMessage(result.message || "Something went wrong");
        setModalType("success");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalMessage("Something went wrong");
      setModalType("success");
    }
  };



  // ************************** get all services ********************************


  const fetchServices = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/all-services", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success && Array.isArray(result.data)) {
        setServices(result.data);
      } else {
        console.error("Unexpected data format", result);
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching Services:", err);
      setServices([]);
    }
  };



  useEffect(() => {
    if (!user?.companies_id) return;

    fetchCategory();
    fetchBranches();
    fetchServices();
  }, [user?.companies_id]); // ensures stable array length




  // ************************** delete services ********************************



  const handleDeleteService = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/all-services", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setServices(prev => prev.filter(service => service.id !== id));
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
        <h1 className="text-2xl font-bold">All Services</h1>
      </div>


      {!showAddBranch ? (
        <div>

          <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
            <h2 className="text-lg font-medium">List of Services</h2>
            <button
              onClick={() => setShowAddBranch(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" /> Add New Services
            </button>
          </div>

          <div className="grid grid-cols-12 gap-3  rounded-b-lg p-6 mb-6 border bg-[#1a1a1a] border-gray-800 ">

            {
              services.map((service) => (

                <div key={service.id} className="col-span-4 w-full max-w-sm shadow-lg">
                  <div className="bg-blue-500 h-4 rounded-t-lg p-0 " />
                  <div className="p-6 space-y-4  border border-[#3a3a3a] rounded-b-lg bg-[#1e1e1e] text-[white]">
                    <div className="flex items-center gap-3 justify-center mb-6">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <span className="text-xs ">👤</span>
                      </div>
                      <span className="text-xl font-semibold ">{service.name}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="">Branch -</span>
                        <span className="text-blue-500 font-medium">{service.branch_name}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className=" font-medium">Category</span>
                        <span className="">{service.category_name}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className=" font-medium">Price</span>
                        <span className=" font-semibold">{service.price}</span>
                      </div>
                    </div>

                    <button onClick={() => handleDeleteService(service.id)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium w-full cursor-pointer">Delete</button>
                  </div>
                </div>

              ))
            }



          </div>

        </div>
      ) : (


        //  Add New Form
        <div>
          <div className="bg-black text-white rounded-t-lg px-6 py-3 border border-[#3a3a3a] flex justify-between items-center">
            <h2 className="text-lg font-medium">Add New Service</h2>
            <button
              onClick={() => setShowAddBranch(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2"
            >
              <IoMdArrowBack className="w-4 h-4" /> Back to List
            </button>
          </div>

          <div className="rounded-b-lg p-6 border bg-[#1a1a1a] border-gray-800 text-white">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">
                Branch Name <span className="text-red-500">*</span>
              </label>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-3 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}

            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {Category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}


            </div>


            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">
                Price  (MXN) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}

            </div>


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
  );
}
