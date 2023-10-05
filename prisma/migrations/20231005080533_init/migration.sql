-- CreateTable
CREATE TABLE "GeoTraces" (
    "ip" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "distance_to_usa" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GeoTraces_pkey" PRIMARY KEY ("ip")
);

-- CreateIndex
CREATE INDEX "GeoTraces_name_idx" ON "GeoTraces"("name");

-- CreateIndex
CREATE INDEX "GeoTraces_distance_to_usa_idx" ON "GeoTraces"("distance_to_usa");
