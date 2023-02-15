import { User } from ".prisma/client";
import { prismaClient } from "../GlobalContext";
import { Context } from "../Context";

export class Commission {
  static async totalcom (context:Context) {
    const user = await prismaClient.user.findFirst({
            where: {
                id: "1" 
            }
        });
      context.response.json({transactionTotal : user?.transactionTotal});

      const transactions = await prismaClient.transaction.findMany({
        include: { 
          purchase: true, 
          commission: true, 
          account: true 
        }
      });
      console.log(transactions);
  }
  
  static async tranInit (context:Context) {
      const transactions = await prismaClient.transaction.findMany({
        include: { 
          purchase: true, 
          commission: true, 
          account: true 
        }
      });
      context.response.json(transactions);
  }
}
