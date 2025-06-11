"use client"

import { CiWarning } from "react-icons/ci"
import { MdCancel } from "react-icons/md"
import { FaCheck } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { IoIosWarning } from "react-icons/io";

type ModalProps = {
  modalType: "success" | "error" | "warning" | null
  message: string
  errors: { name?: string; email?: string; password?: string }
  onClose: () => void
  onContinue?: () => void
}

export default function Modal({ modalType, message, errors, onClose, onContinue }: ModalProps) {
  const router = useRouter()

  const handleContinue = () => {
    if (onContinue) onContinue()
  }

  const ModalContent = () => {
    if (modalType === "success") {
      return (
        <>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-white text-[35px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Subscribed successfully!</h1>
          <p className="text-gray-600 leading-relaxed">
            Thanks for subscribing! Get ready for exciting updates, offers, and insider insights straight to your inbox.
          </p>
          <button
            onClick={handleContinue}
            className="w-auto px-10 py-1 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6"
            style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px red" }}
          >
            Continue
          </button>
        </>
      )
    } else if (modalType === "error") {
      return (
        <>
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdCancel className="text-white text-[35px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error!</h1>
          <div className="text-left text-red-600 mb-4">
            {errors.name && <p>- {errors.name}</p>}
            {errors.email && <p>- {errors.email}</p>}
            {errors.password && <p>- {errors.password}</p>}
          </div>
          <p className="text-gray-600 leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="w-auto px-10 py-1 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6"
            style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px red" }}
          >
            Close
          </button>
        </>
      )
    } else if (modalType === "warning") {
      return (
        <>
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CiWarning className="text-white text-[35px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Warning!</h1>
          <p className="text-gray-600 leading-relaxed mb-4">{message}</p>
          <button
            onClick={handleContinue}
            className="w-auto px-10 py-1 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300"
            style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px red" }}
          >
            Go to Login
          </button>
        </>
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <ModalContent />
      </div>
    </div>
  )
}
