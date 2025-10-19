-- CreateTable
CREATE TABLE "symbols" (
    "ticker" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "prices" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "exitDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pnl" DOUBLE PRECISION,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "symbols_ticker_key" ON "symbols"("ticker");

-- CreateIndex
CREATE INDEX "prices_ticker_timestamp_idx" ON "prices"("ticker", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "prices_ticker_timestamp_key" ON "prices"("ticker", "timestamp");

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_ticker_fkey" FOREIGN KEY ("ticker") REFERENCES "symbols"("ticker") ON DELETE CASCADE ON UPDATE CASCADE;
