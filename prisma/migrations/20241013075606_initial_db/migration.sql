-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "avatarLink" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "personName" TEXT,
    "releaseNumber" INTEGER,
    "update" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);
