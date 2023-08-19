import { db } from "../utils/db.server";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  //make type for links
};

export const allUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

export const onboarding = async (body: any): Promise<User> => {
  const { displayName, username, email, description, userId } = body;
  return db.user.create({
    data: {
      userName: username,
      name: displayName,
      email: email,
      userDescription: description,
      id: userId,
    },
  });
};
