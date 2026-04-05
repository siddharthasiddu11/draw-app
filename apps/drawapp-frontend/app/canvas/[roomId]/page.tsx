"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // Set canvas size to fill the viewport
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initDraw(canvas);

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initDraw(canvas);
            };
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, [canvasRef])

    return (
        <div style={{ margin: 0, padding: 0, overflow: "hidden", width: "100vw", height: "100vh" }}>
            <canvas
                ref={canvasRef}
                style={{ display: "block", margin: 0, padding: 0 }}
            />
        </div>
    )
}