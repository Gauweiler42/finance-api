-- CreateTable
CREATE TABLE "Stock" (
    "ticker" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "sectorDisp" TEXT NOT NULL,
    "industry" TEXT NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("ticker")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "adjclose" DOUBLE PRECISION NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("ticker") ON DELETE RESTRICT ON UPDATE CASCADE;
