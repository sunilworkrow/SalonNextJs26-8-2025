"use client"

import { useState } from "react"
import { CiLock, CiMail, CiUser } from "react-icons/ci"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Modal from "../components/signup-modal"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"success" | "warning" | null>(null)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("User registered successfully")
        setName("")
        setEmail("")
        setPassword("")
        setErrors({})
        setModalType("success")
        setShowModal(true)
      } else {
        if (data.message && data.message.toLowerCase().includes("email already exists")) {
          setMessage(data.message)
          setModalType("warning")
          setShowModal(true)
        }
      }
    } catch (err) {
      console.error("Signup error:", err)
    }

    setLoading(false)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleModalContinue = () => {
    setShowModal(false)
    if (modalType === "success" || modalType === "warning") {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full -translate-x-16 -translate-y-16"></div>

        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Sign Up</h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <CiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`focus:outline-none pl-12 h-12 rounded-lg w-full bg-[aliceblue] border-l-4 ${
                    errors.name ? "border-l-red-500" : "border-l-green-500"
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-2 pl-2">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <CiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Input your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`focus:outline-none pl-12 h-12 rounded-lg w-full bg-[aliceblue] border-l-4 ${
                    errors.email ? "border-l-red-500" : "border-l-blue-500"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-2 pl-2">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <CiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Input your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`focus:outline-none pl-12 h-12 rounded-lg w-full bg-[aliceblue] border-l-4 ${
                    errors.password ? "border-l-red-500" : "border-l-[#ff0000]"
                  }`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2 pl-2">{errors.password}</p>}
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              {loading ? "Processing..." : "SIGN UP"}
            </button>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/30 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-blue-400/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-600 to-pink-500 rounded-full translate-x-20 translate-y-20"></div>

        <div className="text-center text-white z-10">
          <h1 className="text-4xl font-bold mb-4">WELCOME!</h1>
          <p className="text-lg mb-8 opacity-90">Enter your details and start your journey with us</p>
          <Link href="/login">
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold cursor-pointer">
              LOG IN
            </button>
          </Link>
        </div>



      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          modalType={modalType}
          message={message}
          errors={errors}
          onClose={handleModalClose}
          onContinue={handleModalContinue}
        />
      )}
    </div>
  )
}
