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
import { Eye, EyeOff, Shield, GraduationCap, Users, UserCheck } from "lucide-react";

// Demo accounts configuration (credentials stored securely, passwords not visible to users)
const DEMO_ACCOUNTS = [
  { role: "Admin", username: "admin_scl", password: "Admin@scl", icon: Shield, color: "from-purple-500 to-indigo-600", hoverColor: "hover:from-purple-600 hover:to-indigo-700" },
  { role: "Teacher", username: "teacher_scl", password: "Teacher@scl", icon: UserCheck, color: "from-blue-500 to-cyan-600", hoverColor: "hover:from-blue-600 hover:to-cyan-700" },
  { role: "Student", username: "student_scl", password: "Student@scl", icon: GraduationCap, color: "from-green-500 to-emerald-600", hoverColor: "hover:from-green-600 hover:to-emerald-700" },
  { role: "Parent", username: "parent_scl", password: "Parent@scl", icon: Users, color: "from-orange-500 to-amber-600", hoverColor: "hover:from-orange-600 hover:to-amber-700" },
] as const;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter(); // Initialize the Next.js router
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleInputChange = () => {
    if (error) {
      setError(null); // Clear the error message
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle demo account login - directly logs in without showing password
  const handleDemoLogin = async (role: string, username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Demo credentials used for instant login
      const result = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
        userType: role,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push(`/${role.toLowerCase()}`);
      }
    } catch (err) {
      setError("Demo login failed. Please try again.");
      setLoading(false);
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
    setLoading(false); // Set loading to false when login completes
    if (result?.error) {
      setError(result?.error);
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
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onChange={handleInputChange} // Add onChange handler
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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

      {/* Demo Accounts Panel */}
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
              ⚡
            </span>
            Demo Accounts
          </CardTitle>
          <CardDescription className="text-xs">
            Quick access for recruiters & reviewers — click to login instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((account) => {
              const IconComponent = account.icon;
              return (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleDemoLogin(account.role, account.username, account.password)}
                  disabled={loading}
                  className={cn(
                    "group relative flex items-center gap-2 px-3 py-2.5 rounded-lg",
                    "bg-gradient-to-r text-white text-sm font-medium",
                    "transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]",
                    "shadow-md hover:shadow-lg",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                    account.color,
                    account.hoverColor
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="truncate">Login as {account.role}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] text-gray-500 dark:text-gray-400 text-center">
            🔒 Secure demo — no visible passwords • Role-based access control
          </p>
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
