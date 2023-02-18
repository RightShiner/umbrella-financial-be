import express from "express";

import { UserClient } from "../ModelClients/UserClient";
import { ProductClient } from "../ModelClients/ProductClient";
import { SaleClient } from "../ModelClients/SaleClient";
import { CommissionPlanClient } from "../ModelClients/CommissionPlanClient";
import { handleApiError } from "../Middleware/ErrorHandlerWrapper";


export const router = express.Router();


router.post("/users", (req, res, next) => UserClient.handlePostRequest({ request: req, response: res, next: next }));
router.post("/users/login", (req, res, next) => UserClient.login({ request: req, response: res, next: next }));
router.get("/users/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, UserClient.handleGetUserByIdRequest));
router.get("/users/:id/sales", (req, res, next) => handleApiError({ request: req, response: res, next: next }, UserClient.getAllSalesForUser));
router.get("/users", (req, res, next) => handleApiError({ request: req, response: res, next: next }, UserClient.handleGetRequest));

router.post("/sales", (req, res, next) => handleApiError({ request: req, response: res, next: next }, SaleClient.handlePostRequest));
router.get("/sales/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, SaleClient.handleGetSaleByIdRequest));
router.get("/sales", (req, res, next) => handleApiError({ request: req, response: res, next: next }, SaleClient.handleGetRequest));
router.delete("/sales", (req, res, next) => handleApiError({ request: req, response: res, next: next }, SaleClient.deleteAllSales));

router.post("/products", (req, res, next) => handleApiError({ request: req, response: res, next: next }, ProductClient.handlePostRequest));
router.get("/products/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, ProductClient.handleGetProductByIdRequest));
router.get("/products", (req, res, next) => handleApiError({ request: req, response: res, next: next }, ProductClient.handleGetRequest));

router.post("/commission-plans", (req, res, next) => handleApiError({ request: req, response: res, next: next }, CommissionPlanClient.handlePostRequest));
router.get("/commission-plans/:id", (req, res, next) => handleApiError({ request: req, response: res, next: next }, CommissionPlanClient.handleGetCommissionPlanByIdRequest));
router.get("/commission-plans", (req, res, next) => handleApiError({ request: req, response: res, next: next }, CommissionPlanClient.handleGetRequest));
