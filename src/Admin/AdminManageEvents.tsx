// AdminManageEvents.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2, Plus, Edit, Save, X } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminManageEvents.css";

export type EventStatus = "draft" | "approved" | "locked";

export type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
};

const AdminManageEvents: React.FC = () => {
  const { t } = useAppSettings();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ name: string; date: string; location: string }>({
    name: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    const stored = getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []);
    const updated = stored.map(e => ({ ...e, status: e.status || "draft" }));
    setEvents(updated);
  }, []);

  const addEvent = () => {
    if (!name.trim() || !date || !location.trim()) {
      alert(t("eventFillAll"));
      return;
    }

    const newEvent: EventItem = {
      id: Date.now().toString(),
      name: name.trim(),
      date,
      location: location.trim(),
      status: "draft",
    };

    addToStorageArray(STORAGE_KEYS.EVENTS, newEvent);
    setEvents(prev => [...prev, newEvent]);
    setName("");
    setDate("");
    setLocation("");
  };

  const startEditing = (event: EventItem) => {
    if (event.status === "locked") {
      alert(t("eventLockedEdit"));
      return;
    }
    setEditingId(event.id);
    setEditFields({
      name: event.name,
      date: event.date,
      location: event.location,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFields({ name: "", date: "", location: "" });
  };

  const saveEditing = (id: string) => {
    if (!editFields.name.trim() || !editFields.date || !editFields.location.trim()) {
      alert(t("eventFillAll"));
      return;
    }

    updateStorageArray<EventItem>(
      STORAGE_KEYS.EVENTS,
      e => e.id === id,
      e => ({ ...e, ...editFields })
    );

    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...editFields } : e)));
    cancelEditing();
  };

  const deleteEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;

    if (event.status === "locked") {
      alert(t("eventLockedDelete"));
      return;
    }

    if (!window.confirm(t("confirmDeleteEvent"))) return;

    deleteFromStorageArray<EventItem>(STORAGE_KEYS.EVENTS, e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const toggleStatus = (id: string) => {
    updateStorageArray<EventItem>(
      STORAGE_KEYS.EVENTS,
      e => e.id === id,
      e => {
        const nextStatus: EventStatus =
          e.status === "draft"
            ? "approved"
            : e.status === "approved"
            ? "locked"
            : "draft";
        return { ...e, status: nextStatus };
      }
    );

    setEvents(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              status:
                e.status === "draft"
                  ? "approved"
                  : e.status === "approved"
                  ? "locked"
                  : "draft",
            }
          : e
      )
    );
  };

  const filteredEvents = useMemo(
    () =>
      events.filter(
        e =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.date.includes(search) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      ),
    [events, search]
  );

  return (
    <div className="admin-manage-events-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {t("adminManageEvents")}
      </h1>

      {/* Add Event */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("addEvent")}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t("searchEvents")}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Event List */}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noEventsFound")}
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredEvents.map(e => (
            <li
              key={e.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-3 rounded shadow hover:bg-gray-100 transition gap-2"
            >
              {editingId === e.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={editFields.name}
                    onChange={ev => setEditFields(prev => ({ ...prev, name: ev.target.value }))}
                    className="border p-1 rounded flex-1"
                  />
                  <input
                    type="date"
                    value={editFields.date}
                    onChange={ev => setEditFields(prev => ({ ...prev, date: ev.target.value }))}
                    className="border p-1 rounded w-32"
                  />
                  <input
                    type="text"
                    value={editFields.location}
                    onChange={ev =>
                      setEditFields(prev => ({ ...prev, location: ev.target.value }))
                    }
                    className="border p-1 rounded flex-1"
                  />
                  <button className="bg-blue-600 text-white px-3 py-1 rounded">
                    <Save className="h-4 w-4" /> {t("save")}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    <X className="h-4 w-4" /> {t("cancel")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 justify-between items-center w-full gap-2">
                  <span>
                    <strong>{e.name}</strong> ({e.date}) – {e.location}
                    <span className="ml-2 px-2 py-1 rounded text-xs text-white bg-gray-600">
                      {t(`eventStatus_${e.status}`)}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                      <Edit className="h-4 w-4" /> {t("edit")}
                    </button>
                    <button
                      onClick={() => deleteEvent(e.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 className="h-4 w-4" /> {t("delete")}
                    </button>
                    <button
                      onClick={() => toggleStatus(e.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      {t("toggleStatus")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminManageEvents;
