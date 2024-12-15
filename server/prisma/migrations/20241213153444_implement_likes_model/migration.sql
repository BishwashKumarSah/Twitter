/*
  Warnings:

  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Likes_pkey" PRIMARY KEY ("tweetId", "userId");
