"use client"
import { useEffect, useRef, useState } from "react";
import { initDraw } from "@/draw";
import { WS_URL } from "@/config";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId}: {
    roomId: string;
}) {

    const [socket, setSocket] = useState<WebSocket | null>(null); 

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
        }
    }, [])

       if(!socket) {
        return <div>Connecting to the server...</div>
       }
   
       return (
           <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
            <Canvas roomId={roomId}/>
           </div>
       )
}