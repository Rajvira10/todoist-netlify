import { Task } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "ONGOING":
      return <Clock className="h-5 w-5 text-yellow-500" />;
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

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="flex items-center">
                  {getStatusIcon(task.status)}
                  <span className="ml-2">{task.title}</span>
                </CardTitle>
                <CardDescription>
                  Due: {format(new Date(task.deadline), "PPP")}
                </CardDescription>
              </div>
              <Badge
                variant={
                  task.status === "COMPLETED"
                    ? "default"
                    : task.status === "ONGOING"
                    ? "secondary"
                    : "outline"
                }
              >
                {task.status.toLowerCase().replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          {task.description && (
            <CardContent>
              <p className="text-sm text-gray-500">{task.description}</p>
            </CardContent>
          )}
          <CardFooter className="text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(task.duration)}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
