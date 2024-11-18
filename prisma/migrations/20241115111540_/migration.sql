/*
  Warnings:

  - A unique constraint covering the columns `[completedBalanceId]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "completedBalanceId" TEXT;

-- CreateTable
CREATE TABLE "CompletedBalance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public" BOOLEAN NOT NULL,
    "success" BOOLEAN NOT NULL,
    "partnerCompany" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "CompletedBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_completedBalanceId_key" ON "Balance"("completedBalanceId");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_completedBalanceId_fkey" FOREIGN KEY ("completedBalanceId") REFERENCES "CompletedBalance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
