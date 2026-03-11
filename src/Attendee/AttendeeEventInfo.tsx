import React, { useEffect, useState, useMemo } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { CalendarDays, MapPin, Lock } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // translation hook
import "./AttendeeEventInfo.css";

type EventStatus = "draft" | "approved" | "locked";

type EventInfo = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
};

const AttendeeEventInfo: React.FC = () => {
  const { t } = useAppSettings();
  const [events, setEvents] = useState<EventInfo[]>([]);

  /* ---------------- Load events ---------------- */
  useEffect(() => {
    setEvents(getFromStorage<EventInfo[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  /* ---------------- Visible events ---------------- */
  const visibleEvents = useMemo(
    () => events.filter(e => e.status === "approved" || e.status === "locked"),
    [events]
  );

  return (
    <div className="attendee-event-info-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("eventInformation")}</h1>

      {visibleEvents.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noConfirmedEvents")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="flex items-center justify-between">
                <h3 className="event-title">{event.name}</h3>

                {event.status === "locked" && (
                  <span title={t("locked")}>
                    <Lock className="h-4 w-4 text-gray-500" />
                  </span>
                )}
              </div>

              <div className="event-meta">
                <CalendarDays className="icon text-blue-500" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>

              <div className="event-meta">
                <MapPin className="icon text-red-500" />
                <span>{event.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeeEventInfo;
