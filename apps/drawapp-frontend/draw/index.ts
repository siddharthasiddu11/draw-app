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
                const shape: Shape = {
                    type: "rect",
                    x: startX,
                    y: startY,
                    width,
                    height

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
                    const diffX = e.clientX - startX; // calculate the difference between the current x coordinate and the starting x coordinate
                    const diffY = e.clientY - startY; // calculate the difference between the current y coordinate and the starting y coordinate
                    clearCanvas(existingShapes, canvas, ctx);
                    ctx.strokeStyle = "rgba(255, 255, 255)" // set the stroke style to white
                    ctx.strokeRect(startX, startY, diffX, diffY); // draw the rectangle
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