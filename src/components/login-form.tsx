"use client";
import React, { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";

// Demo credentials shown for recruiters and reviewers.
const DEMO_ACCOUNTS = [
  { role: "Admin", username: "admin_scl", password: "Admin@scl" },
  { role: "Teacher", username: "teacher_scl", password: "Teacher@scl" },
  { role: "Student", username: "student_scl", password: "Student@scl" },
  { role: "Parent", username: "parent_scl", password: "Parent@scl" },
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-6 py-5 shadow-2xl backdrop-blur dark:bg-zinc-900/95">
            <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Signing in...
            </p>
          </div>
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

      {/* Demo credentials */}
      <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-600 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            Demo Credentials
          </CardTitle>
          <CardDescription className="text-xs">
            Use one of these accounts to sign in as a demo user
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.role}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {account.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Username: <span className="font-mono font-bold text-black">{account.username}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Password: <span className="font-mono font-bold text-black">{account.password}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-gray-500 dark:text-gray-400 text-center">
            Demo credentials are provided for testing role-based access control
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
