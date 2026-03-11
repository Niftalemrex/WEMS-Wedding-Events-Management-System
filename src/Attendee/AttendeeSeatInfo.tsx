import React, { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { Armchair } from "lucide-react";
import "./AttendeeSeatInfo.css";

type Seat = {
  id: string;
  guestId: string;
  seatNumber: string;
  rowNumber: number;
};

type Guest = {
  id: string;
  name: string;
  email: string;
  type?: "normal" | "vip" | "family";
  rsvp?: boolean;
};

interface AttendeeSeatInfoProps {
  userEmail?: string;
}

const AttendeeSeatInfo: React.FC<AttendeeSeatInfoProps> = ({ userEmail }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  /* -------- Load data -------- */
  useEffect(() => {
    setSeats(getFromStorage<Seat[]>(STORAGE_KEYS.SEATS, []));
    setGuests(getFromStorage<Guest[]>(STORAGE_KEYS.GUESTS, []));
  }, []);

  /* -------- Safety -------- */
  if (!userEmail) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading seat information…
      </p>
    );
  }

  /* -------- Find my guest record -------- */
  const myGuest = useMemo(() => {
    const email = userEmail.toLowerCase();
    return guests.find(
      g => (g.email || "").toLowerCase() === email && g.rsvp
    );
  }, [guests, userEmail]);

  /* -------- Find my seat -------- */
  const mySeat = useMemo(() => {
    if (!myGuest) return null;
    return seats.find(s => s.guestId === myGuest.id) || null;
  }, [seats, myGuest]);

  /* -------- UI -------- */
  if (!myGuest) {
    return (
      <p className="empty-text text-center mt-10">
        You have not confirmed attendance or no seat assigned yet.
      </p>
    );
  }

  if (!mySeat) {
    return (
      <p className="empty-text text-center mt-10">
        Your seat will appear once the organizer assigns it.
      </p>
    );
  }

  return (
    <div className="attendee-seat-container p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Armchair /> My Seat Information
      </h1>

      <div className="seat-card">
        <div className="seat-info">
          <Armchair className="seat-icon" />
          <div>
            <p className="guest-name">{myGuest.name}</p>
            <p className="seat-type">
              Type: <strong>{myGuest.type || "normal"}</strong>
            </p>
          </div>
        </div>

        <div className="seat-details">
          <div>
            Table <span>{mySeat.rowNumber}</span>
          </div>
          <div>
            Seat <span>{mySeat.seatNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeSeatInfo;
