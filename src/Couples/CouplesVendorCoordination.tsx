import React, { useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
} from "../utils/StorageUtils";
import { Briefcase, Plus } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesVendorCoordination.css";

type VendorAssignment = {
  id: string;
  vendorName: string;
  eventId: string;
  task?: string;
};

type VendorService = {
  id: string;
  name: string;
};

type EventItem = {
  id: string;
  name: string;
  date?: string;
};

const CoupleVendorCoordination: React.FC = () => {
  const { t } = useAppSettings();

  const [assignments, setAssignments] = useState<VendorAssignment[]>([]);
  const [vendorName, setVendorName] = useState("");
  const [eventId, setEventId] = useState("");
  const [task, setTask] = useState("");

  const [vendorServices, setVendorServices] = useState<VendorService[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  /* ---------------- Load data ---------------- */
  useEffect(() => {
    setAssignments(
      getFromStorage<VendorAssignment[]>(
        STORAGE_KEYS.COUPLE_VENDOR_COORDINATION,
        []
      )
    );

    setVendorServices(
      getFromStorage<VendorService[]>(STORAGE_KEYS.VENDORS_SERVICES, [])
    );

    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  /* ---------------- Add assignment ---------------- */
  const addAssignment = () => {
    if (!vendorName || !eventId) return;

    const newAssignment: VendorAssignment = {
      id: Date.now().toString(),
      vendorName,
      eventId,
      task: task || t("generalTask"),
    };

    addToStorageArray(
      STORAGE_KEYS.COUPLE_VENDOR_COORDINATION,
      newAssignment
    );
    setAssignments((prev) => [...prev, newAssignment]);

    setVendorName("");
    setEventId("");
    setTask("");
  };

  return (
    <div className="vendor-coordination-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("vendorCoordination")}</h1>

      {/* Add Assignment Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
        {/* Vendor Service Dropdown */}
        <select
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">{t("selectVendorService")}</option>
          {vendorServices.map((v) => (
            <option key={v.id} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>

        {/* Event Dropdown */}
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">{t("selectEvent")}</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} {ev.date ? `(${new Date(ev.date).toLocaleDateString()})` : ""}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={t("taskOptional")}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={addAssignment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          disabled={!vendorName || !eventId}
        >
          <Plus className="h-4 w-4" /> {t("addAssignment")}
        </button>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noVendorAssignments")}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((a) => (
            <li
              key={a.id}
              className="assignment-card flex items-center gap-3 p-4 bg-white rounded shadow hover:shadow-lg transition"
            >
              <Briefcase className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-semibold">{a.vendorName}</p>
                <p className="text-gray-500 text-sm">
                  {t("event")}: {events.find((e) => e.id === a.eventId)?.name || a.eventId}
                </p>
                <p className="text-gray-500 text-sm">
                  {t("task")}: {a.task}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoupleVendorCoordination;
