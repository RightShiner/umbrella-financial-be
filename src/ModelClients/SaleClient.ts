import { Sale, Prisma, CommissionPlan, Product, User, Account } from ".prisma/client";
import Decimal = Prisma.Decimal;
import { prismaClient } from "../GlobalContext";
import { Context } from "../Context";
import { convertToDateOrNull } from "../Utilities";
export class SaleClient {

    private static validateSaleData(saleData: any) {
        const newSaleData: Prisma.SaleCreateInput = {
            sellingUser: {
                connect: { id: saleData.sellingUserId }
            },
            purchasingUser: {
                connect: { id: saleData.purchasingUserId }
            },
            product: {
                connect: { id: saleData.productId }
            },
            purchasePrice: new Decimal(saleData.purchasePrice),
            trialStartDate: convertToDateOrNull(saleData.trialStartDate),
            billingStartDate: convertToDateOrNull(saleData.billingStartDate),
            dateCancelled: null,
            commissionPlan: {
                connect: {
                    id: saleData.commissionPlanId
                }
            }
        };
        return newSaleData;
    }
    static async processPurchase(saleData: (Sale & { commissionPlan: CommissionPlan, product: Product, purchasingUser: (User & { accounts: Account[] }) })) {
        if (saleData.purchasingUser == null) {
            throw new Error("user not found");
        }
        let userSalesAccount = null;
        for (const account of saleData.purchasingUser.accounts) {
            if (account.id === saleData.purchasingUser.salesAccountId) {
                userSalesAccount = account;
            }
        }
        if (userSalesAccount == null) {
            throw new Error("sales account not found");
        }
        await prismaClient.transaction.create({
            data: {
                name: "Sale Commission",
                description: "Sale Commission",
                amount: -saleData.purchasePrice,
                account: {
                    connect: {
                        id: userSalesAccount.id
                    },
                },
                sale: {
                    connect: {
                        id: saleData.id
                    }
                }
            }
        });
    }
    static async processCommission(saleData: (Sale & { commissionPlan: CommissionPlan, product: Product, sellingUser: (User & { accounts: Account[], level1ReferredByUser: (User & { accounts: Account[] } | null), level2ReferredByUser: (User & { accounts: Account[] } | null), level3ReferredByUser: (User & { accounts: Account[] } | null) }) })) {
        const cost = saleData.product.costAmount;
        const purchasePrice = saleData.purchasePrice;
        const retailPrice = saleData.product.retailPrice;
        const commionableValueShare = saleData.commissionPlan.commissionableValueShare;
        const commionableValue = Decimal.mul(commionableValueShare, Decimal.add(retailPrice, cost));

        const purchasePriceAdjustment = Decimal.sub(purchasePrice, retailPrice);

        const prismaOperations = [];
        const user = saleData.sellingUser;
        if (user == null) {
            throw new Error("user is null");
        }
        prismaOperations.push(this.processCommissionTransaction(saleData.id, user, Decimal.add(purchasePriceAdjustment, Decimal.mul(saleData.commissionPlan.personalSaleShare, commionableValue))));
        if (user.level1ReferredByUser != null) {
            prismaOperations.push(this.processCommissionTransaction(saleData.id, user.level1ReferredByUser, Decimal.add(purchasePriceAdjustment, Decimal.mul(saleData.commissionPlan.level1ReferralShare, commionableValue))));
        }
        if (user.level2ReferredByUser != null) {
            prismaOperations.push(this.processCommissionTransaction(saleData.id, user.level2ReferredByUser, Decimal.add(purchasePriceAdjustment, Decimal.mul(saleData.commissionPlan.level2ReferralShare, commionableValue))));
        }
        if (user.level3ReferredByUser != null) {
            prismaOperations.push(this.processCommissionTransaction(saleData.id, user.level3ReferredByUser, Decimal.add(purchasePriceAdjustment, Decimal.mul(saleData.commissionPlan.level3ReferralShare, commionableValue))));
        }
        return prismaOperations;
    }
    static async processCommissionTransaction(saleDataId: string, user: (User & { accounts: Account[] }), amount: Decimal) {
        if (user == null) {
            throw new Error("user not found");
        }
        if (user.salesAccountId == null) {
            throw new Error("sales account not found");
        }
        let userSalesAccount = null;
        for (const account of user.accounts) {
            if (account.id === user.salesAccountId) {
                userSalesAccount = account;
            }
        }
        if (userSalesAccount == null) {
            throw new Error("sales account not found");
        }
        const userCommissionTransaction: Prisma.TransactionCreateInput = {
            name: "Sale Commission",
            description: "Sale Commission",
            amount: amount,
            account: {
                connect: {
                    id: userSalesAccount.id
                },
            },
            sale: {
                connect: {
                    id: saleDataId
                }
            }
        };
        return await prismaClient.transaction.create({
            data: userCommissionTransaction
        });
    }
    static async handlePostRequest(context: Context) {
        console.log(context.request.params);
        console.log(context.request.query);
        const tempSaleData = context.request.body;

        //validate incoming user data
        const saleData: Prisma.SaleCreateInput = SaleClient.validateSaleData(tempSaleData)

        const sale = await prismaClient.sale.create({
            data: saleData,
            include: {
                commissionPlan: true,
                product: true,
                sellingUser: {
                    include: {
                        accounts: true,
                        level1ReferredByUser: {
                            include: {
                                accounts: true
                            }
                        },
                        level2ReferredByUser: {
                            include: {
                                accounts: true
                            }
                        },
                        level3ReferredByUser: {
                            include: {
                                accounts: true
                            }
                        },
                    }
                },
                purchasingUser: {
                    include: {
                        accounts: true
                    }
                }
            }
        });
        await Promise.all([SaleClient.processCommission(sale), SaleClient.processPurchase(sale)]);
        context.response.json({
            message: "New sale has been created",
            status: "success",
            sale: sale
        });
        context.response.end();
    }
    static async handleGetSaleByIdRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

        const saleId = context.request.params.id;
        if (typeof saleId !== "string") {
            throw new Error("sale id not valid");
        }
        const sale = await prismaClient.sale.findUnique({
            where: {
                id: saleId
            },
            include: {
                sellingUser: true,
                purchasingUser: true,
                transactions: true,
                product: true,
                commissionPlan: true
            }
        });
        context.response.json({
            message: null,
            status: "success",
            sale: sale
        });
        context.response.end();
    }
    static async handleGetRequest(context: Context) {
        //console.log("params", context.request.params);
        //console.log("query", context.request.query);

        const sales = await prismaClient.sale.findMany();
        context.response.json({
            message: null,
            status: "success",
            sales: sales
        });
        context.response.end();
    }
}