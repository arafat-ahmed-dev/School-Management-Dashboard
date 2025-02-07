import { login } from "@/lib/store/features/Auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  // Define the properties of the user object based on your application's requirements
  id: string;
  name: string;
  email: string;
}

const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSessionData = async () => {
      const sessionData = sessionStorage.getItem("userData");

      if (!sessionData) {
        try {
          const res = await axios.get("/api/auth/refresh", {
            withCredentials: true,
          });
          console.log(res.data);
          if (res.status === 200) {
            const data = res.data;
            sessionStorage.setItem("userData", JSON.stringify(data.user)); // Store user data
            setUser(data.user);
            console.log(data);
          }
          // save session data by redux
          dispatch(login(res.data));
        } catch (error) {
          console.error("Session refresh failed", error);
        }
      } else {
        setUser(JSON.parse(sessionData));
      }
      setLoading(false);
    };

    fetchSessionData();
  },[]);

  return { user, loading };
};

export default useAuthSession;
