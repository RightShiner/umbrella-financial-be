import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../GlobalContext";
import jwt from "jsonwebtoken";
import { UserPermissions } from "../Types/UserTypes"
import { Session, UserRole, UserType } from "@prisma/client";

export default async function authorizeUser(req: Request, res: Response, next: NextFunction) {
    if ((req.url === "/users" || req.url === "/users/login") && req.method === "POST") {
        next();
        return;
    }
    const authHeader = req.headers.authorization;
    if (authHeader == null) {
        res.status(401).json({
            status: "unauthorized",
            message: "No authorization header is present on the token"
        }).end();
        return;
    }
    const authHeaderParts = authHeader.split(" ");
    if (authHeaderParts.length !== 2 || authHeaderParts[0].toLowerCase() !== "bearer") {
        res.status(401).json({
            status: "unauthorized",
            message: "Authorization header not formatted correctly. It should be in the form of Bearer <token>"
        }).end();
        return;
    }
    let jwtResponse = null;
    try {
        jwtResponse = jwt.verify(authHeaderParts[1], <any>process.env.TOKEN_SECRET);
    } catch {
        res.status(401).json({
            status: "unauthorized",
            message: "Malformed bearer token"
        }).end();
        return;
    }
    if (typeof jwtResponse === "string") {
        console.log(jwtResponse);
        res.status(401).json({
            status: "unauthorized",
            message: "Unable to validate bearer token"
        }).end();
        return;
    }
    const jwtContext = jwtResponse.context;

    console.log(jwtResponse);
    const session = await prismaClient.session.findUnique({
        where: {
            id: jwtContext.id
        },
        include: {
            user: true
        }
    });

    if (session == null) {
        res.status(403).json({
            status: "unauthorized",
            message: "Could not find session"
        }).end();
        return;
    }
    const permissions: UserPermissions = {
        userRole: session.user.role,
        userType: session.user.type
    }
    if (req.method === "GET") {
        req.query.permissions = permissions;
    } else {
        req.body.permissions = permissions;
    }
    next();
}