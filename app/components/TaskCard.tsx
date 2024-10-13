import { Suspense, useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { format, isAfter } from "date-fns";
import { CheckCircle, Circle, Clock, MoreVertical, Bell } from "lucide-react";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import TaskEditDialog from "./TaskEditDialog";
import TaskDeleteDialog from "./TaskDeleteDialog";
import ReminderDialog from "./ReminderDialog";
import { TaskWithReminders } from "~/types/task";

interface TaskCardProps {
  task: TaskWithReminders;
  viewMode: "list" | "grid";
}

export function TaskCard({ task, viewMode }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const fetcher = useFetcher();

  const isPastDeadline = isAfter(new Date(), new Date(task.deadline));

  function getStatusIcon(status: string) {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "ONGOING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "NOT_STARTED":
        return <Circle className="h-5 w-5 text-gray-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  }

  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
      return remainingMinutes
        ? `${hours}h ${remainingMinutes}m`
        : `${hours} hours`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  function toggleTaskStatus() {
    let newStatus;
    if (task.status === "NOT_STARTED") {
      newStatus = "ONGOING";
    } else if (task.status === "ONGOING") {
      newStatus = "COMPLETED";
    } else {
      newStatus = "NOT_STARTED";
    }

    fetcher.submit(
      { status: newStatus },
      {
        method: "post",
        action: `/tasks/${task.id}/toggle-status`,
      }
    );
  }

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        isPastDeadline && task.status !== "COMPLETED" ? "border-red-300" : ""
      } ${viewMode === "grid" ? "h-full" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center">
              {getStatusIcon(task.status)}
              <span className="ml-2">{task.title}</span>
            </CardTitle>
            <CardDescription
              className={
                isPastDeadline && task.status !== "COMPLETED"
                  ? "text-red-500"
                  : ""
              }
            >
              Due: {format(new Date(task.deadline), "PPP")}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                task.status === "COMPLETED"
                  ? "default"
                  : task.status === "ONGOING"
                  ? "secondary"
                  : isPastDeadline
                  ? "destructive"
                  : "outline"
              }
            >
              {isPastDeadline && task.status !== "COMPLETED"
                ? "OVERDUE"
                : task.status.toLowerCase().replace("_", " ")}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Dialog>
                  <DialogTrigger asChild onClick={() => setIsEditOpen(true)}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
                <Dialog>
                  <DialogTrigger
                    asChild
                    onClick={() => setIsReminderOpen(true)}
                  >
                    <DropdownMenuItem>Set Reminder</DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
                <DropdownMenuItem onSelect={toggleTaskStatus}>
                  {task.status === "COMPLETED"
                    ? "Mark Incomplete"
                    : task.status === "ONGOING"
                    ? "Mark Complete"
                    : "Mark Ongoing"}
                </DropdownMenuItem>
                <Dialog>
                  <DialogTrigger asChild onClick={() => setIsDeleteOpen(true)}>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent>
          <p className="text-sm text-gray-500">{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {formatDuration(task.duration)}
        </span>
        {task?.Reminder && task?.Reminder?.length > 0 && (
          <span className="flex items-center">
            <Bell className="h-4 w-4 mr-1" />
            {task?.Reminder?.length} reminder
            {task.Reminder.length > 1 ? "s" : ""}
          </span>
        )}
      </CardFooter>

      <Suspense fallback={<div>Loading...</div>}>
        <TaskEditDialog
          task={task}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      </Suspense>
      <TaskDeleteDialog
        taskId={task.id}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
      <ReminderDialog
        task={task}
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
      />
    </Card>
  );
}
