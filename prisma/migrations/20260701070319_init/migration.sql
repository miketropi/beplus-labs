-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `features` JSON NOT NULL,
    `status` ENUM('dev', 'beta', 'launched') NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `coverImage` VARCHAR(191) NOT NULL DEFAULT '',
    `category` VARCHAR(191) NOT NULL,
    `github` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Product_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChangelogEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL DEFAULT '',
    `version` VARCHAR(191) NOT NULL,
    `type` ENUM('feature', 'fix', 'improvement') NOT NULL,
    `productSlug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ChangelogEntry_productSlug_idx`(`productSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChangelogEntry` ADD CONSTRAINT `ChangelogEntry_productSlug_fkey` FOREIGN KEY (`productSlug`) REFERENCES `Product`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;
