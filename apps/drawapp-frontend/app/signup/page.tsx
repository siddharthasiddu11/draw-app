"use client"

import { useRef } from "react";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const usernameRef = useRef<HTMLInputElement>(null);
    console.log(usernameRef.current?.value);
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    async function signup() {
        await axios.post(`${HTTP_BACKEND}/signup`, {
            username: emailRef.current?.value,
            password: passwordRef.current?.value,
            name: usernameRef.current?.value
        });
        router.push("/signin");
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-6 border border-dashed border-neutral-800 rounded-xl"></div>
                <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-neutral-800"></div>
                <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-neutral-800"></div>
            </div>

            <div className="relative w-full max-w-md p-8 rounded-2xl bg-neutral-900 shadow-xl border border-neutral-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="text-2xl font-semibold text-white flex items-center gap-2">
                        <span className="text-3xl font-bold">Wire<span className="text-3xl font-bold bg-gradient-to-b from-gray-500 to-gray-900 text-transparent bg-clip-text">Frame</span></span>
                    </div>
                </div>

            <div className="space-y-5">
             <div>
               <label  className="block text-sm text-gray-400 mb-2">
                 Email
               </label>
               <input
                 ref={emailRef}
                 type="email"
                 placeholder="you@example.com"
                 className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white placeholder-gray-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
               />
             </div>
             <div>
               <label  className="block text-sm text-gray-400 mb-2">
                 Username
               </label>
               <input
                 ref={usernameRef}
                 type="text"
                 placeholder="username"
                 className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white placeholder-gray-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
               />
             </div>

             <div>
               <label className="block text-sm text-gray-400 mb-2">
                 Password
               </label>
               <input
                 ref={passwordRef}
                 type="password"
                 placeholder="••••••••"
                 className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white placeholder-gray-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
               />
             </div>
             <div className="flex justify-center">
               <h1 className="text-sm text-gray-400">Already a user?</h1>
               <a href="/signin" className="text-gray-400 text-sm underline hover:text-white transition">Sign in</a>
             </div>

             <button onClick={signup} type="submit" className="w-full py-3 rounded-lg bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium hover:opacity-90 transition" > Sign up </button>
            </div>
            </div>
        </div>
    )
}