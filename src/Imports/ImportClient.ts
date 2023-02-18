import { Prisma, UserRole, UserType } from "@prisma/client";
import { hash } from "bcrypt";
import fs from "fs/promises";
import { prismaClient } from "../GlobalContext";

export class ImportClient {
    public static async importFromCsv() {
        const filepath = "/Users/danielfournier/Downloads/Tax Data - Raw Data.csv"
        const buffer = await fs.readFile(filepath);
        const text = buffer.toString();
        const rows = text.split("\n");
        const headers = rows.splice(0, 1)[0].split(",");
        console.log(headers);

        const data = [];
        for (const row of rows) {
            const rowValues = row.split(",");
            const rowData: any = {};
            let rowIsEmpty = true;
            for (const [index, header] of headers.entries()) {
                const key = header.trim();
                if (key === "") {
                    continue;
                }
                const value = rowValues[index].trim();
                if (value === "") {
                    continue;
                } else {
                    rowIsEmpty = false;
                }
                rowData[key] = value;
            }
            if (!rowIsEmpty) {
                data.push(rowData);
            }
        }
        const commissionPlan = await prismaClient.commissionPlan.create({
            data: {
                "name": "Fixed Fee Standard Commission Plan",
                "commissionableValueShare": 1,
                "personalSaleShare": 0.3,
                "corporatePartnerProfitShare": 0.4,
                "level1ReferralShare": 0.1,
                "level2ReferralShare": 0.05,
                "level3ReferralShare": 0.03
            }
        });
        const product = await prismaClient.product.create({
            data: {
                "name": "Taxes level 1",
                "isRecurring": false,
                "retailPrice": 500,
                "costAmount": 150,
                "defaultCommissionPlanId": commissionPlan.id
            }
        });
        for (const saleData of data) {
            let uigUserId: number | null = parseInt(saleData["UIG USER ID"]);
            if (isNaN(uigUserId) || uigUserId === 0) {
                uigUserId = null;
            }
            const cleanPrice = (value: string) => {
                return value.replace(/"|'/, "").trim();
            }
            let purchasePrice = Number(cleanPrice(<string>saleData["Prep Fee YTD Paid"]));
            console.log(cleanPrice(<string>saleData["Prep Fee YTD Paid"]), purchasePrice);
            if (isNaN(purchasePrice)) {
                purchasePrice = 0;
            }
            let userId = null;
            if (uigUserId != null) {
                const matchedUser = await prismaClient.user.findFirst({
                    where: {
                        uigUserId: uigUserId
                    }
                });
                if (matchedUser != null) {
                    userId = matchedUser.id;
                }
            }
            const hashPassword = await hash("UmbrellaFinancial123!", 14);
            const sellingUserInput: Prisma.UserCreateInput = {
                name: saleData["Preparer Name"],
                uigUserId: uigUserId,
                role: UserRole.USER,
                type: UserType.AFFILIATE,
                hashPassword: hashPassword,
                accounts: {
                    create: [
                        {
                            type: "ASSET",
                            name: "User Default Sales Account",
                            balance: 0,
                        }
                    ]
                }
            }
            const sellingUser: any = {};
            if (userId == null) {
                sellingUser.create = sellingUserInput;
            } else {
                sellingUser.connect = {
                    id: userId
                }
            }
            const sale = await prismaClient.sale.create({
                data: {
                    sellingUser: sellingUser,
                    purchasingUser: {
                        create: {
                            name: [saleData["First Name"], saleData["Last Name"]].join(" "),
                            role: UserRole.USER,
                            type: UserType.CUSTOMER,
                            hashPassword: hashPassword,
                            accounts: {
                                create: [
                                    {
                                        type: "ASSET",
                                        name: "User Default Sales Account",
                                        balance: 0,
                                    }
                                ]
                            }
                        }
                    },
                    purchasePrice: purchasePrice,
                    product: {
                        connect: {
                            id: product.id
                        }
                    },
                    commissionPlan: {
                        connect: {
                            id: commissionPlan.id
                        }
                    }
                }
            })
        }
        console.log("import finished");
    }
}