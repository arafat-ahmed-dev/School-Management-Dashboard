"use client";
import { LoginForm } from "@/components/login-form"

const LoginPage = () => {
  const handleLogin = (data: any) => {
    console.log("Login data received in parent:", data);
    // Handle login data here
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
