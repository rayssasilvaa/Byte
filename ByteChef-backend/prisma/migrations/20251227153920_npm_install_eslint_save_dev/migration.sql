/*
  Warnings:

  - You are about to drop the column `amount` on the `SalePayment` table. All the data in the column will be lost.
  - Added the required column `type` to the `SalePayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SalePayment" DROP CONSTRAINT "SalePayment_saleId_fkey";

-- AlterTable
ALTER TABLE "SalePayment" DROP COLUMN "amount",
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
