"use client";
import { login, logout } from "@/lib/store/features/Auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(login({ id: 1, name: "John Doe", email: "john@example.com" }));
  };
  const handleLogout = () => {
    // Handle logout logic here
    // Example: clear user data from local storage
   dispatch(logout())
  };

  return (
    <div className="">
      <button className="bg-red-500 p-4 text-white" onClick={handleLogin}>
        Login
      </button>
      <button className="bg-red-400 p-4 text-white mx-3" onClick={handleLogout}>
        Logout
      </button>
      ProfilePage
    </div>
  );
};

export default ProfilePage;
