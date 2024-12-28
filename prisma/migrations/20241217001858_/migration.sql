/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_idRole_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_idRole_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToUser" DROP CONSTRAINT "_PermissionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToUser" DROP CONSTRAINT "_PermissionToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" TEXT[];

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "_PermissionToUser";
