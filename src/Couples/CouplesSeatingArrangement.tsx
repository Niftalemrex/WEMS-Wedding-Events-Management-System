import React, { useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
} from "../utils/StorageUtils";
import { Plus, LayoutGrid } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesSeatingArrangement.css";
import type { Guest } from "./CouplesGuestList";

type Seat = {
  id: string;
  guestId: string;
  seatNumber: string;
  rowNumber: number;
};

const MAX_PER_TABLE = 8;

const CoupleSeatingArrangement: React.FC = () => {
  const { t } = useAppSettings();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [rowNumber, setRowNumber] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<Guest["type"]>("normal");

  useEffect(() => {
    const storedSeats = getFromStorage<Seat[]>(STORAGE_KEYS.SEATS, []);
    setSeats(storedSeats);

    const acceptedGuests = getFromStorage<Guest[]>(STORAGE_KEYS.GUESTS, []).filter(g => g.rsvp);

    setGuests(
      acceptedGuests.map(g => ({
        ...g,
        type: g.type || "normal",
      }))
    );
  }, []);

  const addSeat = () => {
    if (!selectedGuestId || !seatNumber) return alert(t("fillSeatFields"));

    const rowSeats = seats.filter(s => s.rowNumber === rowNumber);
    if (rowSeats.length >= MAX_PER_TABLE) return alert(t("tableFull"));

    if (rowSeats.some(s => s.seatNumber === seatNumber)) return alert(t("seatNumberAssigned"));

    const newSeat: Seat = {
      id: Date.now().toString(),
      guestId: selectedGuestId,
      seatNumber,
      rowNumber,
    };

    addToStorageArray(STORAGE_KEYS.SEATS, newSeat);
    setSeats(prev => [...prev, newSeat]);

    updateStorageArray<Guest>(
      STORAGE_KEYS.GUESTS,
      g => g.id === selectedGuestId,
      g => ({ ...g, type: selectedType })
    );

    setGuests(prev =>
      prev.map(g => (g.id === selectedGuestId ? { ...g, type: selectedType } : g))
    );

    setSelectedGuestId("");
    setSeatNumber("");
    setRowNumber(1);
    setSelectedType("normal");
  };

  const getGuest = (id: string) => guests.find(g => g.id === id);

  const tables = seats.reduce<Record<number, Seat[]>>((acc, seat) => {
    if (!acc[seat.rowNumber]) acc[seat.rowNumber] = [];
    acc[seat.rowNumber].push(seat);
    return acc;
  }, {});

  const getTypeColor = (type?: string) => {
    if (type === "vip") return "bg-yellow-200";
    if (type === "family") return "bg-green-200";
    return "bg-gray-200";
  };

  const availableGuests = guests.filter(g => !seats.some(s => s.guestId === g.id));

  return (
    <div className="p-4 max-w-6xl mx-auto couple-seating-container">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <LayoutGrid className="h-6 w-6 text-purple-500" /> {t("seatingArrangement")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <select
          value={selectedGuestId}
          onChange={e => setSelectedGuestId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">{t("selectGuest")}</option>
          {availableGuests.map(g => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={t("seatNumber")}
          value={seatNumber}
          onChange={e => setSeatNumber(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          min={1}
          placeholder={t("rowNumber")}
          value={rowNumber}
          onChange={e => setRowNumber(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as Guest["type"])}
          className="border p-2 rounded"
        >
          <option value="normal">{t("normal")}</option>
          <option value="vip">{t("vip")}</option>
          <option value="family">{t("family")}</option>
        </select>

        <button
          onClick={addSeat}
          className="md:col-span-4 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> {t("assignSeat")}
        </button>
      </div>

      {Object.entries(tables).map(([row, tableSeats]) => (
        <div key={row} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {t("table")} {row}
          </h2>

          <table className="w-full border-collapse shadow rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-300">
                <th className="border p-2">{t("guest")}</th>
                <th className="border p-2">{t("seat")}</th>
                <th className="border p-2">{t("type")}</th>
              </tr>
            </thead>
            <tbody>
              {tableSeats.map(seat => {
                const guest = getGuest(seat.guestId);
                if (!guest) return null;

                return (
                  <tr key={seat.id} className={getTypeColor(guest.type)}>
                    <td className="border p-2">{guest.name}</td>
                    <td className="border p-2">{seat.seatNumber}</td>
                    <td className="border p-2 uppercase font-semibold">{t(guest.type)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {seats.length === 0 && <p className="text-center text-gray-500">{t("noSeatsAssigned")}</p>}
    </div>
  );
};

export default CoupleSeatingArrangement;
