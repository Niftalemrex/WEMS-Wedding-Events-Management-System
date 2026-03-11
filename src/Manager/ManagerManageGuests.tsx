import React, { useState, useEffect, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2, Plus } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerManageGuests.css";

export type GuestItem = {
  id: string;
  name: string;
  email: string;
  eventId: string;
  rsvp?: boolean; // controlled by attendee
};

export type EventItem = {
  id: string;
  name: string;
};

const ManagerManageGuests: React.FC = () => {
  const { t } = useAppSettings();
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [search, setSearch] = useState("");

  // Load data
  useEffect(() => {
    setGuests(getFromStorage<GuestItem[]>(STORAGE_KEYS.GUESTS, []));
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  // Add guest
  const handleAdd = () => {
    if (!name.trim() || !email.trim() || !eventId.trim()) return alert(t("allFieldsRequired"));
    if (!events.some((e) => e.id === eventId)) return alert(t("invalidEventId"));

    const newGuest: GuestItem = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      eventId: eventId.trim(),
      rsvp: false,
    };

    addToStorageArray(STORAGE_KEYS.GUESTS, newGuest);
    setGuests((prev) => [...prev, newGuest]);
    setName("");
    setEmail("");
    setEventId("");
  };

  // Update guest (only name/email, RSVP read-only for manager)
  const handleUpdate = (id: string, field: keyof GuestItem, value: string) => {
    if (field === "eventId" && !events.some((e) => e.id === value)) return alert(t("invalidEventId"));
    updateStorageArray<GuestItem>(
      STORAGE_KEYS.GUESTS,
      (g) => g.id === id,
      (g) => ({ ...g, [field]: value })
    );
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  // Delete guest
  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirmDeleteGuest"))) return;
    deleteFromStorageArray<GuestItem>(STORAGE_KEYS.GUESTS, (g) => g.id === id);
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  // Group guests by event
  const guestsByEvent = useMemo(() => {
    const map: Record<string, GuestItem[]> = {};
    events.forEach((ev) => (map[ev.id] = []));
    guests.forEach((g) => {
      if (!map[g.eventId]) map[g.eventId] = [];
      map[g.eventId].push(g);
    });
    return map;
  }, [guests, events]);

  return (
    <div className="manager-guests-container p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("manageGuests")}</h1>

      {/* Add Guest */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <input
          type="text"
          placeholder={t("guestName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          placeholder={t("guestEmail")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">{t("selectEvent")}</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
        >
          <Plus className="h-4 w-4" /> {t("addGuest")}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t("searchGuests")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      {/* Guest Cards by Event */}
      {events.map((ev) => {
        const filteredGuests = (guestsByEvent[ev.id] || []).filter(
          (g) =>
            g.name.toLowerCase().includes(search.toLowerCase()) ||
            g.email.toLowerCase().includes(search.toLowerCase())
        );

        return (
          <div key={ev.id} className="event-card mb-6 p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">{ev.name}</h2>
            {filteredGuests.length === 0 ? (
              <p className="text-gray-500">{t("noGuestsForEvent")}</p>
            ) : (
              <ul className="space-y-2">
                {filteredGuests.map((g) => (
                  <li
                    key={g.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 rounded shadow"
                  >
                    <div className="flex-1 space-y-1 md:space-y-0 md:flex md:items-center md:gap-4">
                      <input
                        type="text"
                        value={g.name}
                        onChange={(ev) => handleUpdate(g.id, "name", ev.target.value)}
                        className="border p-1 rounded w-full md:w-48"
                      />
                      <input
                        type="email"
                        value={g.email}
                        onChange={(ev) => handleUpdate(g.id, "email", ev.target.value)}
                        className="border p-1 rounded w-full md:w-48"
                      />
                      <span className="w-full md:w-32">
                        {t("rsvp")}: {g.rsvp ? t("yes") : t("no")}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="mt-2 md:mt-0 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> {t("delete")}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ManagerManageGuests;
