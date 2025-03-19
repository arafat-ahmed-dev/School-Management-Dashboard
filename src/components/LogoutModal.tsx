import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react";
import { signOut } from "next-auth/react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter(); // Initialize router
  const [loading, setLoading] = useState(false); // Initialize loading state

  const onConfirm = async () => {
    setLoading(true); // Set loading to true when logout starts
    try {
      await signOut();
      router.push("/login"); // Redirect to login page
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
          <DialogDescription className="mt-2 text-sm text-gray-600">
            Are you sure you want to log out? You will be redirected to the
            login page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
