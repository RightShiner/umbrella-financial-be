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

  static async custInit (context:Context) {
      const ghlContact = await prismaClient.ghlContact.findMany();
      context.response.json(ghlContact);
  }
}
