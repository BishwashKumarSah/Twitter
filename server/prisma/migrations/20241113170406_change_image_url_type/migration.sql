/*
  Warnings:

  - The `imageUrl` column on the `Tweet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];
