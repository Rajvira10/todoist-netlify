import { useState } from "react";
import { Form } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Calendar } from "~/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Label } from "./ui/label";
import { TaskWithReminders } from "~/types/task";

interface TaskEditDialogProps {
  task: TaskWithReminders;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskEditDialog({
  task,
  open,
  onOpenChange,
}: TaskEditDialogProps) {
  const [date, setDate] = useState<Date>(new Date(task.deadline));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form
          method="post"
          action={`/tasks/${task.id}/edit`}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title
            </label>
            <Input id="title" name="title" defaultValue={task.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={task.description || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                name="duration"
                defaultValue={task.duration}
                required
              />
              <Select name="durationUnit" defaultValue="minutes">
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm font-medium">
              Deadline
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input type="hidden" name="deadline" value={date.toISOString()} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <DialogTrigger asChild>
              <Button type="submit">Save Changes</Button>
            </DialogTrigger>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
