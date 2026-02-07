'use client'; 

import React, { useState } from "react";
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function SignInPage() {
  // State for Login form
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // State for Register form
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');

  const router = useRouter();
  

  async function EmailPasswordLogin(e: React.FormEvent<HTMLFormElement>) {
  setIsLoginLoading(true);
  e.preventDefault();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: loginEmail, password: loginPassword }),
  });

  const data = await res.json();

  if (!data.success) {
    setLoginError(data.message);
    setIsLoginLoading(false);
    return;
  }else {
    setLoginError(data.message);
    setIsLoginLoading(false);
  }

  console.log("Logged in with Admin SDK flow!");
}
  

  const EmailPasswordSignUp =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    try{
     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/sign-up`,
        {
          email: registerEmail,
          password: registerPassword,
          username: registerUsername,
        }
      );
      if(response.status === 200){
        console.log('Registration successful:', response.data);
        setRegisterError(null);
        setRegisterSuccess('Registration successful! You can now log in.');
        router.push("/");
      }else if(response.status === 400 && response.data.message === 'Email already in use'){
        setRegisterError('Same email already in use. Please try again.');
      }
    }catch(error){
      console.error('Registration error:', error);
    }finally{
      setIsRegisterLoading(false);
    }
  }

 return (
    <div className="flex flex-col items-center py-19 px-4 bg-gray-50 dark:bg-gray-900 min-h-fit">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 m-4">My account</h1>

        {/* Disclaimer Box */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800 mb-8">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Dont invest unless youre prepared to lose all the money you invest. This is a high-risk investment and you are unlikely to be protected if something goes wrong. <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Take 2 minutes to learn more</Link>
          </p>
        </div>

        {/* Login and Register Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Section */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Login</h2>
            <form onSubmit={EmailPasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-identifier" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address *
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
                <label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password *
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

              <Button
                type="submit"
                className="w-auto px-8 py-2 rounded-full bg-blue-950 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? 'LOGGING IN...' : 'LOG IN'}
              </Button>
              {/* <Link href="#" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2">
                Lost your password?
              </Link> */}
            </form>
          </div>

          {/* Register Section */}
          {/* Register Section (Updated) */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Register</h2>
            
            {/* 1. Ensure your form is linked to the registration handler */}
            <form onSubmit={EmailPasswordSignUp} className="space-y-4">
              
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="register-username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username *
                </label>
                <Input
                  id="register-username"
                  type="text"
                  placeholder=""
                  // ⚠️ ASSUMES state variable: registerUsername
                  value={registerUsername} 
                  // ⚠️ ASSUMES state setter: setRegisterUsername
                  onChange={(e) => setRegisterUsername(e.target.value)} 
                  required
                  disabled={isRegisterLoading}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address *
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
                <label htmlFor="register-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password *
                </label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder=""
                  // ⚠️ ASSUMES state variable: registerPassword
                  value={registerPassword} 
                  // ⚠️ ASSUMES state setter: setRegisterPassword
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
                <p className="text-green-600 dark:text-green-400 text-sm">{registerSuccess}</p>
              )}

              {/* Privacy Policy Disclaimer */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">privacy policy</Link>.
                {/* Removed: "A link to set a new password will be sent..." */}
              </p>

              <Button
                type="submit"
                className="w-auto px-8 py-2 rounded-full bg-blue-950 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? 'REGISTERING...' : 'REGISTER'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
