-- AlterTable
ALTER TABLE `user` ADD COLUMN `type` ENUM('admin', 'moderator', 'user') NOT NULL DEFAULT 'user';
