// src/Vendor/VendorManageServices.tsx
import React, { useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
} from "../utils/StorageUtils";
import { PackagePlus } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./VendorManageServices.css";

type Service = {
  id: string;
  name: string;
  description: string;
};

type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: "draft" | "approved" | "locked";
};

type AssignedService = {
  id: string;
  eventId: string;
  serviceId: string;
};

const VendorManageServices: React.FC = () => {
  const { t } = useAppSettings(); // translation function
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [assigned, setAssigned] = useState<AssignedService[]>([]);

  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  useEffect(() => {
    setServices(getFromStorage<Service[]>(STORAGE_KEYS.VENDORS_SERVICES, []));
    setEvents(
      getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []).filter(
        (e) => e.status !== "draft"
      )
    );
    setAssigned(
      getFromStorage<AssignedService[]>(STORAGE_KEYS.VENDOR_ASSIGNMENTS, [])
    );
  }, []);

  const assignService = () => {
    if (!selectedService || !selectedEvent) {
      return alert(t("selectServiceAndEvent"));
    }

    const newAssignment: AssignedService = {
      id: Date.now().toString(),
      eventId: selectedEvent,
      serviceId: selectedService,
    };

    addToStorageArray(STORAGE_KEYS.VENDOR_ASSIGNMENTS, newAssignment);
    setAssigned((prev) => [...prev, newAssignment]);

    setSelectedService("");
    setSelectedEvent("");
  };

  const getService = (id: string) => services.find((s) => s.id === id);
  const getEvent = (id: string) => events.find((e) => e.id === id);

  return (
    <div className="vendor-services-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("manageAssignServices")}</h1>

      {/* Assign Service Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">{t("selectService")}</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

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

        <button
          onClick={assignService}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <PackagePlus className="h-4 w-4" /> {t("assign")}
        </button>
      </div>

      {/* Assigned Services List */}
      {assigned.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noServicesAssigned")}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assigned.map((a) => {
            const service = getService(a.serviceId);
            const event = getEvent(a.eventId);
            if (!service || !event) return null;

            return (
              <li
                key={a.id}
                className="service-card p-4 bg-white rounded shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-gray-500 text-sm">
                  {service.description || t("noDescription")}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {t("assignedTo")}: <strong>{event.name}</strong> {t("on")}{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default VendorManageServices;
