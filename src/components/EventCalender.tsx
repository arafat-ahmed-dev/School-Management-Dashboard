"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalender = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();
  useEffect(() => {
    router.push(`?date=${(value as Date).toLocaleDateString("en-US")}`);
  }, [value]);
  return <Calendar onChange={onChange} value={value} />;
};

export default EventCalender;
