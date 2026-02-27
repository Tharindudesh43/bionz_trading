"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import MessageAuthModal from "@/components/MessageAuth";

export default function SignInPage() {
  // State for Login form
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // State for Register form
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");

  //Error message state for modals
  const [isAuthMessageModalOpen, setIsAuthMessageModalOpen] = useState(false);
  const [AuthMessage, setAuthMessage] = useState("");
  const [ispositive, setIsPositive] = useState(false);

  // Toggle between Login and Register
  const [isLogin, setIsLogin] = useState(true);

  async function EmailPasswordLogin(e: React.FormEvent<HTMLFormElement>) {
    setIsLoginLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        setAuthMessage(data.message);
        setIsPositive(false);
        setIsAuthMessageModalOpen(true);
        setIsLoginLoading(false);
        setLoginSuccess(null);
        setLoginError(data.message);
        return;
      } else {
        setAuthMessage(data.message);
        setIsAuthMessageModalOpen(true);
        setLoginSuccess(data.message);
        setLoginError(null);
        setIsLoginLoading(false);
        setIsPositive(true);
        window.location.href = "/";
      }
      console.log("Logged in with Admin SDK flow!");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setLoginError(
        axiosError.response?.data?.message || "An error occurred during login.",
      );
      console.error("Login error:", error);
      setIsAuthMessageModalOpen(true);
      setIsPositive(false);
      setAuthMessage("An error occurred during login. Please try again.");
    } finally {
      setIsLoginLoading(false);
    }
  }

  const EmailPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    try {
      const response = await axios.post(`/api/auth/sign-up`, {
        email: registerEmail,
        password: registerPassword,
        username: registerUsername,
      });
      if (response.status === 200) {
        setRegisterError(null);
        setAuthMessage("Registration successful! You can now log in.");
        setIsPositive(true);
        setIsAuthMessageModalOpen(true);
        setRegisterSuccess("Registration successful! You can now log in.");
      } else if (
        response.status === 400 &&
        response.data.message === "Email already in use"
      ) {
        setAuthMessage("Email already in use. Please try another email.");
        setIsPositive(false);
        setRegisterSuccess(null);
        setIsAuthMessageModalOpen(true);
        setRegisterError("Same email already in use. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      setAuthMessage(
        axiosError.response?.data?.message ||
          "An error occurred during registration. Please try again.",
      );
      setIsPositive(false);
      setIsAuthMessageModalOpen(true);
      setRegisterSuccess(null);
      setRegisterError(
        axiosError.response?.data?.message ||
          "An error occurred during registration. Please try again.",
      );
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-19 px-4 bg-gray-50 dark:bg-gray-900 min-h-fit">
      <div className="w-full max-w-5xl">
        {/* <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 m-4">
          My account
        </h1> */}

        {/* Disclaimer Box */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800 mb-8 mt-5">
          <p className="text-blue-800 dark:text-blue-200 text-xs">
            Dont invest unless youre prepared to lose all the money you invest.
            This is a high-risk investment and you are unlikely to be protected
            if something goes wrong.{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Take 2 minutes to learn more
            </Link>
          </p>
        </div>

        {/* --- TOGGLE HEADER --- */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative flex p-1.5 bg-gray-200/80 rounded-2xl w-72 h-12 items-center">
            <div
              className={`cursor-pointer absolute h-9 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out border border-black/5 ${
                isLogin ? "translate-x-0" : "translate-x-[100%]"
              }`}
            />
            <button
              onClick={() => {
                setIsLogin(true);
                setLoginEmail("");
                setLoginPassword("");
                setLoginError(null);
                setLoginSuccess(null);
              }}
              className={`cursor-pointer relative z-10 flex-1 text-sm font-semibold transition-colors duration-300 ${
                isLogin ? "text-black" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Log In
            </button>

            <button
              onClick={() => {
                setIsLogin(false);
                setRegisterEmail("");
                setRegisterPassword("");
                setRegisterError(null);
                setRegisterSuccess(null);
              }}
              className={`cursor-pointer relative z-10 flex-1 text-sm font-semibold transition-colors duration-300 ${
                !isLogin
                  ? "text-black"
                  : "cursor-pointer text-gray-500 hover:text-gray-700"
              }`}
            >
              Registration
            </button>
          </div>
          <div className="mt-4 text-gray-400 text-xs font-medium uppercase tracking-widest">
            {isLogin ? "Welcome Back" : "New Account"}
          </div>
        </div>

        {/* Login and Register Sections */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {isLogin ? (
            <>
              {/* Login Section */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Login
                </h2>
                <form onSubmit={EmailPasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="login-identifier"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <Input
                      id="login-identifier"
                      type="text"
                      placeholder=""
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoginLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="login-password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder=""
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoginLoading}
                    />
                  </div>

                  {loginError && (
                    <p className="text-red-500 text-sm">{loginError}</p>
                  )}

                  {loginSuccess && (
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {loginSuccess}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="cursor-pointer w-auto px-8  rounded-full bg-blue-950 text-white  hover:bg-blue-700 disabled:opacity-50"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "LOGGING IN..." : "LOG IN"}
                  </Button>
                  {/* <Link href="#" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2">
                Lost your password?
              </Link> */}
                </form>
              </div>
            </>
          ) : (
            <>
              {/* Register Section */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Registration
                </h2>

                {/* 1. Ensure your form is linked to the registration handler */}
                <form onSubmit={EmailPasswordSignUp} className="space-y-4">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="register-username"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Username
                    </label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder=""
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                      disabled={isRegisterLoading}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="register-email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder=""
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isRegisterLoading}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="register-password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder=""
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isRegisterLoading}
                    />
                  </div>

                  {/* Error and Success Messages */}
                  {registerError && (
                    <p className="text-red-500 text-sm">{registerError}</p>
                  )}
                  {registerSuccess && (
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {registerSuccess}
                    </p>
                  )}

                  {/* Privacy Policy Disclaimer */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your personal data will be used to support your experience
                    throughout this website, to manage access to your account,
                    and for other purposes described in our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      privacy policy
                    </Link>
                    .
                    {/* Removed: "A link to set a new password will be sent..." */}
                  </p>

                  <Button
                    type="submit"
                    className="cursor-pointer w-auto px-8 py-2 rounded-full bg-blue-950 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? "REGISTERING..." : "REGISTER"}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <MessageAuthModal
        ispositve={ispositive}
        isOpen={isAuthMessageModalOpen}
        message={AuthMessage}
        onClose={() => setIsAuthMessageModalOpen(false)}
      />
    </div>
  );
}
