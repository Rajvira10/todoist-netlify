import { Task, Reminder } from "@prisma/client";

export type TaskWithReminders = Task & {
  Reminder?: Reminder[];
};

export type TaskStatus = "NOT_STARTED" | "ONGOING" | "COMPLETED";
