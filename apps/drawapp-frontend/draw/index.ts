import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "pencil";
    points: { x: number; y: number }[];
} | {
    type: "eraser";
    points: { x: number; y: number }[];
    lineWidth: number;
}


export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId);
    if (!ctx) {
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    }

    clearCanvas(existingShapes, canvas, ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;


    let currentPoints: { x: number; y: number }[] = [];

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;

        //@ts-ignore
        const selectedTool = window.selectedTool;
        if (selectedTool === "pencil" || selectedTool === "eraser") {
            currentPoints = [{ x: e.clientX, y: e.clientY }];
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;

        //@ts-ignore
        const selectedTool = window.selectedTool;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        let shape: Shape | null = null;

        if (selectedTool === "rect") {
            shape = { type: "rect", x: startX, y: startY, width, height };

        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius,
                centerX: startX + radius,
                centerY: startY + radius,
            };

        } else if (selectedTool === "line") {
            shape = {
                type: "line",
                startX,
                startY,
                endX: e.clientX,
                endY: e.clientY,
            };

        } else if (selectedTool === "pencil") {
            if (currentPoints.length < 2) return;
            shape = { type: "pencil", points: currentPoints };
            currentPoints = [];

        } 

        if (!shape) return;

        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId,
        }));
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!clicked) return;

        //@ts-ignore
        const selectedTool = window.selectedTool;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        if (selectedTool === "pencil") {
            currentPoints.push({ x: e.clientX, y: e.clientY });
            const len = currentPoints.length;
            if (len < 2) return;

            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = PENCIL_WIDTH;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(currentPoints[len - 2].x, currentPoints[len - 2].y);
            ctx.lineTo(currentPoints[len - 1].x, currentPoints[len - 1].y);
            ctx.stroke();
            ctx.closePath();
            return; 
        }

        

        clearCanvas(existingShapes, canvas, ctx);
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.lineWidth = 1;

        if (selectedTool === "rect") {
            ctx.strokeRect(startX, startY, width, height);

        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            const centerX = startX + radius;
            const centerY = startY + radius;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();

        } else if (selectedTool === "line") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            ctx.closePath();
        }
    });
}

const PENCIL_WIDTH = 2;
const ERASER_WIDTH = 20;

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = 1;
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        } else if (shape.type === "circle") {
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();

        } else if (shape.type === "line") {
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
            ctx.closePath();

        } else if (shape.type === "pencil") {
            if (shape.points.length < 2) return;
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = PENCIL_WIDTH;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            shape.points.slice(1).forEach((pt) => ctx.lineTo(pt.x, pt.y));
            ctx.stroke();
            ctx.closePath();

        } 
    });
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;
    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
    });
    return shapes;
}