/*
  Warnings:

  - The primary key for the `Invite` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_pkey",
ADD CONSTRAINT "Invite_pkey" PRIMARY KEY ("id");
