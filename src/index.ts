import { prismaClient } from "./GlobalContext";
import express from "express";
import { UserClient } from "./ModelClients/UserClient";
import { handleApiError } from "./Middleware/ErrorHandlerWrapper";
import { SaleClient } from "./ModelClients/SaleClient";
import { ProductClient } from "./ModelClients/ProductClient";
import { CommissionPlanClient } from "./ModelClients/CommissionPlanClient";
const port = 3003;

const app = express();
app.use(express.json());
const server = app.listen(port, () => {
    `Server is now listening on port ${port}.`
});

app.post("/users", (req, res, next) => handleApiError({ request: req, response: res, next: next }, UserClient.handlePostRequest));
app.get("/users/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, UserClient.handleGetUserByIdRequest));
app.get("/users/:id/sales", (req, res, next) => handleApiError({ request: req, response: res, next: next }, UserClient.getAllSalesForUser));
app.get("/users", (req, res, next) => handleApiError({ request: req, response: res, next: next }, UserClient.handleGetRequest));

app.post("/sales", (req, res, next) => handleApiError({ request: req, response: res, next: next }, SaleClient.handlePostRequest));
app.get("/sales/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, SaleClient.handleGetSaleByIdRequest));
app.get("/sales", (req, res, next) => handleApiError({ request: req, response: res, next: next }, SaleClient.handleGetRequest));

app.post("/products", (req, res, next) => handleApiError({ request: req, response: res, next: next }, ProductClient.handlePostRequest));
app.get("/products/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, ProductClient.handleGetProductByIdRequest));
app.get("/products", (req, res, next) => handleApiError({ request: req, response: res, next: next }, ProductClient.handleGetRequest));

app.post("/commission-plans", (req, res, next) => handleApiError({ request: req, response: res, next: next }, CommissionPlanClient.handlePostRequest));
app.get("/commission-plans/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, CommissionPlanClient.handleGetCommissionPlanByIdRequest));
app.get("/commission-plans", (req, res, next) => handleApiError({ request: req, response: res, next: next }, CommissionPlanClient.handleGetRequest));