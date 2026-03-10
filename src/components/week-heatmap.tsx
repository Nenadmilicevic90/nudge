"use client";

import { Checkin } from "@/lib/types";
import { getWeekDates, formatDate } from "@/lib/streak";

const DAY_LABELS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

type Props = {
  checkins: Checkin[];
};

export function WeekHeatmap({ checkins }: Props) {
  const weekDates = getWeekDates();
  const today = formatDate(new Date());

  const checkinMap = new Map(checkins.map((c) => [c.date, c.status]));

  return (
    <div className="flex gap-1.5">
      {weekDates.map((date, i) => {
        const dateStr = formatDate(date);
        const status = checkinMap.get(dateStr);
        const isFuture = dateStr > today;
        const isToday = dateStr === today;

        let bg = "bg-gray-100";
        if (status === "done") bg = "bg-[#4CAF50]";
        else if (status === "skipped") bg = "bg-red-400";
        else if (isFuture) bg = "bg-gray-50";

        return (
          <div key={dateStr} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">
              {DAY_LABELS[i]}
            </span>
            <div
              className={`h-7 w-7 rounded-md ${bg} ${
                isToday ? "ring-2 ring-[#4CAF50] ring-offset-1" : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
