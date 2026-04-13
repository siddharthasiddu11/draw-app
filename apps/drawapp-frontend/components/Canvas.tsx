import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
               if (canvasRef.current) {
                   canvasRef.current.width = window.innerWidth;
                   canvasRef.current.height = window.innerHeight;
                   initDraw(canvasRef.current, roomId, socket);
               }
           }, [canvasRef])
    return (
        <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
               <canvas
                   ref={canvasRef}
                   style={{ display: "block", margin: 0, padding: 0 }}
               />
           </div>
    )
}