import express from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json())

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const hashedPassword = await bcrypt.hash(parsedData.data?.password, 10)
    try {
        const user = await prismaClient.user.create({
        data: {
            email: parsedData.data?.username,
            password: hashedPassword,
            name: parsedData.data?.name,
        }
    })
    res.json({
        userId: user.id
    })
    } catch (error) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})
app.post("/signin", async (req, res) => {

    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data?.username,
        }
    })
    // if(!user) {
    //     res.json({
    //         message: "Incorrect inputs"
    //     })
    //     return;
    // }

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const isValidPassword = await bcrypt.compare(parsedData.data?.password, user.password);

    if(!isValidPassword) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

   const token = jwt.sign({
    userId: user.id
   }, JWT_SECRET)

   res.json({
    token
   })

})

app.post("/room",middleware, async (req, res) => {
    const parsedData = createRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // @ts-ignore
    const userId = req.userId;

    try {
         const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId,
        }
    })
    res.json({
        roomId: room.id,
    })
 
    } catch (error) {
        console.log(error);
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
   
})  

app.get("/chats/:roomId", async(req, res) => {
    const roomId = Number(req.params.roomId);
    const messages =  await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc" // get the latest messages first
        },
        take: 50
    });
    res.json({
        messages
    })
} )

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug; // get the slug from url
    const room = await prismaClient.room.findFirst({
        where: {
            slug: slug   // find the room with the given slug
        }
    })
    res.json({
        room   // return the room object
    })
})

app.listen(3001);
