
import Link from "next/link";

export default function Header() {
    return (
        <header className="fixed border-b border-neutral-800 top-0 w-full bg-black ">
        <nav className="mx-auto px-4 h-16 flex items-center justify-between">
           
              <div className="flex flex-col items-center ">
                    <div className="text-2xl font-semibold text-white flex items-center gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-b from-gray-200 to-gray-400 text-transparent bg-clip-text">Wire<span className="text-3xl font-bold bg-gradient-to-b from-gray-500 to-blue-900 text-transparent bg-clip-text">Sketch</span></span>
                    </div>
              </div>

              <div>
                <Link href={"/signup"}>
                <button  type="submit" className="w-full py-2 px-2 rounded-lg bg-gradient-to-b from-gray-700 to-blue-900 text-white font-medium hover:opacity-90 transition" > Sign up </button>
                </Link>
              </div>
        </nav>
      </header>
    ) 
}