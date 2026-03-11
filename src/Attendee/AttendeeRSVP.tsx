// src/Attendee/AttendeeRSVP.tsx
import React, { useEffect, useState, useMemo } from "react";
import { STORAGE_KEYS, getFromStorage, updateStorageArray } from "../utils/StorageUtils";
import { CheckCircle, XCircle } from "lucide-react";
import "./AttendeeRSVP.css";

export type GuestItem = {
  id: string;
  name: string;
  email: string;
  eventId: string;
  rsvp?: boolean; // shared with manager
};

export type EventItem = {
  id: string;
  name: string;
};

interface AttendeeRSVPProps {
  userEmail?: string;
}

const AttendeeRSVP: React.FC<AttendeeRSVPProps> = ({ userEmail }) => {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  // Load data
  useEffect(() => {
    setGuests(getFromStorage<GuestItem[]>(STORAGE_KEYS.GUESTS, []));
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
  }, []);

  // Safety guard
  if (!userEmail) {
    return <p className="text-center text-gray-500 mt-10">Loading invitations…</p>;
  }

  // Invitations for this attendee
  const myInvitations = useMemo(() => {
    const safeEmail = userEmail.toLowerCase();
    return guests.filter(
      g => (g.email || "").toLowerCase() === safeEmail
    );
  }, [guests, userEmail]);

  // Group by event
  const groupedByEvent = useMemo(() => {
    const map: Record<string, GuestItem[]> = {};
    myInvitations.forEach(g => {
      if (!map[g.eventId]) map[g.eventId] = [];
      map[g.eventId].push(g);
    });
    return map;
  }, [myInvitations]);

  // RSVP toggle (THIS is the shared state)
  const setRSVP = (guestId: string, value: boolean) => {
    setGuests(prev =>
      prev.map(g => (g.id === guestId ? { ...g, rsvp: value } : g))
    );

    updateStorageArray<GuestItem>(
      STORAGE_KEYS.GUESTS,
      g => g.id === guestId,
      g => ({ ...g, rsvp: value })
    );
  };

  return (
    <div className="attendee-rsvp-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Invitations</h1>

      {myInvitations.length === 0 ? (
        <p className="text-gray-500 text-center">
          No invitations found for {userEmail}.
        </p>
      ) : (
        Object.entries(groupedByEvent).map(([eventId, eventGuests]) => {
          const eventName =
            events.find(e => e.id === eventId)?.name || "Event";

          return (
            <div key={eventId} className="mb-6">
              <h2 className="text-xl font-semibold mb-3">{eventName}</h2>

              <ul className="space-y-3">
                {eventGuests.map(g => (
                  <li
                    key={g.id}
                    className="flex justify-between items-center bg-white p-4 rounded shadow"
                  >
                    <div>
                      <strong>{g.name}</strong>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        {g.rsvp === true
                          ? "Attending"
                          : g.rsvp === false
                          ? "Not Attending"
                          : "No Response"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setRSVP(g.id, true)}
                        className={`px-3 py-1 rounded flex items-center gap-1 ${
                          g.rsvp
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 hover:bg-green-100"
                        }`}
                      >
                        <CheckCircle size={16} /> Attend
                      </button>

                      <button
                        onClick={() => setRSVP(g.id, false)}
                        className={`px-3 py-1 rounded flex items-center gap-1 ${
                          g.rsvp === false
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 hover:bg-red-100"
                        }`}
                      >
                        <XCircle size={16} /> Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AttendeeRSVP;
