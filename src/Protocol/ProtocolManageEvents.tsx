import React, { useEffect, useState, useMemo } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { CalendarDays, MapPin, PartyPopper, Lock } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ProtocolManageEvents.css";

type EventStatus = "draft" | "approved" | "locked";

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
};

const ProtocolManageEvents: React.FC = () => {
  const { t } = useAppSettings();

  const [events, setEvents] = useState<EventItem[]>([]);

  /* ---------------- Load events (read-only) ---------------- */
  useEffect(() => {
    const stored = getFromStorage<EventItem[]>(
      STORAGE_KEYS.EVENTS,
      []
    );
    setEvents(stored);
  }, []);

  /* ---------------- Protocol sees only usable events ---------------- */
  const protocolEvents = useMemo(
    () => events.filter(e => e.status !== "draft"),
    [events]
  );

  return (
    <div className="protocol-events-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PartyPopper className="h-6 w-6 text-purple-600" />
        {t("protocolManageEvents")}
      </h1>

      {protocolEvents.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noApprovedEvents")}
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocolEvents.map(event => (
            <li
              key={event.id}
              className="event-card p-4 bg-white rounded shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">
                  {event.name}
                </h3>

                {event.status === "locked" && (
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Lock size={14} />
                    {t("locked")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                {new Date(event.date).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-red-500" />
                {event.location}
              </div>

              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    event.status === "approved"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {event.status === "approved"
                    ? t("approved")
                    : t("locked")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProtocolManageEvents;
