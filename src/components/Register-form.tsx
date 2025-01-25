"use client";
import React, { useState } from "react";
import axios from "axios"; // Import axios
import { toast } from "sonner";
import { cn } from "../lib/utils"; // Adjusted path
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "./ui/select"; // Import Select components
import Link from "next/link";
import { Button } from "./ui/button";

export function RegisterForm({
}) {
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // State for error message

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"), // Merge first name and last name
      username : formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      userType: formData.get("role"), // Include role in the data object
      // Add additional fields based on role
      ...(role === "student" && {
        class: formData.get("class"),
        parentContact: formData.get("parentContact"),
      }),
      ...(role === "teacher" && {
        subject: formData.get("subject"),
      }),
      ...(role === "parent" && {
        studentName: formData.get("studentName"),
        class: formData.get("class"),
      }),
    };
    try {
      const response = await axios.post("/api/auth/register", data);
      console.log("Registration successful", response);
      setError(null); // Clear error message on success
      toast.success("Your registration request has been accepted. You will be notified soon."); // Show success toast
    } catch (err) {
      const error = err as any; // Type assertion
      console.error("Registration error", error);
      setError(error.response?.data?.message || "An error occurred during registration."); // Set error message
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-lg p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Register
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Enter your details below to register to your account
      </p>

      {error && (
        <div className="text-red-500 text-sm my-4">
          {error}
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="role">Role</Label>
          <Select name="role" onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
            </SelectContent>
          </Select>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Full Name" type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="username"
            type="username"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        {/* Conditional Fields */}
        {role === "student" && (
          <>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer className="mb-4">
                <Label htmlFor="class">Class</Label>
                <Select name="class">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class7">Class 7</SelectItem>
                    <SelectItem value="class8">Class 8</SelectItem>
                    <SelectItem value="class9-sci">Class 9-sci</SelectItem>
                    <SelectItem value="class9-art">Class 9-art</SelectItem>
                    <SelectItem value="class9-com">Class 9-com</SelectItem>
                    <SelectItem value="class10-sci">Class 10-sci</SelectItem>
                    <SelectItem value="class10-art">Class 10-art</SelectItem>
                    <SelectItem value="class10-com">Class 10-com</SelectItem>
                    <SelectItem value="class11-sci">Class 11-sci</SelectItem>
                    <SelectItem value="class11-art">Class 11-art</SelectItem>
                    <SelectItem value="class11-com">Class 11-com</SelectItem>
                    <SelectItem value="class12-sci">Class 12-sci</SelectItem>
                    <SelectItem value="class12-art">Class 12-art</SelectItem>
                    <SelectItem value="class12-com">Class 12-com</SelectItem>
                  </SelectContent>
                </Select>
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="parentContact">Parent&apos;s Contact</Label>
              <Input
                id="parentContact"
                name="parentContact"
                placeholder="Parent's contact number"
                type="text"
              />
            </LabelInputContainer>
          </>
        )}
        {role === "teacher" && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Subject taught"
                type="text"
              />
            </LabelInputContainer>
          </>
        )}
        {role === "parent" && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="class">Class</Label>
              <Select name="class">
                <SelectTrigger>
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class7">Class 7</SelectItem>
                  <SelectItem value="class8">Class 8</SelectItem>
                  <SelectItem value="class9-sci">Class 9-sci</SelectItem>
                  <SelectItem value="class9-art">Class 9-art</SelectItem>
                  <SelectItem value="class9-com">Class 9-com</SelectItem>
                  <SelectItem value="class10-sci">Class 10-sci</SelectItem>
                  <SelectItem value="class10-art">Class 10-art</SelectItem>
                  <SelectItem value="class10-com">Class 10-com</SelectItem>
                  <SelectItem value="class11-sci">Class 11-sci</SelectItem>
                  <SelectItem value="class11-art">Class 11-art</SelectItem>
                  <SelectItem value="class11-com">Class 11-com</SelectItem>
                  <SelectItem value="class12-sci">Class 12-sci</SelectItem>
                  <SelectItem value="class12-art">Class 12-art</SelectItem>
                  <SelectItem value="class12-com">Class 12-com</SelectItem>
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                name="studentName"
                placeholder="Student Name"
                type="text"
              />
            </LabelInputContainer>
          </>
        )}
        <div className="flex flex-col space-y-4">
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login here
        </Link>
      </p>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

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
