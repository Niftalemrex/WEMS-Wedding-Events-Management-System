import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
} from "../utils/StorageUtils";
import { BarChart2, AlertTriangle, CheckCircle2, Plus, CreditCard } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CouplesBudgetSummary.css";

type Event = { id: string; name: string };

export type CoupleBudget = {
  id: string;
  eventId: string;
  category: string;
  amount: number;
  status: "pending" | "approved_by_manager" | "approved_by_vendor" | "paid";
};

export type VendorPayment = {
  id: string;
  budgetId: string;
  eventId: string;
  category: string;
  amount: number;
  status: "pending" | "approved" | "payment_sent" | "paid";
  proofImage?: string;
};

const CoupleBudgetSummary: React.FC = () => {
  const { t } = useAppSettings();
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [budgets, setBudgets] = useState<CoupleBudget[]>([]);
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([]);

  const [selectedEventId, setSelectedEventId] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [amountInput, setAmountInput] = useState<number>(0);

  useEffect(() => {
    setEvents(getFromStorage(STORAGE_KEYS.EVENTS, []));
    setBudgets(getFromStorage(STORAGE_KEYS.COUPLE_BUDGETS, []));
    setVendorPayments(getFromStorage(STORAGE_KEYS.VENDOR_PAYMENTS, []));
  }, []);

  const handleSubmitBudget = () => {
    if (!categoryInput || !selectedEventId || !amountInput)
      return alert(t("fillAllFields"));

    const newBudget: CoupleBudget = {
      id: Date.now().toString(),
      eventId: selectedEventId,
      category: categoryInput,
      amount: amountInput,
      status: "pending",
    };

    addToStorageArray(STORAGE_KEYS.COUPLE_BUDGETS, newBudget);
    setBudgets(prev => [...prev, newBudget]);

    setCategoryInput("");
    setAmountInput(0);
    setSelectedEventId("");
  };

  const handlePayVendor = (paymentId: string) => {
    navigate(`/couple/pay/${paymentId}`);
  };

  const budgetsWithDetails = useMemo(() => {
    return budgets
      .filter(b => b.status !== "pending")
      .map(b => {
        const payments = vendorPayments.filter(p => p.budgetId === b.id);

        const paid = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
        const approved = payments.filter(p => p.status === "approved").reduce((s, p) => s + p.amount, 0);
        const pending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);

        const remaining = b.amount - (paid + approved);
        const percent = Math.min(100, Math.round(((paid + approved) / b.amount) * 100));

        return { ...b, payments, paid, approved, pending, remaining, percent };
      });
  }, [budgets, vendorPayments]);

  return (
    <div className="couple-budget-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BarChart2 className="h-6 w-6 text-green-500" /> {t("coupleBudgetSummary")}
      </h1>

      <div className="bg-gray-50 p-4 rounded shadow mb-6 grid md:grid-cols-4 gap-2">
        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">{t("selectEvent")}</option>
          {events.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <input
          placeholder={t("category")}
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder={t("amount")}
          value={amountInput}
          onChange={e => setAmountInput(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <button
          onClick={handleSubmitBudget}
          className="bg-green-600 text-white rounded flex items-center justify-center gap-2"
        >
          <Plus size={16} /> {t("submit")}
        </button>
      </div>

      {budgetsWithDetails.map(b => (
        <div key={b.id} className="bg-white p-4 rounded shadow mb-4">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">
              {b.category} – {events.find(e => e.id === b.eventId)?.name}
            </p>
            <p className="font-mono">${b.amount}</p>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded mb-2">
            <div className="h-2 bg-green-500 rounded" style={{ width: `${b.percent}%` }} />
          </div>

          <div className="flex flex-wrap gap-2">
            {b.payments.map(p => (
              <button
                key={p.id}
                disabled={p.status !== "approved"}
                onClick={() => handlePayVendor(p.id)}
                className={`px-3 py-1 rounded flex items-center gap-1 ${
                  p.status === "approved" ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                }`}
              >
                <CreditCard size={14} /> {t("pay")} ${p.amount}
              </button>
            ))}
          </div>

          <p className="text-sm mt-2">
            {b.remaining < 0 ? (
              <AlertTriangle className="inline h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle2 className="inline h-4 w-4 text-green-600" />
            )}
            &nbsp;{t("remaining")}: ${b.remaining}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CoupleBudgetSummary;
