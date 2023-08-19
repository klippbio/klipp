import { db } from "../utils/db.server";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  userName: string;
  userDescription: string;
  //make type for links
};

export const allUsers = async (): Promise<User[]> => {
  return db.user.findMany({});
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

export const getUserById = async (id: string): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const checkUserNameExists = async (
  userName: string
): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      userName: userName,
    },
  });
};
