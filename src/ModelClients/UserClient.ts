import { User, Sale, Prisma } from ".prisma/client";
import { prismaClient } from "../GlobalContext";
import { Context } from "../Context";
import { convertToDateOrNull, convertBase64ToJsonOrNull } from "../Utilities";
export class UserClient {
    private static validateUserData(saleData: any) {
        const newSaleData: Prisma.UserCreateInput = {
            uigUserId: saleData.uigUserId,
            type: saleData.type,
            role: saleData.role,
            hashPassword: saleData.hashPassword,
        };
        return newSaleData;
    }
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
        console.log(context.request.params);
        console.log(context.request.query);
        const userData = context.request.body;
        await UserClient.handleAffiliates(userData);

        //validate incoming user data
        delete userData.id;

        userData.accounts = {
            create: [
                {
                    type: "ASSET",
                    name: "User Default Sales Account",
                    balance: 0,
                }
            ]
        };
        const user = await prismaClient.user.create({
            data: userData,
            include: {
                level1ReferredByUser: true,
                level1ReferredUsers: true,
                level2ReferredByUser: true,
                level2ReferredUsers: true,
                level3ReferredByUser: true,
                level3ReferredUsers: true,
                accounts: true
            }
        });
        await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                salesAccountId: user.accounts[0].id
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
    static async handleGetUserByIdRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

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
                level1ReferredUsers: true,
                level2ReferredByUser: true,
                level2ReferredUsers: true,
                level3ReferredByUser: true,
                level3ReferredUsers: true,
            }
        });
        context.response.json({
            message: "New user has been created",
            status: "success",
            user: user
        });
        context.response.end();
    }
    static async getAllSalesForUser(context: Context) {
        const userId = context.request.params.id;
        const userIdQuery = {
            OR: [
                {
                    sellingUser: {
                        id: userId
                    }
                },
                {
                    sellingUser: {
                        level1ReferredByUserId: userId
                    }
                },
                {
                    sellingUser: {
                        level2ReferredByUserId: userId
                    }
                },
                {
                    sellingUser: {
                        level3ReferredByUserId: userId
                    }
                },
            ]
        };
        let whereQuery = convertBase64ToJsonOrNull(context.request.query.base64EncodedWhere);
        if (whereQuery != null) {
            if ("OR" in whereQuery) {
                for (const value of userIdQuery.OR) {
                    whereQuery.OR.push(value);
                }
            }
        } else {
            whereQuery = userIdQuery;
        }
        console.log("whereQuery", whereQuery);
        const sales: Sale[] = await prismaClient.sale.findMany({
            where: whereQuery,
            include: {
                product: false,
                commissionPlan: false,
                transactions: false
            }
        });
        console.log(whereQuery);
        context.response.json({
            message: null,
            status: "success",
            sales: sales
        });
    }
    static async handleGetRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

        const users = await prismaClient.user.findMany();
        context.response.json({
            message: "New user has been created",
            status: "success",
            users: users
        });
        context.response.end();
    }
}