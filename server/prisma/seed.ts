import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const user = await db.user.upsert({
    where: {
      id: "user_2VxiCPE4jviBRValAK6KkX4CkVP",
      email: "meet22599@gmail.com",
      stores: {
        some: {
          id: "store_2VxiCPE4jviBRValAK6KkX4CkVP",
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
            id: "store_2VxiCPE4jviBRValAK6KkX4CkVP",
          },
          create: {
            id: "store_2VxiCPE4jviBRValAK6KkX4CkVP",
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
