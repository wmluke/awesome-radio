-- CreateTable
CREATE TABLE "User"
(
    "id"        TEXT     NOT NULL PRIMARY KEY,
    "email"     TEXT     NOT NULL,
    "role"      TEXT     NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Password"
(
    "hash"   TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Station"
(
    "id"          TEXT     NOT NULL PRIMARY KEY,
    "name"        TEXT     NOT NULL,
    "slug"        TEXT     NOT NULL,
    "description" TEXT,
    "imgUrl"      TEXT     NOT NULL,
    "streamUrl"   TEXT     NOT NULL,
    "reliability" REAL     NOT NULL,
    "popularity"  REAL     NOT NULL,
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag"
(
    "id"        TEXT     NOT NULL PRIMARY KEY,
    "name"      TEXT     NOT NULL,
    "slug"      TEXT     NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StationTag"
(
    "id"        TEXT     NOT NULL PRIMARY KEY,
    "stationId" TEXT     NOT NULL,
    "tagId"     TEXT     NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StationTag_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StationTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFavoriteStation"
(
    "id"        TEXT     NOT NULL PRIMARY KEY,
    "stationId" TEXT     NOT NULL,
    "userId"    TEXT     NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserFavoriteStation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserFavoriteStation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentSource"
(
    "id"            TEXT     NOT NULL PRIMARY KEY,
    "name"          TEXT     NOT NULL,
    "type"          TEXT     NOT NULL,
    "description"   TEXT,
    "connectionUrl" TEXT     NOT NULL,
    "createdAt"     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Station_streamUrl_key" ON "Station" ("streamUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag" ("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSource_connectionUrl_key" ON "ContentSource" ("connectionUrl");
