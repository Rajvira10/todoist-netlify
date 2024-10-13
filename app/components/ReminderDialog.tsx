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
import { Calendar } from "~/components/ui/calendar";
import type { TaskWithReminders } from "~/types/task";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ReminderDialogProps {
  task: TaskWithReminders;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReminderDialog({
  task,
  open,
  onOpenChange,
}: ReminderDialogProps) {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Reminder</DialogTitle>
        </DialogHeader>
        <Form
          method="post"
          action={`/tasks/${task.id}/reminders`}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
            <input
              type="hidden"
              name="date"
              value={date.toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">
              Time
            </Label>
            <Input
              type="time"
              name="time"
              defaultValue={new Date().toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}
              className="w-full border rounded p-2"
            />
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
              <Button type="submit">Set Reminder</Button>
            </DialogTrigger>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
