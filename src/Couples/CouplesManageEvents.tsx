import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesManageEvents.css";

type EventStatus = "draft" | "approved" | "locked";

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
};

const CoupleManageEvents: React.FC = () => {
  const { t } = useAppSettings(); // Multi-language translation function
  const [events, setEvents] = useState<EventItem[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const stored = getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []);
    const updated = stored.map(e => ({ ...e, status: e.status || "draft" }));
    setEvents(updated);
  }, []);

  const addEvent = () => {
    if (!name || !date || !location) return alert(t("fillAllFields"));

    const newEvent: EventItem = {
      id: Date.now().toString(),
      name,
      date,
      location,
      status: "draft",
    };

    addToStorageArray(STORAGE_KEYS.EVENTS, newEvent);
    setEvents(prev => [...prev, newEvent]);
    setName("");
    setDate("");
    setLocation("");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirmDeleteEvent"))) return;

    deleteFromStorageArray<EventItem>(STORAGE_KEYS.EVENTS, e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleEdit = (id: string, field: keyof EventItem, value: string) => {
    updateStorageArray<EventItem>(
      STORAGE_KEYS.EVENTS,
      e => e.id === id,
      e => ({ ...e, [field]: value })
    );
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="couple-manage-events-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("manageEvents")}</h1>

      {/* Add Event Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
        <input
          type="text"
          placeholder={t("eventName")}
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder={t("location")}
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> {t("addEvent")}
        </button>
      </div>

      {/* Event List */}
      {events.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noEventsAdded")}</p>
      ) : (
        <ul className="space-y-3">
          {events.map(e => {
            const isLocked = e.status === "locked";
            return (
              <li
                key={e.id}
                className="bg-white p-3 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-2 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                  <input
                    type="text"
                    value={e.name}
                    disabled={isLocked}
                    onChange={ev => handleEdit(e.id, "name", ev.target.value)}
                    className={`font-semibold text-lg w-full border-b pb-1 mb-1 md:mb-0 ${
                      isLocked ? "bg-gray-100" : ""
                    }`}
                  />
                  <input
                    type="date"
                    value={e.date}
                    disabled={isLocked}
                    onChange={ev => handleEdit(e.id, "date", ev.target.value)}
                    className={`text-gray-500 text-sm w-full border-b pb-1 mb-1 md:mb-0 ${
                      isLocked ? "bg-gray-100" : ""
                    }`}
                  />
                  <input
                    type="text"
                    value={e.location}
                    disabled={isLocked}
                    onChange={ev => handleEdit(e.id, "location", ev.target.value)}
                    className={`text-gray-500 text-sm w-full border-b pb-1 ${
                      isLocked ? "bg-gray-100" : ""
                    }`}
                  />
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={isLocked}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-white ${
                      isLocked
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    <Trash2 size={14} /> {t("delete")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CoupleManageEvents;
