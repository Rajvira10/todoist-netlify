import { ActionFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { prisma } from "~/lib/prisma.server";

export const action: ActionFunction = async (args) => {
  const { params } = args;
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const taskId = params.taskId;

  await prisma.reminder.deleteMany({
    where: { taskId },
  });

  await prisma.task.delete({
    where: { id: taskId },
  });

  return redirect("/tasks");
};
