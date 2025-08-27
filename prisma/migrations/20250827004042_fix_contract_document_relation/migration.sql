/*
  Warnings:

  - The primary key for the `ContractDocument` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileName` on the `ContractDocument` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ContractDocument` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ContractDocument` table. All the data in the column will be lost.
  - Added the required column `documentId` to the `ContractDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ContractDocument" DROP CONSTRAINT "ContractDocument_pkey",
DROP COLUMN "fileName",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "documentId" INTEGER NOT NULL,
ADD CONSTRAINT "ContractDocument_pkey" PRIMARY KEY ("contractId", "documentId");

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ContractDocument" ADD CONSTRAINT "ContractDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
