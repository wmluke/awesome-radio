import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
    return new PrismaClient({
        // log: [
        //     {
        //         emit: "stdout",
        //         level: "query"
        //     },
        //     {
        //         emit: "stdout",
        //         level: "error"
        //     },
        //     {
        //         emit: "stdout",
        //         level: "info"
        //     },
        //     {
        //         emit: "stdout",
        //         level: "warn"
        //     }
        // ]
    });
}

let prisma: PrismaClient;

declare global {
    var __db__: PrismaClient | undefined;
}

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// In production, we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
    prisma = createPrismaClient();
} else {
    if (!global.__db__) {
        global.__db__ = createPrismaClient();
    }
    prisma = global.__db__;
    prisma.$connect();
}

export { prisma };
