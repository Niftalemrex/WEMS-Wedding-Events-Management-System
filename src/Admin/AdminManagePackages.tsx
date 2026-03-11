import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Plus, Trash2, Package } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminManagePackages.css";

export type PackageItem = {
  id: string;
  name: string;
  price: number;
};

const AdminManagePackages: React.FC = () => {
  const { t } = useAppSettings();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const storedPackages = getFromStorage<PackageItem[]>(
      STORAGE_KEYS.PACKAGES,
      []
    );
    setPackages(storedPackages);
  }, []);

  const addPackage = () => {
    if (!name || !price) return;

    const newPackage: PackageItem = {
      id: Date.now().toString(),
      name,
      price,
    };

    addToStorageArray(STORAGE_KEYS.PACKAGES, newPackage);
    setPackages(prev => [...prev, newPackage]);

    setName("");
    setPrice(0);
  };

  const deletePackage = (id: string) => {
    if (!window.confirm(t("confirmDeletePackage"))) return;

    deleteFromStorageArray<PackageItem>(
      STORAGE_KEYS.PACKAGES,
      p => p.id === id
    );
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const displayedPackages = useMemo(() => {
    let filtered = packages.filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.price.toString().includes(search)
    );

    filtered.sort((a, b) =>
      sortAsc ? a.price - b.price : b.price - a.price
    );

    return filtered;
  }, [packages, search, sortAsc]);

  return (
    <div className="admin-manage-packages-container p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("adminManagePackages")}
      </h1>

      {/* Add Package */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder={t("packageName")}
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder={t("price")}
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addPackage}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 justify-center"
        >
          <Plus className="h-4 w-4" />
          {t("addPackage")}
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder={t("searchPackages")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:flex-1"
        />
        <button
          onClick={() => setSortAsc(prev => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("sortByPrice")} {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {/* Package List */}
      {displayedPackages.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noPackagesFound")}
        </p>
      ) : (
        <ul className="space-y-3">
          {displayedPackages.map(p => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded shadow hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                <span>
                  <strong>{p.name}</strong> – ${p.price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => deletePackage(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                {t("delete")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminManagePackages;
