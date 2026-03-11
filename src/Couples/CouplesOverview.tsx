import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { Users, Calendar, Briefcase } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesOverview.css";

type EventItem = { id: string; name: string; date: string };
type Guest = { id: string; eventId: string; name: string };
type Vendor = { id: string; name: string; services?: string[] };

const CoupleOverview: React.FC = () => {
  const { t } = useAppSettings(); // multi-language translation function
  const [events, setEvents] = useState<EventItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
    setGuests(getFromStorage<Guest[]>(STORAGE_KEYS.GUESTS, []));
    setVendors(getFromStorage<Vendor[]>(STORAGE_KEYS.VENDORS, []));
  }, []);

  return (
    <div className="couple-overview-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("coupleOverview")}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="overview-card flex items-center gap-3 p-4 rounded shadow hover:shadow-lg transition bg-white">
          <Calendar className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-gray-500">{t("totalEvents")}</p>
            <p className="text-xl font-bold">{events.length}</p>
          </div>
        </div>

        <div className="overview-card flex items-center gap-3 p-4 rounded shadow hover:shadow-lg transition bg-white">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-gray-500">{t("totalGuests")}</p>
            <p className="text-xl font-bold">{guests.length}</p>
          </div>
        </div>

        <div className="overview-card flex items-center gap-3 p-4 rounded shadow hover:shadow-lg transition bg-white">
          <Briefcase className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-gray-500">{t("totalVendors")}</p>
            <p className="text-xl font-bold">{vendors.length}</p>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">{t("events")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {events.map((e) => (
              <li key={e.id}>
                {e.name} - {new Date(e.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t("guests")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {guests.map((g) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t("vendors")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {vendors.map((v) => (
              <li key={v.id}>
                {v.name} {v.services?.length ? `(${v.services.join(", ")})` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoupleOverview;
