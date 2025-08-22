/*
  Warnings:

  - Added the required column `contractPrice` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Contract" ADD COLUMN     "contractPrice" INTEGER NOT NULL;
