import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined; //eslint-disable-line
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db; //eslint-disable-line

export { db };
