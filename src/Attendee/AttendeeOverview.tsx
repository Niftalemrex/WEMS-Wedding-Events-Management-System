import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { Calendar, CheckCircle, Armchair, Gift } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // translation hook
import "./AttendeeOverview.css";

type RSVP = { id: string };
type Seat = { id: string };
type GiftRegistryItem = { id: string };
type EventInfo = { id: string };

const AttendeeOverview: React.FC = () => {
  const { t } = useAppSettings();

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [gifts, setGifts] = useState<GiftRegistryItem[]>([]);
  const [events, setEvents] = useState<EventInfo[]>([]);

  /* ---------------- Load attendee-related data ---------------- */
  useEffect(() => {
    setRsvps(getFromStorage<RSVP[]>(STORAGE_KEYS.RSVP, []));
    setSeats(getFromStorage<Seat[]>(STORAGE_KEYS.SEATS, []));
    setGifts(getFromStorage<GiftRegistryItem[]>(STORAGE_KEYS.GIFT_REGISTRY, []));
    setEvents(getFromStorage<EventInfo[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  return (
    <div className="attendee-overview-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("attendeeOverview")}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="overview-card">
          <Calendar className="icon text-blue-500" />
          <div>
            <p className="label">{t("events")}</p>
            <p className="value">{events.length}</p>
          </div>
        </div>

        <div className="overview-card">
          <CheckCircle className="icon text-green-500" />
          <div>
            <p className="label">{t("rsvps")}</p>
            <p className="value">{rsvps.length}</p>
          </div>
        </div>

        <div className="overview-card">
          <Armchair className="icon text-purple-500" />
          <div>
            <p className="label">{t("seatAssignments")}</p>
            <p className="value">{seats.length}</p>
          </div>
        </div>

        <div className="overview-card">
          <Gift className="icon text-pink-500" />
          <div>
            <p className="label">{t("giftRegistry")}</p>
            <p className="value">{gifts.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeOverview;
