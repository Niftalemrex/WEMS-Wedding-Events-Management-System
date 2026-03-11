// src/Vendor/VendorSchedule.tsx
import React, { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { Clock, CalendarDays } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./VendorSchedule.css";

/* ---------------- Types ---------------- */

type AgendaItem = {
  id: string;
  eventId: string;
  time: string;
  activity: string;
};

type EventStatus = "draft" | "approved" | "locked";

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
};

/* ---------------- Component ---------------- */

const VendorSchedule: React.FC = () => {
  const { t } = useAppSettings(); // translation function
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  /* -------- Load agenda & events -------- */
  useEffect(() => {
    setAgenda(getFromStorage<AgendaItem[]>(STORAGE_KEYS.AGENDA, []));
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  /* -------- Only approved / locked events -------- */
  const usableEvents = useMemo(() => events.filter((e) => e.status !== "draft"), [events]);

  /* -------- Merge agenda with event info -------- */
  const vendorSchedule = useMemo(() => {
    return agenda
      .map((item) => {
        const event = usableEvents.find((e) => e.id === item.eventId);
        if (!event) return null;

        return {
          ...item,
          eventName: event.name,
          eventDate: event.date,
        };
      })
      .filter(Boolean) as (AgendaItem & { eventName: string; eventDate: string })[];
  }, [agenda, usableEvents]);

  return (
    <div className="vendor-schedule-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("mySchedule")}</h1>

      {vendorSchedule.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noScheduleItems")}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendorSchedule.map((item) => (
            <li
              key={item.id}
              className="schedule-card p-4 bg-white rounded shadow flex items-start gap-4 hover:shadow-lg transition"
            >
              <Clock className="h-6 w-6 text-blue-500 mt-1" />

              <div className="flex-1">
                <p className="font-semibold text-lg">{item.activity}</p>

                <p className="text-sm text-gray-600">{item.time}</p>

                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <CalendarDays className="h-4 w-4" />
                  {item.eventName}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VendorSchedule;
