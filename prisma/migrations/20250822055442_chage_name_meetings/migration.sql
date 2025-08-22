/*
  Warnings:

  - You are about to drop the `Meeting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Meeting" DROP CONSTRAINT "Meeting_contractId_fkey";

-- DropTable
DROP TABLE "public"."Meeting";

-- CreateTable
CREATE TABLE "public"."Meetings" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "alarms" TEXT[],
    "contractId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meetings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Meetings" ADD CONSTRAINT "Meetings_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
