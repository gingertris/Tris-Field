/*
  Warnings:

  - You are about to drop the column `displayName` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameCaps]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameCaps` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Team_displayName_key";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "displayName",
ADD COLUMN     "nameCaps" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_nameCaps_key" ON "Team"("nameCaps");
