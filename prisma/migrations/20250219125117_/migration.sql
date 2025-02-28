-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "receiveDigest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiveNewsletter" BOOLEAN NOT NULL DEFAULT false;
