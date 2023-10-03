import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const user = await db.user.upsert({
    where: {
      id: "user_2VxiCPE4jviBRValAK6KkX4CkVP",
      email: "meet22599@gmail.com",
      stores: {
        some: {
          id: "7a61221a-1578-4cd4-a890-d594c92cc33c",
        },
      },
    },
    update: {},
    create: {
      email: "meet22599@gmail.com",
      id: "user_2VxiCPE4jviBRValAK6KkX4CkVP",
      stores: {
        connectOrCreate: {
          where: {
            id: "7a61221a-1578-4cd4-a890-d594c92cc33c",
          },
          create: {
            id: "7a61221a-1578-4cd4-a890-d594c92cc33c",
            storeTitle: "Meet Shukla",
            storeDescription: "I will help you buildd",
            storeUrl: "meetshukla",
          },
        },
      },
    },
  });
}
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
