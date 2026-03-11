import React, { useEffect, useMemo, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
} from "../utils/StorageUtils";
import { Clock, Plus, CalendarDays, PartyPopper } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ProtocolAgenda.css";

/* ---------------- Types ---------------- */

export type AgendaItem = {
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

const ProtocolAgenda: React.FC = () => {
  const { t } = useAppSettings();

  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState("");
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");

  /* -------- Load data -------- */
  useEffect(() => {
    setAgenda(getFromStorage<AgendaItem[]>(STORAGE_KEYS.AGENDA, []));
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  /* -------- Protocol can use only approved/locked events -------- */
  const usableEvents = useMemo(
    () => events.filter(e => e.status !== "draft"),
    [events]
  );

  /* -------- Add Agenda Item -------- */
  const addAgendaItem = () => {
    if (!eventId || !time.trim() || !activity.trim()) {
      alert(t("fillAllAgendaFields"));
      return;
    }

    const newItem: AgendaItem = {
      id: crypto.randomUUID(),
      eventId,
      time: time.trim(),
      activity: activity.trim(),
    };

    addToStorageArray(STORAGE_KEYS.AGENDA, newItem);
    setAgenda(prev => [...prev, newItem]);

    setEventId("");
    setTime("");
    setActivity("");
  };

  /* -------- Resolve Event Name -------- */
  const getEventName = (id: string) =>
    events.find(e => e.id === id)?.name || t("unknownEvent");

  /* -------- UI -------- */
  return (
    <div className="protocol-agenda-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PartyPopper className="h-6 w-6 text-purple-600" />
        {t("eventAgenda")}
      </h1>

      {/* -------- Add Agenda Form -------- */}
      <div className="agenda-form grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
        {/* Event Select */}
        <select
          value={eventId}
          onChange={e => setEventId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">{t("selectEvent")}</option>
          {usableEvents.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
            </option>
          ))}
        </select>

        {/* Time */}
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Activity */}
        <input
          type="text"
          placeholder={t("agendaActivityPlaceholder")}
          value={activity}
          onChange={e => setActivity(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Add Button */}
        <button
          onClick={addAgendaItem}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("addAgenda")}
        </button>
      </div>

      {/* -------- Agenda List -------- */}
      {agenda.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noAgendaItems")}
        </p>
      ) : (
        <ul className="agenda-list space-y-3">
          {agenda.map(item => (
            <li
              key={item.id}
              className="agenda-card flex items-center gap-4 p-4 bg-white rounded shadow hover:shadow-lg transition"
            >
              <Clock className="h-6 w-6 text-blue-500" />

              <div className="flex-1">
                <p className="font-semibold">{item.activity}</p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4" />
                {getEventName(item.eventId)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProtocolAgenda;
