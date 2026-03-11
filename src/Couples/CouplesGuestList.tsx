import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Plus, Users, Trash2, Edit, Save, X } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesGuestList.css";

export type GuestType = "family" | "vip" | "normal";

export type Guest = {
  id: string;
  name: string;
  email: string;
  type: GuestType;
  rsvp?: boolean;
};

export type EventItem = { id: string; name: string };

const CoupleGuestList: React.FC = () => {
  const { t } = useAppSettings();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<GuestType>("normal");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ name: string; email: string; type: GuestType }>({
    name: "",
    email: "",
    type: "normal",
  });

  useEffect(() => {
    const storedGuests = getFromStorage<Guest[]>(STORAGE_KEYS.GUESTS, []).map(g => ({
      ...g,
      type: g.type || "normal",
    }));
    setGuests(storedGuests);
  }, []);

  const addGuest = () => {
    if (!name.trim() || !email.trim()) return alert(t("fillGuestFields"));

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      type,
      rsvp: false,
    };

    addToStorageArray(STORAGE_KEYS.GUESTS, newGuest);
    setGuests(prev => [...prev, newGuest]);
    setName("");
    setEmail("");
    setType("normal");
  };

  const startEditing = (guest: Guest) => {
    setEditingId(guest.id);
    setEditFields({ name: guest.name, email: guest.email, type: guest.type || "normal" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFields({ name: "", email: "", type: "normal" });
  };

  const saveEditing = (id: string) => {
    if (!editFields.name.trim() || !editFields.email.trim()) return alert(t("allFieldsRequired"));

    updateStorageArray<Guest>(
      STORAGE_KEYS.GUESTS,
      g => g.id === id,
      g => ({ ...g, ...editFields })
    );

    setGuests(prev => prev.map(g => (g.id === id ? { ...g, ...editFields } : g)));
    cancelEditing();
  };

  const deleteGuest = (id: string) => {
    if (!window.confirm(t("confirmDeleteGuest"))) return;
    deleteFromStorageArray<Guest>(STORAGE_KEYS.GUESTS, g => g.id === id);
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  const toggleRSVP = (id: string) => {
    updateStorageArray<Guest>(
      STORAGE_KEYS.GUESTS,
      g => g.id === id,
      g => ({ ...g, rsvp: !g.rsvp })
    );
    setGuests(prev => prev.map(g => (g.id === id ? { ...g, rsvp: !g.rsvp } : g)));
  };

  const filteredGuests = useMemo(
    () =>
      guests
        .filter(
          g =>
            g.name.toLowerCase().includes(search.toLowerCase()) ||
            g.email.toLowerCase().includes(search.toLowerCase()) ||
            (g.type || "normal").includes(search.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [guests, search]
  );

  return (
    <div className="couple-guestlist-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-green-500" /> {t("guestList")}
      </h1>

      {/* Add Guest Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder={t("guestName")}
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          placeholder={t("guestEmail")}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value as GuestType)}
          className="border p-2 rounded w-full"
        >
          <option value="normal">{t("normal")}</option>
          <option value="vip">{t("vip")}</option>
          <option value="family">{t("family")}</option>
        </select>
        <button
          onClick={addGuest}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> {t("addGuest")}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t("searchGuests")}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Guest List */}
      {filteredGuests.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noGuestsFound")}</p>
      ) : (
        <ul className="space-y-3">
          {filteredGuests.map(g => {
            const guestType = g.type || "normal";
            return (
              <li
                key={g.id}
                className={`bg-white p-3 rounded shadow flex justify-between items-center hover:shadow-lg transition ${
                  guestType === "vip"
                    ? "border-2 border-yellow-500"
                    : guestType === "family"
                    ? "border-2 border-green-500"
                    : ""
                }`}
              >
                {editingId === g.id ? (
                  <div className="flex flex-1 gap-2">
                    <input
                      type="text"
                      value={editFields.name}
                      onChange={e => setEditFields(prev => ({ ...prev, name: e.target.value }))}
                      className="border p-1 rounded flex-1"
                    />
                    <input
                      type="email"
                      value={editFields.email}
                      onChange={e => setEditFields(prev => ({ ...prev, email: e.target.value }))}
                      className="border p-1 rounded flex-1"
                    />
                    <select
                      value={editFields.type}
                      onChange={e =>
                        setEditFields(prev => ({ ...prev, type: e.target.value as GuestType }))
                      }
                      className="border p-1 rounded flex-1"
                    >
                      <option value="normal">{t("normal")}</option>
                      <option value="vip">{t("vip")}</option>
                      <option value="family">{t("family")}</option>
                    </select>
                    <button
                      onClick={() => saveEditing(g.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Save className="h-4 w-4" /> {t("save")}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 flex items-center gap-1"
                    >
                      <X className="h-4 w-4" /> {t("cancel")}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-1 justify-between items-center">
                    <div className="flex-1">
                      <strong>{g.name}</strong> ({g.email}){" "}
                      <span
                        className={`ml-2 px-2 py-0.5 rounded text-white ${
                          guestType === "vip"
                            ? "bg-yellow-500"
                            : guestType === "family"
                            ? "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {t(guestType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRSVP(g.id)}
                        className={`px-3 py-1 rounded text-white ${
                          g.rsvp ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
                        }`}
                      >
                        {g.rsvp ? t("rsvpAccepted") : t("rsvpPending")}
                      </button>
                      <button
                        onClick={() => startEditing(g)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" /> {t("edit")}
                      </button>
                      <button
                        onClick={() => deleteGuest(g.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> {t("delete")}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CoupleGuestList;
