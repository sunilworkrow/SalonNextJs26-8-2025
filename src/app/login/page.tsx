"use client"

import { useState } from "react"
import { CiLock, CiMail, CiUser } from "react-icons/ci"
import Link from "next/link"
import { useRouter } from 'next/navigation';


export default function page() {



  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true)
    setMessage("")



    try {

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });


      const data = await res.json();

      if (data.success) {


        localStorage.setItem('token', data.token);

        setMessage("User Login successfully")

        router.push('/dashboard');

      } else {
        alert(data.message);
      }


    } catch (err) {
      setMessage("Something went wrong")
    }


    setLoading(false)



  }





  return (
    <div className="min-h-screen flex flex-row-reverse">

      <div className="flex-1 flex items-center justify-center bg-gray-50 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full -translate-x-16 -translate-y-16"></div>

        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Login</h2>

          <div className="space-y-6">


            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <CiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Input your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 border-l-4 border-l-blue-500 rounded-lg w-full bg-[aliceblue]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <CiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Input your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-12 border-l-4 border-l-blue-500 rounded-lg w-full bg-[aliceblue]"
              />
            </div>

            

            {/* Signup Button */}
            <button
              onClick={handleSubmit}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              {loading ? "Processing..." : "LOGIN"}
            </button>

            {/* Message */}
            {message && (
              <div className="text-center mt-4 text-sm text-gray-700">{message}</div>
            )}
<div className="text-center text-blue-600  ">
            <Link href="/forgot-password">
              <button className="underline cursor-pointer">
                Forgot password
              </button>
            </Link>
            </div>
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
          <Link href="/signup">
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold cursor-pointer">
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
