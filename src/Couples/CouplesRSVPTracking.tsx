import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage, updateStorageArray, addToStorageArray } from "../utils/StorageUtils";
import { CheckCircle, XCircle } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesRSVPTracking.css";

export type GuestType = "family" | "vip" | "normal";

export type Guest = {
  id: string;
  name: string;
  email: string;
  type?: GuestType;
  rsvp?: boolean;
};

type RSVP = { id: string; guestId: string; status: boolean };

const CoupleRSVPTracking: React.FC = () => {
  const { t } = useAppSettings();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

  useEffect(() => {
    const storedGuests = getFromStorage<Guest[]>(STORAGE_KEYS.GUESTS, []).map(g => ({
      ...g,
      type: g.type ?? "normal",
      rsvp: g.rsvp ?? false,
    }));
    setGuests(storedGuests);

    const storedRSVP = getFromStorage<RSVP[]>(STORAGE_KEYS.RSVP, []);
    setRsvps(storedRSVP);
  }, []);

  useEffect(() => {
    guests.forEach(g => {
      if (!rsvps.find(r => r.guestId === g.id)) {
        const newRSVP: RSVP = { id: Date.now().toString() + g.id, guestId: g.id, status: g.rsvp || false };
        addToStorageArray(STORAGE_KEYS.RSVP, newRSVP);
        setRsvps(prev => [...prev, newRSVP]);
      }
    });
  }, [guests]);

  const toggleRSVP = (guestId: string) => {
    const updatedRSVPs = rsvps.map(r =>
      r.guestId === guestId ? { ...r, status: !r.status } : r
    );
    updateStorageArray<RSVP>(STORAGE_KEYS.RSVP, r => r.guestId === guestId, r => ({ ...r, status: !r.status }));
    setRsvps(updatedRSVPs);

    updateStorageArray<Guest>(STORAGE_KEYS.GUESTS, g => g.id === guestId, g => ({ ...g, rsvp: !g.rsvp }));
    setGuests(prev => prev.map(g => (g.id === guestId ? { ...g, rsvp: !g.rsvp } : g)));
  };

  return (
    <div className="rsvp-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <CheckCircle className="h-6 w-6 text-green-500" /> {t("rsvpTracking")}
      </h1>

      {guests.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noGuests")}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guests.map(guest => {
            const rsvpStatus = rsvps.find(r => r.guestId === guest.id)?.status ?? false;
            const type = guest.type ?? "normal";

            return (
              <li
                key={guest.id}
                className="rsvp-card flex justify-between items-center p-4 bg-white rounded shadow hover:shadow-lg cursor-pointer transition"
                onClick={() => toggleRSVP(guest.id)}
              >
                <div>
                  <p className="font-semibold">{guest.name}</p>
                  <p className="text-gray-500 text-sm">{guest.email}</p>
                  <p className="text-sm mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-white ${
                        type === "vip" ? "bg-yellow-500" :
                        type === "family" ? "bg-green-600" : "bg-gray-500"
                      }`}
                    >
                      {type.toUpperCase()}
                    </span>
                  </p>
                </div>
                <button
                  className={`flex items-center gap-1 px-3 py-1 rounded ${
                    rsvpStatus
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  {rsvpStatus ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {rsvpStatus ? t("attending") : t("pending")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CoupleRSVPTracking;
