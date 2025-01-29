"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils"; // Adjusted path
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "./ui/select"; // Import Select components
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/lib/store/features/Auth/authSlice";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter(); // Initialize the Next.js router
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const dispatch = useDispatch();
  interface Data {
    username: string;
    password: string;
    userType: string;
  }
  enum Role {
    Admin = "Admin",
    Parent = "Parent",
    Teacher = "Teacher",
    Student = "Student",
  }
  const handleLogin = async (data: Data) => {
    setLoading(true); // Set loading to true when login starts
    try {
      const response = await axios.post("/api/auth/login", data);
      console.log("Login successful:", response.data);
      // Handle successful login (e.g., store user data, redirect, etc.)
      const validRoles = ["Admin", "Parent", "Teacher", "Student"];
      const role: Role = response.data.userRole as Role;
      if (validRoles.includes(role)) {
        // Store user data (e.g., in Redux state)
        dispatch(login(response.data));
        const roleLowerCase = role.toLowerCase();
        router.push(`/${roleLowerCase}`); // Redirect to the appropriate dashboard
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message ||
          "Login failed. Please check your credentials."; // Access message safely
        console.error("Response data:", err.response.data); // Log response data for debugging
        setError(errorMessage); // Set error message from response
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Set loading to false when login ends
    }
  };

  const handleInputChange = () => {
    if (error) {
      setError(null); // Clear the error message
    }
  };
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4; // Adjust speed (1 = normal, 2 = 2x faster)
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      userType: formData.get("userType") as string, // Include userType in the data object
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    console.log("Form submitted--------->", data);
    handleLogin(data); // Call handleLogin with the gathered data
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <video ref={videoRef} autoPlay loop muted width={100} height={100}>
            <source src="/loading.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <LabelInputContainer>
                <Label htmlFor="userType">Role</Label>
                <Select name="userType" onValueChange={handleInputChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </LabelInputContainer>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="username"
                  placeholder="username"
                  required
                  onChange={handleInputChange} // Add onChange handler
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forget-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={handleInputChange} // Add onChange handler
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}{" "}
              {/* Display error message */}
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                type="submit"
                disabled={loading} // Disable button when loading
              >
                Login &larr;
              </button>
              <Button variant="outline" className="w-full" disabled={loading}>
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
