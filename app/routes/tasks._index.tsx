import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import { prisma } from "~/lib/prisma.server";
import { TaskCard } from "~/components/TaskCard";
import type { TaskWithReminders } from "~/types/task";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Plus, List, Grid } from "lucide-react";
import { useState } from "react";
import { TaskForm } from "~/components/TaskForm";
import type { TaskStatus } from "@prisma/client"; // Import TaskStatus enum
import { Button } from "~/components/ui/button";

interface LoaderData {
  tasks: TaskWithReminders[];
}

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { Reminder: true },
    orderBy: { deadline: "asc" },
  });

  return json<LoaderData>({ tasks });
};

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }

  const formData = await args.request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const durationValue = parseInt(formData.get("durationValue") as string);
  const durationUnit = formData.get("durationUnit") as string;
  const deadline = new Date(formData.get("deadline") as string);

  let duration = durationValue;
  if (durationUnit === "hours") {
    duration *= 60;
  } else if (durationUnit === "days") {
    duration *= 1440;
  }

  await prisma.task.create({
    data: {
      title,
      description,
      duration,
      deadline,
      userId,
    },
  });

  return json({ success: true });
};

export default function TasksRoute() {
  const { tasks } = useLoaderData<LoaderData>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const parsedTasks = tasks.map((task) => ({
    ...task,
    deadline: new Date(task.deadline),
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    Reminder: task.Reminder?.map((reminder) => ({
      ...reminder,
      time: new Date(reminder.time),
      createdAt: new Date(reminder.createdAt),
      updatedAt: new Date(reminder.updatedAt),
    })),
  }));

  const statusMap: { [key: string]: TaskStatus } = {
    not_started: "NOT_STARTED",
    ongoing: "ONGOING",
    completed: "COMPLETED",
  };

  const filteredTasks = (statusKey: string) =>
    parsedTasks.filter((task) => task.status === statusMap[statusKey]);

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex space-x-4 items-center">
          <Button variant="outline" size="icon" onClick={toggleViewMode}>
            {viewMode === "list" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
              <TaskForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="not_started" className="w-full md:w-4/5 mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="not_started">
            Not Started ({filteredTasks("not_started").length})
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing ({filteredTasks("ongoing").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredTasks("completed").length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="not_started" className="mt-6">
          {renderTasks(filteredTasks("not_started"), viewMode)}
        </TabsContent>
        <TabsContent value="ongoing" className="mt-6">
          {renderTasks(filteredTasks("ongoing"), viewMode)}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {renderTasks(filteredTasks("completed"), viewMode)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderTasks(tasks: TaskWithReminders[], viewMode: "list" | "grid") {
  if (tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-center text-gray-500">No tasks found.</p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "list"
          ? "space-y-4"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      }
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} viewMode={viewMode} />
      ))}
    </div>
  );
}
