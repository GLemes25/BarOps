"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

dayjs.locale("pt-br");

type EventStatus = "planning" | "confirmed" | "completed" | "canceled";

type CalendarEvent = {
  id: number;
  name: string;
  date: string;
  status: EventStatus;
};

type Props = {
  events: CalendarEvent[];
};

const statusClasses: Record<EventStatus, string> = {
  planning: "bg-event-planning text-event-planning-fg",
  confirmed: "bg-event-confirmed text-event-confirmed-fg",
  completed: "bg-event-completed text-event-completed-fg",
  canceled: "bg-event-canceled text-event-canceled-fg",
};

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const EventsCalendar = ({ events }: Props) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const daysInMonth = currentDate.daysInMonth();

  // Convert Sunday=0 to Monday-first offset
  const startDayOfWeek = startOfMonth.day();
  const offset = (startDayOfWeek + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const eventsByDay = events.reduce<Record<number, CalendarEvent[]>>(
    (acc, event) => {
      const eventDate = dayjs(event.date);
      if (
        eventDate.month() === currentDate.month() &&
        eventDate.year() === currentDate.year()
      ) {
        const day = eventDate.date();
        acc[day] = acc[day] ? [...acc[day], event] : [event];
      }
      return acc;
    },
    {},
  );

  const today = dayjs();
  const isCurrentMonth =
    today.month() === currentDate.month() &&
    today.year() === currentDate.year();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground capitalize">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentDate((d) => d.subtract(1, "month"))}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(dayjs())}
            disabled={isCurrentMonth}
          >
            Hoje
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentDate((d) => d.add(1, "month"))}
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground border-b pb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l border-border">
        {cells.map((day, i) => {
          const isToday =
            isCurrentMonth && day !== null && today.date() === day;
          const dayEvents = day !== null ? (eventsByDay[day] ?? []) : [];

          return (
            <div
              key={i}
              className={cn(
                "min-h-20 border-r border-b border-border p-1 flex flex-col gap-0.5",
                day === null && "bg-muted/30",
              )}
            >
              {day !== null && (
                <>
                  <span
                    className={cn(
                      "text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full self-start mb-0.5",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {day}
                  </span>
                  {dayEvents.slice(0, 3).map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className={cn(
                        "text-xs truncate rounded px-1 py-px leading-tight hover:opacity-75 transition-opacity",
                        statusClasses[event.status],
                      )}
                    >
                      {event.name}
                    </Link>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-muted-foreground px-1 leading-tight">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        {(
          [
            ["planning", "Planejamento"],
            ["confirmed", "Confirmado"],
            ["completed", "Concluído"],
            ["canceled", "Cancelado"],
          ] as [EventStatus, string][]
        ).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-sm flex-shrink-0",
                statusClasses[status],
              )}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
