-- CreateTable
CREATE TABLE "FetchPlan" (
    "id" SERIAL NOT NULL,
    "stockId" TEXT NOT NULL,
    "scheduleTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FetchPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FetchPlan" ADD CONSTRAINT "FetchPlan_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("ticker") ON DELETE RESTRICT ON UPDATE CASCADE;
