import React, { useEffect, useState, useMemo } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { DollarSign, Search } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminManagePayments.css";

export type PaymentItem = {
  id: string;
  amount: number;
  method: string;
  date?: string;
};

const AdminManagePayments: React.FC = () => {
  const { t } = useAppSettings();

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const storedPayments = getFromStorage<PaymentItem[]>(
      STORAGE_KEYS.PAYMENTS,
      []
    );
    setPayments(storedPayments);
  }, []);

  const displayedPayments = useMemo(() => {
    let filtered = payments.filter(
      p =>
        p.method.toLowerCase().includes(search.toLowerCase()) ||
        (p.date?.includes(search) ?? false) ||
        p.amount.toString().includes(search)
    );

    filtered.sort((a, b) =>
      sortAsc ? a.amount - b.amount : b.amount - a.amount
    );

    return filtered;
  }, [payments, search, sortAsc]);

  return (
    <div className="admin-manage-payments-container p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("adminManagePayments")}
      </h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder={t("searchPayments")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={() => setSortAsc(prev => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("sortByAmount")} {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {/* Payments List */}
      {displayedPayments.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noPaymentsFound")}
        </p>
      ) : (
        <ul className="space-y-3">
          {displayedPayments.map(p => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded shadow hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>
                  <strong>${p.amount.toFixed(2)}</strong>{" "}
                  {t("paymentVia")} {p.method}
                  {p.date && (
                    <span className="text-gray-500 ml-2 text-sm">
                      ({p.date})
                    </span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminManagePayments;
