import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // const user = await db.user.create({
  //   data: {
  //     name: "Alice",
  //     email: "alice@test.com",
  //     userDescription: "I am Alice",
  //     stores: {
  //       create: {
  //         storeName: "alice",
  //       },
  //     },
  //   },
  //   include: {
  //     stores: true,
  //   },
  // });

  // const store2 = await db.store.create({
  //   data: {
  //     storeName: "alice2",
  //     user: {
  //       connect: {
  //         id: "1cb38f1c-c969-4846-b573-f757f796e494",
  //       },
  //     },
  //   },
  // });

  // console.log(store2);
  // const storeItem = await db.storeItem.create({
  //   data: {
  //     itemOrder: 1,
  //     itemType: "DIGITALPRODUCT",
  //     DigitalProduct: {
  //       create: {
  //         name: "test",
  //         description: "test",
  //       },
  //     },
  //     store: {
  //       connect: {
  //         storeName: "alice",
  //       },
  //     },
  //   },
  // });
  // console.log(storeItem);
  // const store = await db.store.findUnique({
  //   where: {
  //     storeName: "alice",
  //   },
  //   include: {
  //     storeItems: {
  //       include: {
  //         Link: true,
  //         DigitalProduct: true,
  //       },
  //     },
  //   },
  // });
  // console.log(JSON.stringify(store));

  const user = await db.user.findUnique({
    where: {
      email: "alice@test.com",
    },
    include: {
      stores: {
        include: {
          storeItems: {
            include: {
              Link: true,
              DigitalProduct: true,
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(user));
}

main();
