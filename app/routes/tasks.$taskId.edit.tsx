import { ActionFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { prisma } from "~/lib/prisma.server";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "~/message.server";

export const action: ActionFunction = async (args) => {
  const { params, request } = args;
  const session = await getSession(request.headers.get("cookie"));
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const taskId = params.taskId;
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const durationValue = parseInt(formData.get("duration") as string);
  const durationUnit = formData.get("durationUnit") as string;
  const deadline = new Date(formData.get("deadline") as string);

  let duration = durationValue;
  if (durationUnit === "hours") {
    duration *= 60;
  } else if (durationUnit === "days") {
    duration *= 1440;
  }
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        duration,
        deadline,
      },
    });
    setSuccessMessage(session, "Task updated successfully");
    return redirect("/tasks", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    setErrorMessage(session, "There was an error updating the task");
    return redirect("/tasks", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
};
