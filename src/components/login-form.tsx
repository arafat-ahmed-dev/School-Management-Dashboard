"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils"; // Adjusted path
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "./ui/select"; // Import Select components
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter(); // Initialize the Next.js router
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting login
    const formData = new FormData(e.currentTarget);
    const data = {
      userType: formData.get("userType") as string, // Include userType in the data object
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
      userType: data.userType,
    });
    console.log(result);
    setLoading(false); // Set loading to false when login completes
    if (result?.error) {
      setError(result?.error);
      console.log(result?.error);
    } else {
      // Redirect to user's dashboard based on their role
      const userRole = data.userType.toLowerCase();
      router.push(`/${userRole}`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onChange={handleInputChange} // Add onChange handler
                />
              </div>
              {error && (
                <div className="mb-2 rounded border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900"
                type="submit"
                disabled={loading} // Disable button when loading
              >
                Login &larr;
              </button>
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
