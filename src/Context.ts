import { NextFunction, Request, Response } from "express";
export type Context = {
    response: Response;
    request: Request;
    next: NextFunction;
}