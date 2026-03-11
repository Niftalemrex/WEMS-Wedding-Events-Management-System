import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerBudget.css";

export type BudgetItem = {
  id: string;
  eventId: string;
  description: string;
  amount: number;
  status?: "pending" | "approved_by_manager" | "approved_by_vendor" | "paid";
};

export type VendorPayment = {
  id: string;
  budgetId: string;
  eventId: string;
  category: string;
  amount: number;
  status: "pending" | "approved" | "paid";
};

type Event = { id: string; name: string };

const ManagerBudget: React.FC = () => {
  const { t } = useAppSettings();

  const [events, setEvents] = useState<Event[]>([]);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([]);
  const [search, setSearch] = useState("");

  // Form inputs
  const [selectedEventId, setSelectedEventId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    setEvents(getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, []));
    setBudgets(getFromStorage<BudgetItem[]>(STORAGE_KEYS.COUPLE_BUDGETS, []));
    setVendorPayments(getFromStorage<VendorPayment[]>(STORAGE_KEYS.VENDOR_PAYMENTS, []));
  }, []);

  /** Add new budget */
  const handleAdd = () => {
    if (!selectedEventId || !description || !amount) return alert(t("fillAllFields"));

    const newBudget: BudgetItem = {
      id: Date.now().toString(),
      eventId: selectedEventId,
      description,
      amount,
      status: "approved_by_manager",
    };

    addToStorageArray<BudgetItem>(STORAGE_KEYS.COUPLE_BUDGETS, newBudget);
    setBudgets(prev => [...prev, newBudget]);
    setSelectedEventId(""); setDescription(""); setAmount(0);
  };

  /** Approve pending budgets */
  const handleApprove = (id: string) => {
    updateStorageArray<BudgetItem>(
      STORAGE_KEYS.COUPLE_BUDGETS,
      b => b.id === id,
      b => ({ ...b, status: "approved_by_manager" })
    );
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, status: "approved_by_manager" } : b)));
  };

  /** Delete budget */
  const handleDelete = (id: string) => {
    if (!window.confirm(t("deleteBudgetConfirm"))) return;
    deleteFromStorageArray<BudgetItem>(STORAGE_KEYS.COUPLE_BUDGETS, b => b.id === id);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  /** Combine budgets + vendor payments */
  const budgetsWithDetails = useMemo(() => {
    return budgets.map(b => {
      const payments = vendorPayments.filter(p => p.budgetId === b.id && p.category === b.description);
      const pendingPayments = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
      const approvedPayments = payments.filter(p => p.status === "approved").reduce((sum, p) => sum + p.amount, 0);
      const paidPayments = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
      const remaining = b.amount - (approvedPayments + paidPayments);
      return { ...b, pendingPayments, approvedPayments, paidPayments, remaining };
    });
  }, [budgets, vendorPayments]);

  /** Filter & search */
  const filteredBudgets = useMemo(() => {
    return budgetsWithDetails
      .filter(b => {
        const desc = b.description ?? "";
        const eventName = events?.find(ev => ev.id === b.eventId)?.name ?? "";
        return desc.toLowerCase().includes(search.toLowerCase()) || eventName.toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => {
        if (a.status === b.status) return 0;
        if (a.status === "pending") return -1;
        return 1;
      });
  }, [budgetsWithDetails, search, events]);

  return (
    <div className="manager-budget-container p-4">
      <h1 className="text-2xl font-bold mb-4">{t("managerBudgets")}</h1>

      {/* Add Budget Form */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} className="border p-2 rounded w-full">
          <option value="">{t("selectEvent")}</option>
          {events.map(ev => (<option key={ev.id} value={ev.id}>{ev.name}</option>))}
        </select>

        <input type="text" placeholder={t("descriptionCategory")} value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded w-full"/>
        <input type="number" placeholder={t("amount")} value={amount} onChange={e => setAmount(Number(e.target.value))} className="border p-2 rounded w-full"/>
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 justify-center">
          <Plus className="h-4 w-4"/> {t("add")}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input type="text" placeholder={t("searchBudgets")} value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded w-full"/>
      </div>

      {/* Budget List */}
      {filteredBudgets.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noBudgetsFound")}</p>
      ) : (
        <ul className="space-y-3">
          {filteredBudgets.map(b => {
            const eventName = events.find(ev => ev.id === b.eventId)?.name || b.eventId;
            return (
              <li key={b.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-3 rounded hover:bg-gray-100 transition">
                <div className="flex-1 space-y-1 md:space-y-0 md:flex md:items-center md:gap-4">
                  <p className="font-semibold">{b.description} ({t("event")}: {eventName})</p>
                  <div className="flex gap-2 flex-wrap text-sm">
                    <span>{t("amount")}: ${b.amount}</span>
                    <span>{t("approved")}: ${b.approvedPayments}</span>
                    <span>{t("paid")}: ${b.paidPayments}</span>
                    <span>{t("pending")}: ${b.pendingPayments}</span>
                    <span className={b.remaining < 0 ? "text-red-600" : "text-green-600"}>
                      {t("remaining")}: ${b.remaining}
                    </span>
                  </div>

                  {b.status === "pending" && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="h-4 w-4"/> {t("pendingApproval")}
                    </span>
                  )}
                  {b.status === "approved_by_manager" && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4"/> {t("approvedByManager")}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                  {b.status === "pending" && (
                    <button onClick={() => handleApprove(b.id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      {t("approve")}
                    </button>
                  )}
                  <button onClick={() => handleDelete(b.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1">
                    <Trash2 className="h-4 w-4"/> {t("delete")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ManagerBudget;
