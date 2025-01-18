"use client";
import { login, logout } from "@/lib/store/features/Auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks/index";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogin = () => {
    dispatch(login({ id: 1, name: "John Doe", email: "john@example.com" }));
  };

  const handleLogout = async () => {
    const response = await axios.post("/api/auth/logout");
    console.log("Logout successful:", response);
    dispatch(logout());
    router.push("/");
    return response;
  };

  return (
    <div className="">
      <button className="bg-red-500 p-4 text-white" onClick={handleLogin}>
        Login
      </button>
      <button className="bg-red-400 p-4 text-white mx-3" onClick={handleLogout}>
        Logout
      </button>
      <h1>Profile Page</h1>
      {/* <p>User ID: {userId}</p>
      <p>User Type: {userType}</p> */}
    </div>
  );
};

export default ProfilePage;
