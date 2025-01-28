import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios"; // Import axios
import { useAppDispatch } from "@/lib/store/hooks"; // Import useAppDispatch
import { logout } from "@/lib/store/features/Auth/authSlice"; // Import logout action
import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react"; // Import useState

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const dispatch = useAppDispatch(); // Initialize dispatch
  const router = useRouter(); // Initialize router
  const [loading, setLoading] = useState(false); // Initialize loading state

  const onConfirm = async () => {
    setLoading(true); // Set loading to true when logout starts
    try {
      const response = await axios.post("/api/auth/logout");
      console.log("Logout successful:", response);
      dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false); // Set loading to false when logout ends
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-md">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Are you sure you want to log out? You will be redirected to the
            login page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Logging out..." : "Logout"} 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
