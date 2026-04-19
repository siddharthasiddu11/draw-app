"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function CreateRoom() {
    const router = useRouter();
    const roomRef = useRef<HTMLInputElement>(null);
    
    async function createRoom() {
        const token = localStorage.getItem("token");
        const name = roomRef.current?.value;
        try {
            const response = await axios.post(`${HTTP_BACKEND}/room`, 
                { name }, 
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            }
            )
            console.log(response.headers)
            const roomId = response.data.roomId;
            toast.success("Room created successfully");
            router.push('/canvas/'+roomId);

        } catch (error) {
            console.log(error);
            toast.error("Failed to create room");
        }
        
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
                        <span className="text-3xl font-bold">CreateRoom</span>

                    </div>
                </div>

            <div className="space-y-5">
             <div>
               <label  className="block text-sm text-gray-400 mb-2">
                 Room Name
               </label>
               <input
                 ref={roomRef}
                 type="text"
                 placeholder="Room Name"
                 className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white placeholder-gray-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
               />
             </div>
             

             
             <div className="flex justify-center">
               <h1 className="text-sm text-gray-400">Already have a room?</h1>
               <a href="/join-room" className="text-gray-400 text-sm underline hover:text-white transition">Join Room</a>
             </div>

             <button onClick={createRoom} type="submit" className="w-full py-3 rounded-lg bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium hover:opacity-90 transition" > Create Room </button>
            </div>
            </div>
        </div> 
    )
}