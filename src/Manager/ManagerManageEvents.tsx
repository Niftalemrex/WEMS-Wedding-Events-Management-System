import React, { useState, useEffect, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";

import { Trash2, Plus, Lock } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerManageEvents.css";

export type EventStatus = "draft" | "approved" | "locked";

export type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  vendors?: string[];
  guests?: string[];
};

const allowedStatusTransition = (
  current: EventStatus,
  next: EventStatus
): boolean => {
  if (current === "draft" && next === "approved") return true;
  if (current === "approved" && next === "locked") return true;
  return current === next;
};

const ManagerManageEvents: React.FC = () => {
  const { t } = useAppSettings();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  // Add event
  const handleAdd = () => {
    if (!name || !date || !location) return;

    const newEvent: EventItem = {
      id: Date.now().toString(),
      name,
      date,
      location,
      status: "draft",
      vendors: [],
      guests: [],
    };

    addToStorageArray(STORAGE_KEYS.EVENTS, newEvent);
    setEvents((p) => [...p, newEvent]);
    setName("");
    setDate("");
    setLocation("");
  };

  // Update definition fields (blocked if locked)
  const updateDefinition = (
    event: EventItem,
    field: "name" | "date" | "location",
    value: string
  ) => {
    if (event.status === "locked") return;

    handlePersistUpdate(event.id, field, value);
  };

  // Status update with validation
  const updateStatus = (event: EventItem, next: EventStatus) => {
    if (!allowedStatusTransition(event.status, next)) {
      alert(t("invalidStatusTransition"));
      return;
    }

    handlePersistUpdate(event.id, "status", next);
  };

  const handlePersistUpdate = (
    id: string,
    field: keyof EventItem,
    value: any
  ) => {
    updateStorageArray<EventItem>(
      STORAGE_KEYS.EVENTS,
      (e) => e.id === id,
      (e) => ({ ...e, [field]: value })
    );

    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  // Delete (blocked if approved or locked)
  const handleDelete = (event: EventItem) => {
    if (event.status !== "draft") {
      alert(t("onlyDraftDelete"));
      return;
    }

    if (!window.confirm(t("confirmDeleteDraftEvent"))) return;

    deleteFromStorageArray<EventItem>(
      STORAGE_KEYS.EVENTS,
      (e) => e.id === event.id
    );

    setEvents((p) => p.filter((e) => e.id !== event.id));
  };

  const filteredEvents = useMemo(
    () =>
      events
        .filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events, search]
  );

  return (
    <div className="manager-events-container p-4">
      <h1 className="text-2xl font-bold mb-4">{t("manageEvents")}</h1>

      {/* Add event */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <input
          placeholder={t("eventName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder={t("location")}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex gap-1 items-center"
        >
          <Plus size={16} /> {t("add")}
        </button>
      </div>

      <input
        placeholder={t("searchEvents")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500">{t("noEventsFound")}</p>
      ) : (
        <ul className="space-y-3">
          {filteredEvents.map((e) => (
            <li
              key={e.id}
              className="bg-gray-50 p-3 rounded hover:bg-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="flex gap-2 flex-wrap items-center">
                  <input
                    disabled={e.status === "locked"}
                    value={e.name}
                    onChange={(ev) =>
                      updateDefinition(e, "name", ev.target.value)
                    }
                    className="border p-1 rounded w-40 disabled:bg-gray-200"
                  />
                  <input
                    disabled={e.status === "locked"}
                    type="date"
                    value={e.date}
                    onChange={(ev) =>
                      updateDefinition(e, "date", ev.target.value)
                    }
                    className="border p-1 rounded disabled:bg-gray-200"
                  />
                  <input
                    disabled={e.status === "locked"}
                    value={e.location}
                    onChange={(ev) =>
                      updateDefinition(e, "location", ev.target.value)
                    }
                    className="border p-1 rounded w-40 disabled:bg-gray-200"
                  />

                  <select
                    value={e.status}
                    onChange={(ev) =>
                      updateStatus(e, ev.target.value as EventStatus)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="draft">{t("draft")}</option>
                    <option value="approved">{t("approved")}</option>
                    <option value="locked">{t("locked")}</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {t("guests")}: {e.guests?.length ?? 0} | {t("vendors")}:{" "}
                    {e.vendors?.length ?? 0}
                  </span>

                  <button
                    onClick={() => handleDelete(e)}
                    className="flex items-center gap-1 px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 size={14} /> {t("delete")}
                  </button>

                  {e.status === "locked" && (
                    <Lock size={16} className="text-gray-500" />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagerManageEvents;
