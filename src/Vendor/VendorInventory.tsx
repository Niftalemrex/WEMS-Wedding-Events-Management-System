// src/Vendor/VendorInventory.tsx
import React, { useEffect, useMemo, useState,  } from "react";
import type { ChangeEvent } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Plus, Trash2, Gift } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./VendorInventory.css";

/* ===============================
   TYPES
================================ */
export type InventoryItem = {
  id: string;
  item: string;
  quantity: number;
  status: "pending" | "assigned" | "delivered";
  source?: "vendor" | "couple";
  assignedToVendor?: string;
};

export type GiftItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

const VendorInventory: React.FC = () => {
  const { t } = useAppSettings();

  /* ===============================
     VENDOR INVENTORY STATE
  =============================== */
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [status, setStatus] = useState<InventoryItem["status"]>("pending");
  const [assignedToVendor, setAssignedToVendor] = useState("");
  const [search, setSearch] = useState("");

  /* ===============================
     GIFT INVENTORY STATE
  =============================== */
  const [giftInventory, setGiftInventory] = useState<GiftItem[]>([]);
  const [giftName, setGiftName] = useState("");
  const [giftQty, setGiftQty] = useState<number | "">("");
  const [giftPrice, setGiftPrice] = useState<number | "">("");
  const [giftImage, setGiftImage] = useState<string | undefined>();

  /* ===============================
     LOAD DATA FROM STORAGE
  =============================== */
  useEffect(() => {
    setInventory(getFromStorage(STORAGE_KEYS.VENDOR_INVENTORY, []) as InventoryItem[]);
    setGiftInventory(getFromStorage(STORAGE_KEYS.GIFT_INVENTORY, []) as GiftItem[]);
  }, []);

  /* ===============================
     VENDOR INVENTORY ACTIONS
  =============================== */
  const addVendorItem = () => {
    if (!itemName.trim() || !quantity || quantity <= 0) return;

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      item: itemName.trim(),
      quantity,
      status,
      source: "vendor",
      assignedToVendor: assignedToVendor || undefined,
    };

    addToStorageArray(STORAGE_KEYS.VENDOR_INVENTORY, newItem);
    setInventory((prev) => [...prev, newItem]);
    setItemName("");
    setQuantity("");
    setStatus("pending");
    setAssignedToVendor("");
  };

  const updateVendorItem = (
    id: string,
    field: keyof InventoryItem,
    value: string | number
  ) => {
    updateStorageArray(
      STORAGE_KEYS.VENDOR_INVENTORY,
      (i: InventoryItem) => i.id === id,
      (i: InventoryItem) => ({ ...i, [field]: value })
    );
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const deleteVendorItem = (id: string) => {
    deleteFromStorageArray(
      STORAGE_KEYS.VENDOR_INVENTORY,
      (i: InventoryItem) => i.id === id
    );
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  /* ===============================
     GIFT INVENTORY ACTIONS
  =============================== */
  const handleGiftImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setGiftImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addGiftItem = () => {
    if (!giftName.trim() || !giftQty || giftQty <= 0 || !giftPrice || giftPrice <= 0) {
      alert(t("fillGiftFields"));
      return;
    }

    const newGift: GiftItem = {
      id: Date.now().toString(),
      name: giftName.trim(),
      quantity: giftQty,
      price: giftPrice,
      image: giftImage,
    };

    addToStorageArray(STORAGE_KEYS.GIFT_INVENTORY, newGift);
    setGiftInventory((prev) => [...prev, newGift]);
    setGiftName("");
    setGiftQty("");
    setGiftPrice("");
    setGiftImage(undefined);
  };

  const updateGiftItem = (
    id: string,
    field: keyof GiftItem,
    value: string | number
  ) => {
    updateStorageArray(
      STORAGE_KEYS.GIFT_INVENTORY,
      (g: GiftItem) => g.id === id,
      (g: GiftItem) => ({ ...g, [field]: value })
    );
    setGiftInventory((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  const deleteGiftItem = (id: string) => {
    deleteFromStorageArray(
      STORAGE_KEYS.GIFT_INVENTORY,
      (g: GiftItem) => g.id === id
    );
    setGiftInventory((prev) => prev.filter((g) => g.id !== id));
  };

  /* ===============================
     FILTERED INVENTORY
  =============================== */
  const filteredInventory = useMemo(() => {
    const s = search.toLowerCase();
    return inventory.filter((i) => i.item.toLowerCase().includes(s));
  }, [inventory, search]);

  /* ===============================
     UI
  =============================== */
  return (
    <div className="vendor-inventory-container max-w-6xl mx-auto p-4 space-y-12">
      {/* Vendor Inventory */}
      <section>
        <h1 className="text-2xl font-bold mb-4">{t("vendorInventory")}</h1>

        <div className="grid md:grid-cols-5 gap-3 mb-4">
          <input
            value={itemName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setItemName(e.target.value)}
            placeholder={t("item")}
          />
          <input
            type="number"
            value={quantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuantity(Number(e.target.value))
            }
            placeholder={t("quantity")}
          />
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as InventoryItem["status"])
            }
          >
            <option value="pending">{t("pending")}</option>
            <option value="assigned">{t("assigned")}</option>
            <option value="delivered">{t("delivered")}</option>
          </select>
          <input
            value={assignedToVendor}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAssignedToVendor(e.target.value)
            }
            placeholder={t("vendor")}
          />
          <button
            onClick={addVendorItem}
            className="bg-green-600 text-white flex items-center justify-center gap-1"
          >
            <Plus size={16} /> {t("add")}
          </button>
        </div>

        <input
          placeholder={t("search")}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <table className="w-full border">
          <thead>
            <tr>
              <th>{t("item")}</th>
              <th>{t("quantity")}</th>
              <th>{t("status")}</th>
              <th>{t("vendor")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((i) => (
              <tr key={i.id}>
                <td>
                  <input
                    value={i.item}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateVendorItem(i.id, "item", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={i.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateVendorItem(i.id, "quantity", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <select
                    value={i.status}
                    onChange={(e) =>
                      updateVendorItem(i.id, "status", e.target.value)
                    }
                  >
                    <option value="pending">{t("pending")}</option>
                    <option value="assigned">{t("assigned")}</option>
                    <option value="delivered">{t("delivered")}</option>
                  </select>
                </td>
                <td>{i.assignedToVendor || "-"}</td>
                <td>
                  <button onClick={() => deleteVendorItem(i.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Gift Inventory */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Gift /> {t("vendorGiftInventory")}
        </h2>

        <div className="grid md:grid-cols-5 gap-3 mb-4">
          <input
            value={giftName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGiftName(e.target.value)}
            placeholder={t("giftName")}
          />
          <input
            type="number"
            value={giftQty}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGiftQty(Number(e.target.value))}
            placeholder={t("quantity")}
          />
          <input
            type="number"
            value={giftPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGiftPrice(Number(e.target.value))}
            placeholder={t("price")}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              e.target.files && handleGiftImage(e.target.files[0])
            }
          />
          <button
            onClick={addGiftItem}
            className="bg-purple-600 text-white flex items-center justify-center gap-1"
          >
            <Plus size={16} /> {t("addGift")}
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr>
              <th>{t("image")}</th>
              <th>{t("gift")}</th>
              <th>{t("quantity")}</th>
              <th>{t("price")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {giftInventory.map((g) => (
              <tr key={g.id}>
                <td>
                  {g.image && (
                    <img
                      src={g.image}
                      alt={g.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                </td>
                <td>
                  <input
                    value={g.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateGiftItem(g.id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={g.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateGiftItem(g.id, "quantity", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={g.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateGiftItem(g.id, "price", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <button onClick={() => deleteGiftItem(g.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default VendorInventory;
