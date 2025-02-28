/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Interest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_CompetenceToOrganization" ADD CONSTRAINT "_CompetenceToOrganization_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CompetenceToOrganization_AB_unique";

-- AlterTable
ALTER TABLE "_OrganizationToRegion" ADD CONSTRAINT "_OrganizationToRegion_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_OrganizationToRegion_AB_unique";

-- AlterTable
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_OrganizationToUser_AB_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Interest_email_key" ON "Interest"("email");
