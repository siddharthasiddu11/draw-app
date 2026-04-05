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


export function initDraw(canvas: HTMLCanvasElement) {
            const ctx = canvas.getContext("2d"); // get the 2d context of the canvas

            let existingShapes: Shape[] = []; // array to store the existing shapes
            if(!ctx) {
                return;
            }
            ctx.fillStyle = "rgba(0, 0, 0)" // set the fill style to black
            ctx.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with black color
            let clicked = false;
            let startX = 0;
            let startY = 0;
            canvas.addEventListener("mousedown", (e) => { // when the mouse is clicked
                clicked = true;
                const rect = canvas.getBoundingClientRect();
                startX = e.clientX - rect.left; // get the x coordinate relative to canvas
                startY = e.clientY - rect.top; // get the y coordinate relative to canvas
            })
            canvas.addEventListener("mouseup", (e) => { // when the mouse is released
                clicked = false;
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const width = mouseX - startX; 
                const height = mouseY - startY;
                existingShapes.push({
                    type: "rect",
                    x: startX,
                    y: startY,
                    width,
                    height
                })
            })
            canvas.addEventListener("mousemove", (e) => { // when the mouse is moved
                if(clicked) {
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    const diffX = mouseX - startX; // calculate the difference between the current x coordinate and the starting x coordinate
                    const diffY = mouseY - startY; // calculate the difference between the current y coordinate and the starting y coordinate
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