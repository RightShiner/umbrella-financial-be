import { PrismaClient } from "@prisma/client";
import express from "express";
import { User } from "./Models/User";
const port = 3003;
const prismaClient = new PrismaClient();

const app = express();
app.use(express.json());
const server = app.listen(port, () => {
    `Server is now listening on port ${port}.`
});

app.post("/user", (req, res) => User.handlePostRequest({ request: req, response: res, prismaClient: prismaClient }));

