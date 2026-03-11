import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2, Plus, Edit, Save, X } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminManageVendors.css";

export type VendorItem = {
  id: string;
  name: string;
  service: string;
};

const AdminManageVendors: React.FC = () => {
  const { t } = useAppSettings();

  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ name: string; service: string }>({
    name: "",
    service: "",
  });

  useEffect(() => {
    const storedVendors = getFromStorage<VendorItem[]>(STORAGE_KEYS.VENDORS, []);
    setVendors(storedVendors);
  }, []);

  const addVendor = () => {
    if (!name.trim() || !service.trim()) {
      alert(t("vendorRequired"));
      return;
    }

    const newVendor: VendorItem = {
      id: Date.now().toString(),
      name: name.trim(),
      service: service.trim(),
    };

    addToStorageArray(STORAGE_KEYS.VENDORS, newVendor);
    setVendors(prev => [...prev, newVendor]);
    setName("");
    setService("");
  };

  const startEditing = (vendor: VendorItem) => {
    setEditingId(vendor.id);
    setEditFields({ name: vendor.name, service: vendor.service });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFields({ name: "", service: "" });
  };

  const saveEditing = (id: string) => {
    if (!editFields.name.trim() || !editFields.service.trim()) {
      alert(t("vendorEmptyError"));
      return;
    }

    updateStorageArray<VendorItem>(
      STORAGE_KEYS.VENDORS,
      v => v.id === id,
      v => ({ ...v, ...editFields })
    );

    setVendors(prev =>
      prev.map(v => (v.id === id ? { ...v, ...editFields } : v))
    );

    cancelEditing();
  };

  const deleteVendor = (id: string) => {
    if (!window.confirm(t("confirmDeleteVendor"))) return;

    deleteFromStorageArray<VendorItem>(
      STORAGE_KEYS.VENDORS,
      v => v.id === id
    );
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  const filteredVendors = useMemo(
    () =>
      vendors.filter(
        v =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.service.toLowerCase().includes(search.toLowerCase())
      ),
    [vendors, search]
  );

  return (
    <div className="admin-manage-vendors-container p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("adminManageVendors")}
      </h1>

      {/* Add Vendor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder={t("vendorName")}
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder={t("service")}
          value={service}
          onChange={e => setService(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addVendor}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("addVendor")}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t("searchVendors")}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Vendor List */}
      {filteredVendors.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noVendorsFound")}
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredVendors.map(v => (
            <li
              key={v.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded shadow hover:bg-gray-100 transition"
            >
              {editingId === v.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={editFields.name}
                    onChange={e =>
                      setEditFields(prev => ({ ...prev, name: e.target.value }))
                    }
                    className="border p-1 rounded flex-1"
                  />
                  <input
                    type="text"
                    value={editFields.service}
                    onChange={e =>
                      setEditFields(prev => ({
                        ...prev,
                        service: e.target.value,
                      }))
                    }
                    className="border p-1 rounded flex-1"
                  />
                  <button
                    onClick={() => saveEditing(v.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {t("save")}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    {t("cancel")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 justify-between items-center">
                  <span>
                    <strong>{v.name}</strong> — {v.service}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(v)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => deleteVendor(v.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t("delete")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminManageVendors;
