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
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMDAyZjIxYi01OTNhLTQxYzUtYWViNy0wYzY0MGMxMGY5MTEiLCJpYXQiOjE3NzYwODY2OTJ9.z4SiOfswtmpuiTxScwioDm04pH9vSjuBHowOBSwSL1Y`);
        ws.onopen = () => {    // when the socket is opened
            setSocket(ws);   // set the socket to the state
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data)
            ws.send(data)
        }
    }, [])

       if(!socket) {
        return <div>Connecting to the server...</div>
       }
   
       return (
           <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
            <Canvas roomId={roomId} socket={socket}/>
           </div>
       )
}