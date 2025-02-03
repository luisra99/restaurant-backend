-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_inputMovementId_fkey";

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "unitPrice" DROP NOT NULL,
ALTER COLUMN "inputMovementId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_inputMovementId_fkey" FOREIGN KEY ("inputMovementId") REFERENCES "InventoryMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
