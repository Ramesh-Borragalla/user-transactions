-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "payment_id" TEXT,
    "order_id" TEXT NOT NULL,
    "signature" TEXT,
    "entity" TEXT,
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "status" TEXT,
    "method" TEXT,
    "amount_refunded" DOUBLE PRECISION,
    "refund_status" TEXT,
    "description" TEXT,
    "customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);
