-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
