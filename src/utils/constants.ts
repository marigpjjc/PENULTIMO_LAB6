export const TASK_STATUS = {
  TODO: "todo" as const,
  COMPLETED: "completed" as const,
};

export const TASK_STATUS_TEXT = {
  [TASK_STATUS.TODO]: "Por hacer",
  [TASK_STATUS.COMPLETED]: "Completada",
};

export const ROUTES = {
  HOME: "/",
  TASKS: "/tasks",
  LOGIN: "/login",
  REGISTER: "/register",
};

export const STORAGE_KEYS = {
  TASKS: "tasks",
  USER_ID: "userId",
  USER_EMAIL: "userEmail",
};
