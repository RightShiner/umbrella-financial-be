import { Context } from "../Context";
export class User {
    static async handlePostRequest(context: Context) {
        console.log(context.request.params);
        console.log(context.request.query);
        const userData = context.request.body;
        console.log(userData);
        const prismaClient = context.prismaClient;
        prismaClient.user.create({
            data: userData
        })
        context.response.json({
            message: "Thanks for the request",
            status: "success"
        })
        context.response.end();
    }
}