import { useState } from "react";
import { Form } from "@remix-run/react";
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
import { DialogTrigger } from "@radix-ui/react-dialog";

export function TaskForm() {
  const [date, setDate] = useState<Date>();
  const [durationUnit, setDurationUnit] = useState("minutes");

  return (
    <Form method="post" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Task Title
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter task title"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter task description"
          className="h-32"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration" className="text-sm font-medium">
          Duration
        </Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            name="durationValue"
            placeholder="Duration"
            className="w-full"
            required
          />
          <Select
            name="durationUnit"
            defaultValue={durationUnit}
            onValueChange={setDurationUnit}
          >
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
              {date ? format(date, "PPP") : <span>Pick a deadline</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="hidden"
          name="deadline"
          value={date ? date.toISOString() : ""}
        />
      </div>

      <DialogTrigger>
        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </DialogTrigger>
    </Form>
  );
}
