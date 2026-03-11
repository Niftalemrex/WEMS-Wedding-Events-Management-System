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
import "./ManagerInventory.css";

export type InventoryItem = {
  id: string;
  eventId: string;
  item: string;
  quantity: number;
  assignedToVendor?: string;
  status: "pending" | "assigned" | "delivered";
  source: "vendor" | "couple";
};

const ManagerInventory: React.FC = () => {
  const { t } = useAppSettings();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [eventId, setEventId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [assignedToVendor, setAssignedToVendor] = useState("");
  const [source, setSource] = useState<"vendor" | "couple">("vendor");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof InventoryItem | "">("");

  /** Load inventory from vendor and couple sources */
  useEffect(() => {
    const vendorInv = getFromStorage<InventoryItem[]>(STORAGE_KEYS.VENDOR_INVENTORY, []);
    const coupleInv = getFromStorage<InventoryItem[]>(STORAGE_KEYS.COUPLE_INVENTORY, []);
    setItems([...vendorInv, ...coupleInv]);
  }, []);

  /** Add new inventory item */
  const handleAdd = () => {
    if (!eventId.trim() || !itemName.trim() || quantity <= 0) return alert(t("fillAllFields"));

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      eventId: eventId.trim(),
      item: itemName.trim(),
      quantity,
      assignedToVendor: assignedToVendor.trim() || undefined,
      status: "pending",
      source,
    };

    const storageKey = source === "vendor" ? STORAGE_KEYS.VENDOR_INVENTORY : STORAGE_KEYS.COUPLE_INVENTORY;
    addToStorageArray<InventoryItem>(storageKey, newItem);

    setItems(prev => [...prev, newItem]);
    setEventId(""); setItemName(""); setQuantity(0); setAssignedToVendor(""); setSource("vendor");
  };

  /** Update inventory item */
  const handleUpdate = (id: string, field: keyof InventoryItem, value: any) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const storageKey = item.source === "vendor" ? STORAGE_KEYS.VENDOR_INVENTORY : STORAGE_KEYS.COUPLE_INVENTORY;
    updateStorageArray<InventoryItem>(storageKey, i => i.id === id, i => ({ ...i, [field]: value }));
    setItems(prev => prev.map(i => (i.id === id ? { ...i, [field]: value } : i)));
  };

  /** Delete inventory item */
  const handleDelete = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || !window.confirm(t("deleteConfirm"))) return;

    const storageKey = item.source === "vendor" ? STORAGE_KEYS.VENDOR_INVENTORY : STORAGE_KEYS.COUPLE_INVENTORY;
    deleteFromStorageArray<InventoryItem>(storageKey, i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  /** Filtered and sorted inventory */
  const filteredItems = useMemo(() => {
    const s = search.toLowerCase();
    return items
      .filter(i =>
        i.item.toLowerCase().includes(s) ||
        i.eventId.toLowerCase().includes(s) ||
        (i.assignedToVendor ?? "").toLowerCase().includes(s)
      )
      .sort((a, b) => {
        if (!sortBy) return 0;
        if (typeof a[sortBy] === "string") return (a[sortBy] as string).localeCompare(b[sortBy] as string);
        if (typeof a[sortBy] === "number") return (a[sortBy] as number) - (b[sortBy] as number);
        return 0;
      });
  }, [items, search, sortBy]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="manager-inventory-container p-4">
      <h1 className="text-2xl font-bold mb-4">{t("masterInventory")}</h1>
      <p className="mb-2 text-gray-600">{t("totalItems")}: {totalItems}</p>

      {/* Add Form */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <input type="text" placeholder={t("eventId")} value={eventId} onChange={e => setEventId(e.target.value)} className="border p-2 rounded w-full"/>
        <input type="text" placeholder={t("itemName")} value={itemName} onChange={e => setItemName(e.target.value)} className="border p-2 rounded w-full"/>
        <input type="number" placeholder={t("quantity")} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border p-2 rounded w-full"/>
        <input type="text" placeholder={t("vendorOptional")} value={assignedToVendor} onChange={e => setAssignedToVendor(e.target.value)} className="border p-2 rounded w-full"/>
        <select value={source} onChange={e => setSource(e.target.value as "vendor" | "couple")} className="border p-2 rounded w-full">
          <option value="vendor">{t("vendor")}</option>
          <option value="couple">{t("couple")}</option>
        </select>
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1 justify-center">
          <Plus className="h-4 w-4"/> {t("add")}
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input type="text" placeholder={t("searchInventory")} value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded w-full md:w-1/2"/>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as keyof InventoryItem)} className="border p-2 rounded w-full md:w-1/4">
          <option value="">{t("sortBy")}</option>
          <option value="eventId">{t("eventId")}</option>
          <option value="item">{t("itemName")}</option>
          <option value="quantity">{t("quantity")}</option>
          <option value="assignedToVendor">{t("vendor")}</option>
          <option value="status">{t("status")}</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">{t("eventId")}</th>
              <th className="border p-2">{t("itemName")}</th>
              <th className="border p-2">{t("quantity")}</th>
              <th className="border p-2">{t("vendor")}</th>
              <th className="border p-2">{t("status")}</th>
              <th className="border p-2">{t("source")}</th>
              <th className="border p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(i => (
              <tr key={i.id} className="hover:bg-gray-50 transition">
                <td className="border p-2">
                  <input value={i.eventId} onChange={ev => handleUpdate(i.id, "eventId", ev.target.value)} className="border p-1 rounded w-full"/>
                </td>
                <td className="border p-2">
                  <input value={i.item} onChange={ev => handleUpdate(i.id, "item", ev.target.value)} className="border p-1 rounded w-full"/>
                </td>
                <td className="border p-2">
                  <input type="number" value={i.quantity} onChange={ev => handleUpdate(i.id, "quantity", Number(ev.target.value))} className="border p-1 rounded w-full"/>
                </td>
                <td className="border p-2">
                  <input value={i.assignedToVendor ?? ""} onChange={ev => handleUpdate(i.id, "assignedToVendor", ev.target.value)} placeholder={t("vendor")} className="border p-1 rounded w-full"/>
                </td>
                <td className="border p-2">
                  <select value={i.status} onChange={ev => handleUpdate(i.id, "status", ev.target.value)} className="border p-1 rounded w-full">
                    <option value="pending">{t("pending")}</option>
                    <option value="assigned">{t("assigned")}</option>
                    <option value="delivered">{t("delivered")}</option>
                  </select>
                </td>
                <td className="border p-2">{i.source}</td>
                <td className="border p-2 flex gap-2">
                  <button onClick={() => handleDelete(i.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1">
                    <Trash2 className="h-4 w-4"/> {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerInventory;
