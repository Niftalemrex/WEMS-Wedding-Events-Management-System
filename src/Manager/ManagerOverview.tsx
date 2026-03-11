// src/Manager/ManagerOverview.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  deleteFromStorageArray,
} from "../utils/StorageUtils";

import type { EventItem } from "./ManagerManageEvents";
import type { GuestItem } from "./ManagerManageGuests";
import type { VendorAssignment } from "./ManagerVendorCoordination";

import { Trash2, Calendar, Users, Truck } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerOverview.css";

const ManagerOverview: React.FC = () => {
  const { t } = useAppSettings();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [vendors, setVendors] = useState<VendorAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
    setGuests(getFromStorage<GuestItem[]>(STORAGE_KEYS.GUESTS, []));
    setVendors(getFromStorage<VendorAssignment[]>(STORAGE_KEYS.VENDORS, []));
  }, []);

  const deleteEvent = (id: string) => {
    if (!window.confirm(t("confirmDeleteEvent"))) return;

    deleteFromStorageArray<EventItem>(STORAGE_KEYS.EVENTS, (e) => e.id === id);
    setEvents(events.filter((e) => e.id !== id));
  };

  const filteredEvents = useMemo(
    () =>
      events
        .filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase())
        )
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [events, search]
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="manager-overview-container p-4">
      <h1 className="text-2xl font-bold mb-6">{t("managerOverview")}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={t("totalEvents")}
          value={events.length}
          icon={<Calendar className="h-5 w-5" />}
          subtitle={`${events.filter(e => new Date(e.date) >= new Date()).length} ${t("upcoming")}`}
          color="blue"
        />
        <StatCard
          title={t("totalGuests")}
          value={guests.length}
          icon={<Users className="h-5 w-5" />}
          subtitle={t("acrossAllEvents")}
          color="green"
        />
        <StatCard
          title={t("vendorAssignments")}
          value={vendors.length}
          icon={<Truck className="h-5 w-5" />}
          subtitle={t("activeAssignments")}
          color="purple"
        />
        <StatCard
          title={t("avgGuestsPerEvent")}
          value={events.length > 0 ? Math.round(guests.length / events.length) : 0}
          icon={<Users className="h-5 w-5" />}
          subtitle={t("averageAttendance")}
          color="orange"
        />
      </div>

      {/* Events Section */}
      <div className="section mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("events")}</h2>
        <input
          type="text"
          placeholder={t("searchEvents")}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="border rounded p-2 w-full mb-4"
        />
        {filteredEvents.length === 0 ? (
          <p className="text-gray-500 text-center">{t("noEventsFound")}</p>
        ) : (
          <ul className="space-y-2">
            {filteredEvents.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
              >
                <div>
                  <strong>{e.name}</strong> — {formatDate(e.date)} — {e.location}
                </div>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={() => deleteEvent(e.id)}
                  disabled={deletingId === e.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Guests */}
      <div className="section mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("recentGuests")}</h2>
        <ul className="space-y-2">
          {guests.slice(0, 5).map((g) => (
            <li key={g.id} className="p-2 bg-gray-50 rounded">
              {g.name} ({t("event")}: {events.find((e) => e.id === g.eventId)?.name || g.eventId})
            </li>
          ))}
          {guests.length === 0 && <p className="text-gray-500">{t("noGuestsFound")}</p>}
        </ul>
      </div>

      {/* Recent Vendor Assignments */}
      <div className="section">
        <h2 className="text-xl font-semibold mb-2">{t("vendorAssignments")}</h2>
        <ul className="space-y-2">
          {vendors.slice(0, 5).map((v) => (
            <li key={v.id} className="p-2 bg-gray-50 rounded">
              {v.vendorName} {t("assignedTo")}{" "}
              {events.find((e) => e.id === v.eventId)?.name || v.eventId}
            </li>
          ))}
          {vendors.length === 0 && (
            <p className="text-gray-500">{t("noVendorAssignmentsFound")}</p>
          )}
        </ul>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle: string;
  color: "blue" | "green" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <div className={`border ${colorClasses[color]} p-4 rounded`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm uppercase">{title}</h3>
        <div className={`p-2 rounded-full ${colorClasses[color]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold mb-1">{value.toLocaleString()}</p>
      <p className="text-sm opacity-80">{subtitle}</p>
    </div>
  );
};

export default ManagerOverview;
