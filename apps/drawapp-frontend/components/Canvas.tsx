import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";
import { IconButton } from "./IconButton";
import { Circle, RectangleHorizontalIcon } from "lucide-react";

export default function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
               if (canvasRef.current) {

                   initDraw(canvasRef.current, roomId, socket);
               }
           }, [canvasRef])
    return (
         <div className="w-screen h-screen overflow-hidden">
               <canvas
                   ref={canvasRef}
                   width={window.innerWidth}
                   height={window.innerHeight}
               />
               
               <TopBar />
               
         </div>
           
    )
}

function TopBar() {
    return <div className="fixed top-6 left-5 flex gap-2 p-2 rounded-lg">
        <IconButton icon={<RectangleHorizontalIcon />} onClick={() => {}}/>
        <IconButton icon={<Circle />} onClick={() => {}}/>
    </div>
}