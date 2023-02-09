/*
  Warnings:

  - The primary key for the `Queue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Queue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Queue_pkey" PRIMARY KEY ("teamId", "region", "division");
