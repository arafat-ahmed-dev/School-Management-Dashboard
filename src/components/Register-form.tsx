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
import { classNames, subjectData } from "@/lib/setting";

export function RegisterForm() {
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // State for error message

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"), // Merge first name and last name
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      userType: formData.get("role"), // Include role in the data object
      // Add additional fields based on role
      ...(role === "Student" && {
        class: formData.get("class"),
        parentContact: formData.get("parentContact"),
      }),
      ...(role === "Teacher" && {
        subjectsId: formData.getAll("subject").join(", "), // Correctly handle multiple subjects
      }),
      ...(role === "Parent" && {
        studentUsername: formData.get("studentUsername"), // Corrected typo
        class: formData.get("class"),
      }),
    };
    console.log(data);
    try {
      const response = await axios.post("/api/auth/register", data);
      console.log("Registration successful", response);
      setError(null); // Clear error message on success
      toast.success(
        "Your registration request has been accepted. You will be notified soon.",
      ); // Show success toast
    } catch (err) {
      const error = err as any; // Type assertion
      console.error("Registration error", error);
      setError(
        error.response?.data?.message ||
          "An error occurred during registration.",
      ); // Set error message
    }
  };

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="shadow-input mx-auto w-full max-w-md rounded-lg bg-white p-4 md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Register
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Enter your details below to register to your account
      </p>

      {error && <div className="my-4 text-sm text-red-500">{error}</div>}

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
        {role === "Student" && (
          <>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <LabelInputContainer className="mb-4">
                <Label htmlFor="class">Class</Label>
                <Select name="class">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classNames.map((className) => (
                      <SelectItem key={className.key} value={className.key}>
                        {className.label}
                      </SelectItem>
                    ))}
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
        {role === "Teacher" && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="subject">Subject</Label>
              <Select name="subject">
                <SelectTrigger>
                  <SelectValue placeholder="Select your Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectData.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LabelInputContainer>
          </>
        )}
        {role === "Parent" && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="class">Class</Label>
              <Select name="class">
                <SelectTrigger>
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  {classNames.map((className) => (
                    <SelectItem key={className.key} value={className.key}>
                      {className.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="studentUsername">Student Username</Label>
              <Input
                id="studentUsername"
                name="studentUsername"
                placeholder="Student Username"
                type="text"
              />
            </LabelInputContainer>
          </>
        )}
        <div className="flex flex-col space-y-4">
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
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
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
