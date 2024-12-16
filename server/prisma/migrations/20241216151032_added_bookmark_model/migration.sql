-- CreateTable
CREATE TABLE "BookMark" (
    "tweetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BookMark_pkey" PRIMARY KEY ("tweetId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookMark_tweetId_userId_key" ON "BookMark"("tweetId", "userId");

-- AddForeignKey
ALTER TABLE "BookMark" ADD CONSTRAINT "BookMark_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookMark" ADD CONSTRAINT "BookMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
