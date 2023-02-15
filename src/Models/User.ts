import { User } from ".prisma/client";
import { prismaClient } from "../GlobalContext";
import { Context } from "../Context";
import { compare, hash, compareSync } from "bcrypt"
import { createJWT } from "../utils/createJWT";

//const bcrypt = require('bcryptjs');
export class UserClient {
    private static async handleAffiliates(userData: User) {
        if (userData.level1ReferredByUserId == null) {
            return;
        }
        if (userData.level2ReferredByUserId == null) {
            const referredByUser = await prismaClient.user.findUnique({
                where: {
                    id: userData.level1ReferredByUserId
                }
            });
            if (referredByUser == null) {
                return;
            }
            userData.level2ReferredByUserId = referredByUser.level1ReferredByUserId;
            userData.level3ReferredByUserId = referredByUser.level2ReferredByUserId;
        }
        if (userData.level2ReferredByUserId == null) {
            return;
        }
        if (userData.level3ReferredByUserId == null) {
            const referredByUser = await prismaClient.user.findUnique({
                where: {
                    id: userData.level2ReferredByUserId
                }
            });
            if (referredByUser == null) {
                return;
            }
            userData.level3ReferredByUserId = referredByUser?.level1ReferredByUserId;
        }
        return;
    }
    static async handlePostRequest(context: Context) {
        // console.log(context.request.params);
        // console.log(context.request.query);
        console.log(context.request.body);
        const userData = context.request.body;
        await this.handleAffiliates(userData);

        //validate incoming user data
        delete userData.id;

        const user = await prismaClient.user.create({
            data: userData,
            include: {
                level1ReferredByUser: true,
                level1ReferreUsers: true,
                level2ReferredByUser: true,
                level2ReferreUsers: true,
                level3ReferredByUser: true,
                level3ReferreUsers: true,
            }
        });
        console.log("newUser", user);
        context.response.json({
            message: "New user has been created",
            status: "success",
            user: user
        });
        context.response.end();
    }
    static async login(context: Context) {
        //console.log(context);
        // const headers = {'Content-Type':'application/json',
        //     'Access-Control-Allow-Origin':'*',
        //     'Allow':'POST'}
        //     context.response.setHeader('Access-Control-Allow-Origin', '*');
        context.response.setHeader("Access-Control-Allow-Origin", "*");
		context.response.setHeader("Access-Control-Allow-Credentials", "true");
		context.response.setHeader("Access-Control-Max-Age", "1800");
		context.response.setHeader("Access-Control-Allow-Headers", "content-type");
		context.response.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
        console.log(context.request.body);
        const userData = context.request.body;
        const { password, email } = userData;
        if (!password) {context.response.status(400).json({
                    message: "no password",
                    
                    user : userData
                });;
            console.log("error");
            return;}
            
            if (!email) {context.response.status(400).json({
                    message: "no email.",
                    
                    user : userData
                });;
                console.log("error");
                return;}

        const UserExists = await prismaClient.user.findFirst({
            where: {
                email: email 
            }
        });

        console.log(UserExists);
        if (!UserExists) {context.response.status(404).json({
                    message: "user is not exist.",
                    
                    user : userData
                });;
        return;}

        const compare = (password : string, hashedPassword : string) => compareSync(password, hashedPassword);        
        if(!compare(password, UserExists.hashPassword)){

             context.response.status(401).json({
                    message: "Wrong password.",
                    
                    user : userData
                });
                return;
        }
        context.response.json({
            message: "user is exist",
            
            status: "success",
            user: userData
        });
        context.response.end();
    }

    static async handleGetRequest(context: Context) {   
        console.log("params", context.request.params);
        console.log("query", context.request.query);

        const userId = context.request.params.id;
        if (typeof userId !== "string") {
            throw new Error("user id not valid");
        }
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
                level1ReferredByUser: true,
                level1ReferreUsers: true,
                level2ReferredByUser: true,
                level2ReferreUsers: true,
                level3ReferredByUser: true,
                level3ReferreUsers: true,
            }
        });
        context.response.json({
            message: "New user has been created",
            status: "success",
            user: user
        });
        context.response.end();
    }
}