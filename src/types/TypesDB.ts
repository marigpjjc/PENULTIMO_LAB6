
export type UserType = {
  id: string;
  username: string;
  email: string;
  createdAt?: Date;
};

export type TaskType = {
  completed: any;
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
};
