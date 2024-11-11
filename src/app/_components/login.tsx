"use client";
import { signIn } from "next-auth/react";
// import { useState } from "react";
import { Input } from "@components/ui/input";
import { Label } from "~/components/ui/label";
import Image from "next/image";

export default function LogInPage() {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");

  //   const handleEmailSignIn = async () => {
  //     await signIn("credentials", { email, password });
  //   };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Welcome back!</h1>

        {/* Email and Password Fields */}
        {/* <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div> */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input type="email" id="email" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" />
        </div>
        <button
          // onClick={handleEmailSignIn}
          className="w-full rounded-md bg-blue-500 p-3 font-semibold text-white hover:bg-blue-600"
        >
          Log In
        </button>

        {/* Divider */}
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Sign-In Buttons */}
        <button
          onClick={() => signIn("google")}
          className="mb-2 flex w-full items-center justify-between rounded-md border p-3"
        >
          <span>Continue with Google</span>
          <Image src="/google-icon.webp" alt="Google" height={28} width={28} />
        </button>
        <button
          onClick={() => signIn("discord")}
          className="flex w-full items-center justify-between rounded-md border p-3"
        >
          <span>Continue with Discord</span>
          <Image src="/discord-icon.png" alt="Discord" height={28} width={28} />
        </button>
      </div>
    </div>
  );
}
