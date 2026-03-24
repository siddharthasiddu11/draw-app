import express from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db";
import bcrypt from "bcrypt";
const app = express();

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
    if(!user) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

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
app.post("/room",middleware, (req, res) => {
    const data = createRoomSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    res.json({
        roomId: 123,
    })
 
})

app.listen(3001);

