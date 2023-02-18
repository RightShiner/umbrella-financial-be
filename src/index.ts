import express from "express";
import { router } from './Routes/route';
import cors from "cors"
import authorizeUser from "./Middleware/authorizeUser";
import { ImportClient } from "./Imports/ImportClient";

const port = 3003;
//ImportClient.importFromCsv();

const app = express();
app.use(cors());
app.use(express.json());
app.use(authorizeUser)
app.listen(port, () => {
    console.log(`Server is now listening on port ${port}.`)
});

app.options('/*', (_, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
    res.sendStatus(200);
});
app.use(router);
// app.post("/user", (req, res) => UserClient.handlePostRequest({ request: req, response: res }));
// app.post("/user/login", (req, res) => UserClient.login({ request: req, response: res }));
// app.get("/user/:id", (req, res) => UserClient.handleGetRequest({ request: req, response: res }));
// app.post("/totalcom", (req, res) => Commission.totalcom({request:req , response: res}));
// app.post("/tranInit", (req, res) => Commission.tranInit({request:req , response: res}));
// app.post("/customerInit", (req, res) => Commission.custInit({request:req , response: res}));


