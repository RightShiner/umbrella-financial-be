import { Sale, Prisma, CommissionPlan, Product, User, Account } from ".prisma/client";
import { prismaClient } from "../GlobalContext";
import { Context } from "../Context";
import { convertToDateOrNull } from "../Utilities";
export class ProductClient {

    private static validateProductData(productData: any) {
        const newProductData: Prisma.ProductCreateInput = {
            name: productData.name,
            isRecurring: productData.isRecurring,
            billingPeriodLength: productData.billingPeriodLength,
            billingPeriodUnit: productData.billingPeriodUnit,
            trialPeriodLength: productData.trialPeriodLength,
            trialPeriodUnit: productData.trialPeriodUnit,
            retailPrice: productData.retailPrice,
            costAmount: productData.costAmount,
            defaultCommissionPlan: {
                connect: {
                    id: productData.defaultCommissionPlanId
                }
            }
        };
        return newProductData;
    }
    static async handlePostRequest(context: Context) {
        console.log(context.request.params);
        console.log(context.request.query);
        const tempProductData = context.request.body;

        //validate incoming user data
        const productData: Prisma.ProductCreateInput = ProductClient.validateProductData(tempProductData)

        const product = await prismaClient.product.create({
            data: productData
        });
        context.response.json({
            message: "New sale has been created",
            status: "success",
            product: product
        });
        context.response.end();
    }
    static async handleGetProductByIdRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

        const id = context.request.params.id;
        if (typeof id !== "string") {
            throw new Error("sale id not valid");
        }
        const product = await prismaClient.product.findUnique({
            where: {
                id: id
            }
        });
        context.response.json({
            message: null,
            status: "success",
            product: product
        });
        context.response.end();
    }
    static async handleGetRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

        const products = await prismaClient.product.findMany();
        context.response.json({
            message: "New user has been created",
            status: "success",
            user: products
        });
        context.response.end();
    }
}