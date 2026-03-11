import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2, Plus } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerVendorCoordination.css";

export type VendorAssignment = {
  id: string;
  eventId: string;
  vendorName: string;
  service: string;
};

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: "draft" | "approved" | "locked";
};

type ServiceItem = {
  id: string;
  name: string;
};

const ManagerVendorCoordination: React.FC = () => {
  const { t } = useAppSettings();
  const [assignments, setAssignments] = useState<VendorAssignment[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [search, setSearch] = useState("");

  /* ---------------- Load assignments, events, services ---------------- */
  useEffect(() => {
    setAssignments(
      getFromStorage<VendorAssignment[]>(STORAGE_KEYS.VENDOR_ASSIGNMENTS, [])
    );

    setEvents(
      getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []).filter(
        (e) => e.status !== "draft"
      )
    );

    setServices(getFromStorage<ServiceItem[]>(STORAGE_KEYS.VENDORS_SERVICES, []));
  }, []);

  /* ---------------- Add new assignment ---------------- */
  const handleAdd = () => {
    if (!selectedEvent || !vendorName || !selectedService) return alert(t("allFieldsRequired"));

    const newAssign: VendorAssignment = {
      id: Date.now().toString(),
      eventId: selectedEvent,
      vendorName,
      service: selectedService,
    };

    addToStorageArray(STORAGE_KEYS.VENDOR_ASSIGNMENTS, newAssign);
    setAssignments((prev) => [...prev, newAssign]);

    setSelectedEvent("");
    setVendorName("");
    setSelectedService("");
  };

  /* ---------------- Update assignment ---------------- */
  const handleUpdate = (
    id: string,
    field: keyof VendorAssignment,
    value: string
  ) => {
    updateStorageArray<VendorAssignment>(
      STORAGE_KEYS.VENDOR_ASSIGNMENTS,
      (v) => v.id === id,
      (v) => ({ ...v, [field]: value })
    );
    setAssignments((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  /* ---------------- Delete assignment ---------------- */
  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirmRemoveVendor"))) return;

    deleteFromStorageArray<VendorAssignment>(
      STORAGE_KEYS.VENDOR_ASSIGNMENTS,
      (v) => v.id === id
    );
    setAssignments((prev) => prev.filter((v) => v.id !== id));
  };

  /* ---------------- Filtered & sorted assignments ---------------- */
  const filteredAssignments = useMemo(
    () =>
      assignments
        .filter(
          (v) =>
            (v.vendorName ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (v.service ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (events.find((e) => e.id === v.eventId)?.name ?? "")
              .toLowerCase()
              .includes(search.toLowerCase())
        )
        .sort((a, b) => (a.vendorName ?? "").localeCompare(b.vendorName ?? "")),
    [assignments, search, events]
  );

  return (
    <div className="manager-vendor-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("vendorCoordination")}</h1>

      {/* Add Vendor Form */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">{t("selectEvent")}</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({new Date(e.date).toLocaleDateString()})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={t("vendorName")}
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">{t("selectService")}</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1 justify-center"
          disabled={!selectedEvent || !vendorName || !selectedService}
        >
          <Plus className="h-4 w-4" /> {t("assignVendor")}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={t("searchAssignments")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noVendorAssignments")}</p>
      ) : (
        <ul className="space-y-3">
          {filteredAssignments.map((v) => {
            const event = events.find((e) => e.id === v.eventId);
            return (
              <li
                key={v.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
              >
                <div className="flex-1 space-y-1 md:space-y-0 md:flex md:items-center md:gap-4">
                  <select
                    value={v.eventId}
                    onChange={(ev) => handleUpdate(v.id, "eventId", ev.target.value)}
                    className="border p-1 rounded w-full md:w-32"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={v.vendorName ?? ""}
                    onChange={(ev) => handleUpdate(v.id, "vendorName", ev.target.value)}
                    className="border p-1 rounded w-full md:w-48"
                  />

                  <select
                    value={v.service ?? ""}
                    onChange={(ev) => handleUpdate(v.id, "service", ev.target.value)}
                    className="border p-1 rounded w-full md:w-48"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(v.id)}
                  className="mt-2 md:mt-0 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" /> {t("remove")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ManagerVendorCoordination;
