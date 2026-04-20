"use client"
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
    return (
        <div>
        <section className='w-full pt-36 md:pt-48 pb-10 '>
        <div className="space-y-6 text-center">
          <div className="space-y-6 mx-auto">
            < h1 className="text-5xl font-extrabold md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tighter ">
                <span className=" bg-gradient-to-b from-gray-200 to-gray-500 text-transparent bg-clip-text">Draw. Collaborate. Create.</span> <br /> <span className=" bg-gradient-to-b from-gray-400 to-blue-900 text-transparent bg-clip-text">Instantly.</span>
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">Draw, collaborate, and ideate with your team in real-time. A fast, minimal whiteboard for brainstorming, planning, and building ideas together.</p>
          </div>
        </div> 
      </section>
      <section>
        <div className="flex justify-center space-y-6">
          <div className="flex gap-2 space-x-2">
            
            <button onClick={() => router.push("https://github.com/siddharthasiddu11/draw-app") } type="submit" className="w-full px-4 py-2 rounded-lg bg-gradient-to-b from-gray-400 to-blue-900 text-white font-medium hover:opacity-80 transition" >WatchDemo</button>
            <button onClick={() => router.push("/join-room") } type="submit" className="w-full px-2 py-1 rounded-lg text-gray-400 border border-gray-400 hover:bg-gray-800 hover:text-white transition" > Join Room </button>
          </div>
        </div> 
      </section>
    </div>
    ) }