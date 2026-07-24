/*
  Warnings:

  - The values [MCQ] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'IMAGE');

-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('PAST_PAPER', 'NOTES', 'BOOK', 'ASSIGNMENT', 'SLIDES', 'MCQS', 'GUESS_PAPER', 'LAB_MANUAL', 'JOB_TEST');
ALTER TABLE "resources" ALTER COLUMN "type" TYPE "ResourceType_new" USING ("type"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "public"."ResourceType_old";
COMMIT;

-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "examType" TEXT,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
