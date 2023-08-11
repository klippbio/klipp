import { db } from "../utils/db.server";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  //make type for links
};

export const listUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};
