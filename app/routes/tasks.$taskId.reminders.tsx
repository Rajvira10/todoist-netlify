import { ActionFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { prisma } from "~/lib/prisma.server";
import { createClerkClient } from "@clerk/remix/api.server";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "~/message.server";
import { Resend } from "resend";

export const action: ActionFunction = async (args) => {
  const { params, request } = args;
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");
  const user = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId);
  const taskId = params.taskId;
  if (!taskId) throw new Error("Task ID is required");

  const session = await getSession(request.headers.get("cookie"));
  const formData = await request.formData();
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  const reminderTime = new Date(`${date}T${time}:00`);
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  try {
    await prisma.reminder.create({
      data: {
        taskId,
        time: reminderTime,
      },
    });

    const resend = new Resend("re_EUyGnbAb_P6bbMuff7obiTVUvC8mPaHYk");
    await resend.emails
      .send({
        from: "Todoist <todoist@rajvir-ahmed.xyz>",
        to: user.emailAddresses[0].emailAddress,
        subject: "Reminder",
        text: `You have a reminder for ${task?.title}`,
        html: `You have a reminder for ${task?.title}`,
        scheduledAt: reminderTime.toISOString(),
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    setSuccessMessage(session, "Reminder added successfully");
    return redirect("/tasks", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    setErrorMessage(session, "There was an error adding the reminder");
    return redirect("/tasks", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
};
