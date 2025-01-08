"use client";
import { RegisterForm } from "@/components/Register-form"

const RegisterPage = () => {
  const handleRegister = (data: any) => {
    console.log("Registration data received in parent:", data);
    // Handle registration data here
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm onRegister={handleRegister} />
      </div>
    </div>
  );
};

export default RegisterPage;