/*
  Warnings:

  - Added the required column `language` to the `Interest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "language" TEXT NOT NULL;
