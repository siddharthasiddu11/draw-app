"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div>
        <input className="pt-10 border" value={roomId} onChange={(e)=> {
          setRoomId(e.target.value)
        }} type="text" placeholder="Join room" />
        <button className="p-10 border rounded bg-white cursor-pointer text-black " onClick={()=> {
           router.push(`/room/${roomId}`)
        }}>Join room</button>
      </div> 
    </div>
  );
}
