import { prismaClient } from "./GlobalContext";
import express from "express";
import { UserClient } from "./Models/User";
import { handleApiError } from "./Middleware/ErrorHandlerWrapper";
const port = 3003;

const app = express();
app.use(express.json());
const server = app.listen(port, () => {
    `Server is now listening on port ${port}.`
});

app.post("/user", (req, res) => UserClient.handlePostRequest({ request: req, response: res }));
app.get("/user/:id", (req, res) => UserClient.handleGetRequest({ request: req, response: res }));
