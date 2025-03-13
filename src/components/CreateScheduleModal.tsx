import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Teacher = { name: string };

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSchedule: (scheduleData: ScheduleData) => void;
}

interface ScheduleData {
  title: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacher: string;
  class: string;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const classNames = [
  "Class 7",
  "Class 8",
  "Class 9-(S)",
  "Class 9-(A)",
  "Class 9-(C)",
  "Class 10-(S)",
  "Class 10-(A)",
  "Class 10-(C)",
  "Class 11-(S)",
  "Class 11-(A)",
  "Class 11-(C)",
  "Class 12-(S)",
  "Class 12-(A)",
  "Class 12-(C)",
];

export function CreateScheduleModal({
  isOpen,
  onClose,
  onCreateSchedule,
}: CreateScheduleModalProps) {
  
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    title: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    teacher: "",
    class: "",
  });


  const handleChange = (name: keyof ScheduleData, value: string) => {
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSchedule(scheduleData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90%] rounded-md">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={scheduleData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dayOfWeek" className="text-right">
              Day
            </Label>
            <Select
              value={scheduleData.dayOfWeek}
              onValueChange={(value) => handleChange("dayOfWeek", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start
            </Label>
            <Input
              id="startTime"
              type="time"
              value={scheduleData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End
            </Label>
            <Input
              id="endTime"
              type="time"
              value={scheduleData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">
              Class
            </Label>
            <Select
              value={scheduleData.class}
              onValueChange={(value) => handleChange("class", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classNames.map((classItem) => (
                  <SelectItem key={classItem} value={classItem}>
                    {classItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Create Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
