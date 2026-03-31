"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if(!ctx) {
                return;
            }
            initDraw(canvasRef.current);
        }
    }, [canvasRef])
    return (
        <canvas ref={canvasRef} width={1000} height={1000}></canvas>
    )
}