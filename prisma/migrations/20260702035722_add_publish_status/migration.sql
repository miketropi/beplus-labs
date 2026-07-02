-- AlterTable
ALTER TABLE `Product` ADD COLUMN `publishStatus` ENUM('public', 'pending') NOT NULL DEFAULT 'pending';
