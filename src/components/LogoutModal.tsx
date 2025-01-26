"use client"
import React from "react";
import axios from "axios"; // Import axios
import { useAppDispatch } from "@/lib/store/hooks"; // Import useAppDispatch
import { logout } from "@/lib/store/features/Auth/authSlice"; // Import logout action
import { useRouter } from "next/navigation"; // Import useRouter

interface LogoutModalProps {
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onCancel }) => {
  const dispatch = useAppDispatch(); // Initialize dispatch
  const router = useRouter(); // Initialize router

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      console.log("Logout successful:", response);
      dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
