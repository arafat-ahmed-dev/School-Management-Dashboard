"use client"
import { login } from "@/lib/store/features/Auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(login({ id: 1, name: "John Doe", email: "john@example.com" }));
  };

  return (
    <div className=''>
      <button className="bg-red-100 p-4" onClick={handleLogin}>Login</button>
      ProfilePage
    </div>
  );
}

export default ProfilePage;
