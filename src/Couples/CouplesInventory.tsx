import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Plus, Trash2 } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesInventory.css";

export type InventoryItem = {
  id: string;
  item: string;
  quantity: number;
  status: "pending" | "assigned" | "delivered";
  source?: "vendor" | "couple";
  assignedToVendor?: string;
};

const CoupleInventory: React.FC = () => {
  const { t } = useAppSettings();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [status, setStatus] = useState<InventoryItem["status"]>("pending");
  const [assignedToVendor, setAssignedToVendor] = useState("");
  const [search, setSearch] = useState("");

  // Load couple inventory
  useEffect(() => {
    const storedInventory = getFromStorage<InventoryItem[]>(STORAGE_KEYS.COUPLE_INVENTORY, []);
    setInventory(storedInventory);
  }, []);

  // Add item
  const addItemToInventory = () => {
    if (!itemName.trim() || typeof quantity !== "number" || quantity <= 0) return;

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      item: itemName.trim(),
      quantity: Number(quantity),
      status,
      source: "couple",
      assignedToVendor: assignedToVendor.trim() || undefined,
    };

    addToStorageArray(STORAGE_KEYS.COUPLE_INVENTORY, newItem);
    setInventory(prev => [...prev, newItem]);

    setItemName("");
    setQuantity("");
    setStatus("pending");
    setAssignedToVendor("");
  };

  // Update item
  const handleUpdate = (id: string, field: keyof InventoryItem, value: any) => {
    updateStorageArray<InventoryItem>(
      STORAGE_KEYS.COUPLE_INVENTORY,
      i => i.id === id,
      i => ({ ...i, [field]: value })
    );
    setInventory(prev => prev.map(i => (i.id === id ? { ...i, [field]: value } : i)));
  };

  // Delete item
  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirmDeleteItem"))) return;
    deleteFromStorageArray<InventoryItem>(STORAGE_KEYS.COUPLE_INVENTORY, i => i.id === id);
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  // Filter inventory
  const filteredInventory = useMemo(() => {
    const s = search.toLowerCase();
    return inventory.filter(
      i =>
        (i.item ?? "").toLowerCase().includes(s) ||
        (i.status ?? "").toLowerCase().includes(s) ||
        (i.assignedToVendor ?? "").toLowerCase().includes(s)
    );
  }, [inventory, search]);

  const totalQuantity = inventory.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="couple-inventory-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t("inventoryManagement")}</h1>
      <p className="text-gray-600 mb-4">
        {t("totalItems")}: {inventory.length} | {t("totalQuantity")}: {totalQuantity}
      </p>

      {/* Add Item Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder={t("itemName")}
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder={t("quantity")}
          value={quantity}
          onChange={e => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value as InventoryItem["status"])}
          className="border p-2 rounded w-full"
        >
          <option value="pending">{t("pending")}</option>
          <option value="assigned">{t("assigned")}</option>
          <option value="delivered">{t("delivered")}</option>
        </select>
        <input
          type="text"
          placeholder={t("assignedVendorOptional")}
          value={assignedToVendor}
          onChange={e => setAssignedToVendor(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addItemToInventory}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> {t("addItem")}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t("searchItems")}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noInventoryItems")}</p>
      ) : (
        <table className="min-w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">{t("item")}</th>
              <th className="border p-2">{t("quantity")}</th>
              <th className="border p-2">{t("status")}</th>
              <th className="border p-2">{t("source")}</th>
              <th className="border p-2">{t("vendor")}</th>
              <th className="border p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(i => (
              <tr key={i.id} className="hover:bg-gray-50 transition">
                <td className="border p-2">
                  <input
                    value={i.item ?? ""}
                    onChange={ev => handleUpdate(i.id, "item", ev.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={i.quantity ?? 0}
                    onChange={ev => handleUpdate(i.id, "quantity", Number(ev.target.value))}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <select
                    value={i.status ?? "pending"}
                    onChange={ev => handleUpdate(i.id, "status", ev.target.value)}
                    className="border p-1 rounded w-full"
                  >
                    <option value="pending">{t("pending")}</option>
                    <option value="assigned">{t("assigned")}</option>
                    <option value="delivered">{t("delivered")}</option>
                  </select>
                </td>
                <td className="border p-2">{i.source ?? "couple"}</td>
                <td className="border p-2">{i.assignedToVendor ?? "-"}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(i.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoupleInventory;
