/*
  Warnings:

  - You are about to drop the column `type` on the `SalePayment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `SalePayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SalePayment" DROP CONSTRAINT "SalePayment_saleId_fkey";

-- AlterTable
ALTER TABLE "SalePayment" DROP COLUMN "type",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
