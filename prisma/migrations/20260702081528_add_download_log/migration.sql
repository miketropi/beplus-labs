-- CreateTable
CREATE TABLE `DownloadLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `productSlug` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `releaseTag` VARCHAR(191) NOT NULL,
    `downloadUrl` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `referer` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DownloadLog_email_idx`(`email`),
    INDEX `DownloadLog_productSlug_idx`(`productSlug`),
    INDEX `DownloadLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
