import React, { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { CalendarClock, MapPin, Clock } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // translation hook
import "./AttendeeSchedule.css";

/* ---------------- Types ---------------- */

type EventStatus = "draft" | "approved" | "locked";

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
};

type AgendaItem = {
  id: string;
  eventId: string;
  time: string;
  activity: string;
};

/* ---------------- Component ---------------- */

const AttendeeSchedule: React.FC = () => {
  const { t } = useAppSettings();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);

  /* -------- Load events & agenda -------- */
  useEffect(() => {
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
    setAgenda(getFromStorage<AgendaItem[]>(STORAGE_KEYS.AGENDA, []));
  }, []);

  /* -------- Only approved / locked events -------- */
  const visibleEvents = useMemo(
    () => events.filter(e => e.status !== "draft"),
    [events]
  );

  /* -------- Attach agenda to each event -------- */
  const attendeeSchedule = useMemo(() => {
    return visibleEvents.map(event => ({
      ...event,
      agenda: agenda.filter(a => a.eventId === event.id),
    }));
  }, [visibleEvents, agenda]);

  return (
    <div className="attendee-schedule-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("mySchedule")}</h1>

      {attendeeSchedule.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noScheduledEvents")}</p>
      ) : (
        <div className="space-y-6">
          {attendeeSchedule.map(event => (
            <div
              key={event.id}
              className="schedule-card bg-white p-4 rounded shadow"
            >
              {/* -------- Event Header -------- */}
              <h3 className="text-lg font-semibold mb-2">{event.name}</h3>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <CalendarClock className="h-4 w-4 text-blue-500" />
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {event.location}
                </div>
              </div>

              {/* -------- Agenda Timeline -------- */}
              {event.agenda.length === 0 ? (
                <p className="text-sm text-gray-400">{t("agendaNotPublished")}</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {event.agenda.map(item => (
                    <li key={item.id} className="flex items-start gap-3 text-sm">
                      <Clock className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-gray-500">{item.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeeSchedule;
