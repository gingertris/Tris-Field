/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "displayName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_displayName_key" ON "Team"("displayName");
