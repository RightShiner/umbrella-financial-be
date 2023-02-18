import { Session } from "@prisma/client";
import jwt from "jsonwebtoken";

export function createJWT(session: Session) {
    return new Promise((resolve, reject) => {
        try {
            jwt.sign({
                context: session
            }, process.env.TOKEN_SECRET as string, {
                expiresIn: process.env.TOKEN_EXPIRE_TIME
            }, (err, token) => {
                if (err) {
                    reject(err)
                }
                if (token) {
                    resolve(token);
                }

            })
        } catch (error) {
            console.trace(error)
        }
    });
}