import { Sale, Prisma, CommissionPlan, Product, User, Account } from ".prisma/client";
import { prismaClient } from "../GlobalContext";
import { Context } from "../Context";
import { convertToDateOrNull } from "../Utilities";
export class CommissionPlanClient {

    private static validateProductData(commissionPlanData: any) {
        const newCommissionPlanData: Prisma.CommissionPlanCreateInput = {
            name: commissionPlanData.name,
            commissionableValueShare: commissionPlanData.commissionableValueShare,
            personalSaleShare: commissionPlanData.personalSaleShare,
            corporatePartnerProfitShare: commissionPlanData.corporatePartnerProfitShare,
            level1ReferralShare: commissionPlanData.level1ReferralShare,
            level2ReferralShare: commissionPlanData.level2ReferralShare,
            level3ReferralShare: commissionPlanData.level3ReferralShare
        };
        return newCommissionPlanData;
    }
    static async handlePostRequest(context: Context) {
        console.log(context.request.params);
        console.log(context.request.query);
        const tempCommissionPlanData = context.request.body;

        //validate incoming user data
        const commissionPlanData: Prisma.CommissionPlanCreateInput = CommissionPlanClient.validateProductData(tempCommissionPlanData)

        const commissionPlan = await prismaClient.commissionPlan.create({
            data: commissionPlanData
        });
        context.response.json({
            message: "New commission plan has been created",
            status: "success",
            commissionPlan: commissionPlan
        });
        context.response.end();
    }
    static async handleGetCommissionPlanByIdRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

        const id = context.request.params.id;
        if (typeof id !== "string") {
            throw new Error("sale id not valid");
        }
        const commissionPlan = await prismaClient.commissionPlan.findUnique({
            where: {
                id: id
            }
        });
        context.response.json({
            message: null,
            status: "success",
            commissionPlan: commissionPlan
        });
        context.response.end();
    }
    static async handleGetRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

        const commissionPlans = await prismaClient.commissionPlan.findMany();
        context.response.json({
            message: null,
            status: "success",
            commissionPlan: commissionPlans
        });
        context.response.end();
    }
}