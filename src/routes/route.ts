import express from "express";

import { UserClient } from "../Models/User";
import { Commission } from '../Models/commission';

export const router = express.Router();


router.post("/user", (req, res) => UserClient.handlePostRequest({ request: req, response: res }));
router.post("/user/login", (req, res) => UserClient.login({ request: req, response: res }));
router.get("/user/:id", (req, res) => UserClient.handleGetRequest({ request: req, response: res }));
router.post("/totalcom", (req, res) => Commission.totalcom({request:req , response: res}));
router.post("/tranInit", (req, res) => Commission.tranInit({request:req , response: res}));
router.post("/customerInit", (req, res) => Commission.custInit({request:req , response: res}));
