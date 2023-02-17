import express from "express";

import { UserClient } from "../Models/User";
import { Commission } from '../Models/commission';

export const router = express.Router();


router.post("/users", (req, res) => UserClient.handlePostRequest({ request: req, response: res }));
router.post("/users/login", (req, res) => UserClient.login({ request: req, response: res }));
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

router.post("/totalcom", (req, res) => Commission.totalcom({request:req , response: res}));
router.post("/tranInit", (req, res) => Commission.tranInit({request:req , response: res}));
router.post("/customerInit", (req, res) => Commission.custInit({request:req , response: res}));
