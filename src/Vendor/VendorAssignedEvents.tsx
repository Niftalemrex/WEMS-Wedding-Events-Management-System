// src/Vendor/VendorAssignedEvents.tsx
import React, { useEffect, useState, useMemo } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { CalendarDays, Lock } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./VendorAssignedEvents.css";

type EventStatus = "draft" | "approved" | "locked";

type AssignedEvent = {
  id: string;
  name: string;
  date: string;
  status: EventStatus;
  vendors?: string[];
};

const VendorAssignedEvents: React.FC = () => {
  const { t } = useAppSettings(); // translation function
  const [events, setEvents] = useState<AssignedEvent[]>([]);

  /* ---------------- Load events ---------------- */
  useEffect(() => {
    setEvents(getFromStorage<AssignedEvent[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  /* ---------------- Vendor-visible events ---------------- */
  const visibleEvents = useMemo(
    () => events.filter((e) => e.status === "approved" || e.status === "locked"),
    [events]
  );

  return (
    <div className="vendor-events-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("assignedEvents")}</h1>

      {visibleEvents.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noConfirmedEvents")}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleEvents.map((e) => (
            <li
              key={e.id}
              className="event-card p-4 bg-white rounded shadow hover:shadow-lg transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{e.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(e.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {e.status === "locked" && (
                <span title={t("locked")}>
                  <Lock className="h-4 w-4 text-gray-500" />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VendorAssignedEvents;
