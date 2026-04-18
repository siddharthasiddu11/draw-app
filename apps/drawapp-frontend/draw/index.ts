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
    endY: number
} | {
    type: "pencil";
    points: {x: number, y: number}[];
}


export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
            const ctx = canvas.getContext("2d"); // get the 2d context of the canvas

            let existingShapes: Shape[] = await getExistingShapes(roomId); // array to store the existing shapes
            if(!ctx) {
                return;
            }

            socket.onmessage = (event) => {  
                const message = JSON.parse(event.data);
                if(message.type === "chat") {
                    const parsedShape = JSON.parse(message.message);
                    existingShapes.push(parsedShape.shape); 
                    clearCanvas(existingShapes, canvas, ctx);
                }
            }

            clearCanvas(existingShapes, canvas, ctx);
           //ctx.fillStyle = "rgba(0, 0, 0)" // set the fill style to black
           // ctx.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with black color
            let clicked = false;
            let startX = 0;
            let startY = 0;
            canvas.addEventListener("mousedown", (e) => { // when the mouse is clicked
                clicked = true;
                
                startX = e.clientX; // get the x coordinate relative to canvas
                startY = e.clientY; // get the y coordinate relative to canvas
            })
            canvas.addEventListener("mouseup", (e) => { // when the mouse is released
                clicked = false;
                const width = e.clientX - startX; 
                const height = e.clientY - startY;
                //@ts-ignore
                const selectedTool = window.selectedTool;
                let shape: Shape | null = null;
                if(selectedTool === "rect") {
                    
                    shape = {
                        type: "rect",
                        x: startX,
                        y: startY,
                        width,
                        height
                    }
                } else if(selectedTool === "circle") {
                    const radius = Math.max(width, height) / 2 ;
                    shape = {
                        type: "circle",
                        radius: radius,
                        centerX: startX + radius,
                        centerY: startY + radius
                    }
                } else if(selectedTool === "line") {
                    shape = {
                        type: "line",
                        startX,
                        startY,
                        endX: e.clientX,
                        endY: e.clientY
                    }
                } 

                if(!shape) {
                    return;
                }

                existingShapes.push(shape);
                

                socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({
                        shape
                    }),
                    roomId
                }))
            })
            canvas.addEventListener("mousemove", (e) => { // when the mouse is moved
                if(clicked) {
                    const width = e.clientX - startX; // calculate the difference between the current x coordinate and the starting x coordinate
                    const height = e.clientY - startY; // calculate the difference between the current y coordinate and the starting y coordinate
                    clearCanvas(existingShapes, canvas, ctx);
                    ctx.strokeStyle = "rgba(255, 255, 255)" // set the stroke style to white
                    //@ts-ignore
                    const selectedTool = window.selectedTool;
                    if(selectedTool === "rect") {
                        ctx.strokeRect(startX, startY, width, height); // draw the rectangle
                    } else if(selectedTool === "circle") {
                        const radius = Math.max(width, height) / 2;
                        const centerX = startX + radius;
                        const centerY = startY + radius;
                        
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.closePath();
                    } else if(selectedTool === "line") {
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(e.clientX, e.clientY);
                        ctx.stroke();
                        ctx.closePath();
                    } 
                    
                }
            })
}

function clearCanvas(existingShapes: Shape[],canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
 ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
 ctx.fillStyle = "rgba(0, 0, 0)" // set the fill style to black
 ctx.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with black color
existingShapes.map((shape) => {
    if(shape.type === "rect") {
        ctx.strokeStyle = "rgba(255, 255, 255)" // set the stroke style to white
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height); // draw the rectangle
    } else if(shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    } else if(shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        ctx.closePath();
    } 
})

}

async function getExistingShapes(roomId: string) {
   const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
   const messages = res.data.messages;

   const shapes = messages.map((x: {message: string}) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
   })
   return shapes;
}