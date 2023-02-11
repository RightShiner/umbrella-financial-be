-- CreateTable
CREATE TABLE `GhlUser` (
    `id` VARCHAR(64) NOT NULL,
    `firstName` VARCHAR(128) NULL,
    `lastName` VARCHAR(128) NULL,
    `username` VARCHAR(256) NULL,
    `email` VARCHAR(256) NULL,
    `profilePictureUrl` VARCHAR(255) NULL,
    `type` VARCHAR(32) NULL,
    `fullName` VARCHAR(256) NULL,
    `phone` VARCHAR(16) NULL,
    `locationId` VARCHAR(64) NULL,
    `profilePicture` VARCHAR(255) NULL,

    UNIQUE INDEX `GhlUser_id_key`(`id`),
    INDEX `GhlUser_email_idx`(`email`),
    INDEX `GhlUser_locationId_idx`(`locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GhlLocation` (
    `id` VARCHAR(64) NOT NULL,
    `companyId` VARCHAR(64) NULL,
    `name` VARCHAR(256) NULL,
    `addressId` VARCHAR(64) NULL,
    `logoUrl` VARCHAR(2048) NULL,
    `website` VARCHAR(2048) NULL,
    `timezone` VARCHAR(64) NULL,
    `firstName` VARCHAR(256) NULL,
    `lastName` VARCHAR(256) NULL,
    `email` VARCHAR(512) NULL,
    `phone` VARCHAR(16) NULL,
    `ghlApiKey` VARCHAR(512) NULL,

    UNIQUE INDEX `GhlLocation_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GhlContact` (
    `id` VARCHAR(64) NOT NULL,
    `firstName` VARCHAR(256) NULL,
    `lastName` VARCHAR(256) NULL,
    `email` VARCHAR(256) NULL,
    `phone` VARCHAR(16) NULL,
    `companyName` VARCHAR(256) NULL,
    `timezone` VARCHAR(64) NULL,
    `locationId` VARCHAR(64) NOT NULL,
    `dnc` BOOLEAN NOT NULL,
    `type` VARCHAR(64) NULL,
    `source` VARCHAR(128) NULL,
    `assignedUserId` VARCHAR(64) NULL,
    `addressId` VARCHAR(64) NULL,
    `website` VARCHAR(2048) NULL,
    `dateOfBirth` DATETIME(0) NULL,
    `dateAdded` DATETIME(0) NOT NULL,
    `dateUpdated` DATETIME(0) NOT NULL,
    `ssn` VARCHAR(16) NULL,
    `gender` VARCHAR(8) NULL,
    `keyword` VARCHAR(64) NULL,
    `dateLastActivity` DATETIME(0) NULL,
    `umbrellaUserId` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `GhlContact_id_key`(`id`),
    INDEX `GhlContact_locationId_idx`(`locationId`),
    INDEX `GhlContact_firstName_lastName_locationId_idx`(`firstName`, `lastName`, `locationId`),
    INDEX `GhlContact_email_locationId_idx`(`email`, `locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(64) NOT NULL,
    `uigUserId` INTEGER NOT NULL,
    `type` ENUM('CUSTOMER', 'MENTOR', 'COACH', 'PARTNER', 'CORPORATE_PARTNER') NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL,
    `hashPassword` VARCHAR(191) NOT NULL,
    `level1ReferredByUserId` VARCHAR(64) NULL,
    `level2ReferredByUserId` VARCHAR(64) NULL,
    `level3ReferredByUserId` VARCHAR(64) NULL,
    `affiliateStatus` VARCHAR(16) NULL,
    `affiliateUrl` VARCHAR(2048) NULL,
    `name` VARCHAR(128) NULL,
    `email` VARCHAR(256) NULL,
    `phoneNumber` VARCHAR(16) NULL,
    `username` VARCHAR(128) NULL,
    `dateOfBirth` DATETIME(0) NULL,
    `primaryGhlLocationId` VARCHAR(32) NULL,
    `ghlUserId` VARCHAR(32) NULL,
    `ghlSuperCorporateContactId` VARCHAR(32) NULL,
    `transactionTotal` DECIMAL(65, 30) NOT NULL,
    `salesAccountId` VARCHAR(64) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_uigUserId_key`(`uigUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    `billingPeriodLength` INTEGER NULL,
    `billingPeriodUnit` ENUM('DAY', 'WEEK', 'MONTH', 'YEAR') NULL,
    `trialPeriodLength` INTEGER NULL,
    `trialPeriodUnit` ENUM('DAY', 'WEEK', 'MONTH', 'YEAR') NULL,
    `retailPrice` DECIMAL(65, 30) NOT NULL,
    `costAmount` DECIMAL(65, 30) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `dateRetired` DATETIME(3) NULL,
    `defaultCommissionPlanId` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `Product_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommissionPlan` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `commissionableValueShare` DECIMAL(65, 30) NOT NULL,
    `personalSaleShare` DECIMAL(65, 30) NOT NULL,
    `corporatePartnerProfitShare` DECIMAL(65, 30) NOT NULL,
    `level1ReferralShare` DECIMAL(65, 30) NOT NULL,
    `level2ReferralShare` DECIMAL(65, 30) NOT NULL,
    `level3ReferralShare` DECIMAL(65, 30) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `dateRetired` DATETIME(3) NULL,

    UNIQUE INDEX `CommissionPlan_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` VARCHAR(64) NOT NULL,
    `sellingUserId` VARCHAR(64) NOT NULL,
    `purchasingUserId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(64) NOT NULL,
    `purchasePrice` DECIMAL(65, 30) NOT NULL,
    `trialStartDate` DATETIME(3) NULL,
    `billingStartDate` DATETIME(3) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `dateCancelled` DATETIME(3) NULL,
    `commissionPlanId` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `Sale_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(64) NOT NULL,
    `type` ENUM('ASSET', 'LIABILITY', 'INCOME', 'EXPENSE') NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `balance` DECIMAL(65, 30) NOT NULL,
    `userId` VARCHAR(64) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Account_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `accountId` VARCHAR(64) NOT NULL,
    `saleId` VARCHAR(64) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,
    `dateCleared` DATETIME(3) NULL,

    UNIQUE INDEX `Transaction_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(64) NOT NULL,
    `userId` VARCHAR(64) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateExpires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GhlUser` ADD CONSTRAINT `GhlUser_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `GhlLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GhlContact` ADD CONSTRAINT `GhlContact_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `GhlLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GhlContact` ADD CONSTRAINT `GhlContact_umbrellaUserId_fkey` FOREIGN KEY (`umbrellaUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_level1ReferredByUserId_fkey` FOREIGN KEY (`level1ReferredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_level2ReferredByUserId_fkey` FOREIGN KEY (`level2ReferredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_level3ReferredByUserId_fkey` FOREIGN KEY (`level3ReferredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_primaryGhlLocationId_fkey` FOREIGN KEY (`primaryGhlLocationId`) REFERENCES `GhlLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_ghlUserId_fkey` FOREIGN KEY (`ghlUserId`) REFERENCES `GhlUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_defaultCommissionPlanId_fkey` FOREIGN KEY (`defaultCommissionPlanId`) REFERENCES `CommissionPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_sellingUserId_fkey` FOREIGN KEY (`sellingUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_purchasingUserId_fkey` FOREIGN KEY (`purchasingUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_commissionPlanId_fkey` FOREIGN KEY (`commissionPlanId`) REFERENCES `CommissionPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
