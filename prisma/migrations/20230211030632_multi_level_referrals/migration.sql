/*
  Warnings:

  - Added the required column `dateCleared` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCreated` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `commissionId` VARCHAR(64) NULL,
    ADD COLUMN `dateCleared` DATETIME(3) NOT NULL,
    ADD COLUMN `dateCreated` DATETIME(3) NOT NULL,
    ADD COLUMN `purchaseId` VARCHAR(64) NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_commissionId_fkey` FOREIGN KEY (`commissionId`) REFERENCES `Commission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
