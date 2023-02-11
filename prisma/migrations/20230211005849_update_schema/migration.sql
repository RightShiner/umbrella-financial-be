/*
  Warnings:

  - You are about to drop the column `referredByUserId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_referredByUserId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `referredByUserId`,
    ADD COLUMN `level1ReferredByUserId` VARCHAR(64) NULL,
    ADD COLUMN `level2ReferredByUserId` VARCHAR(64) NULL,
    ADD COLUMN `level3ReferredByUserId` VARCHAR(64) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_level1ReferredByUserId_fkey` FOREIGN KEY (`level1ReferredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_level2ReferredByUserId_fkey` FOREIGN KEY (`level2ReferredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_level3ReferredByUserId_fkey` FOREIGN KEY (`level3ReferredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
