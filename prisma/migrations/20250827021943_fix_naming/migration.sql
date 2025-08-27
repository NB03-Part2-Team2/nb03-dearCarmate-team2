/*
  Warnings:

  - The primary key for the `ContractDocument` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contractId` on the `ContractDocument` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `ContractDocument` table. All the data in the column will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileName` to the `ContractDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ContractDocument" DROP CONSTRAINT "ContractDocument_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContractDocument" DROP CONSTRAINT "ContractDocument_documentId_fkey";

-- AlterTable
ALTER TABLE "public"."ContractDocument" DROP CONSTRAINT "ContractDocument_pkey",
DROP COLUMN "contractId",
DROP COLUMN "documentId",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ContractDocument_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Document";

-- CreateTable
CREATE TABLE "public"."ContractDocumentRelation" (
    "contractId" INTEGER NOT NULL,
    "contractDocumentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractDocumentRelation_pkey" PRIMARY KEY ("contractId","contractDocumentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContractDocumentRelation_contractDocumentId_key" ON "public"."ContractDocumentRelation"("contractDocumentId");

-- AddForeignKey
ALTER TABLE "public"."ContractDocumentRelation" ADD CONSTRAINT "ContractDocumentRelation_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractDocumentRelation" ADD CONSTRAINT "ContractDocumentRelation_contractDocumentId_fkey" FOREIGN KEY ("contractDocumentId") REFERENCES "public"."ContractDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
