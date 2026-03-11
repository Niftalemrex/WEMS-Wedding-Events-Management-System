// src/Vendor/VendorPayments.tsx
import React, { useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  updateStorageArray,
  addToStorageArray,
} from "../utils/StorageUtils";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./VendorPayments.css";

/* ================= TYPES ================= */

export type BankInfo = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode?: string;
};

export type VendorPayment = {
  id: string;
  budgetId: string;
  eventId: string;
  category: string;
  amount: number;
  status: "pending" | "approved" | "payment_sent" | "paid";
  proofImage?: string;
  bankInfo?: BankInfo;
};

export type BudgetItem = {
  id: string;
  eventId: string;
  description: string;
  amount: number;
  status: "pending" | "approved_by_manager" | "approved_by_vendor" | "paid";
};

/* ================= COMPONENT ================= */

const VendorPayments: React.FC = () => {
  const { t } = useAppSettings(); // translation function
  const [payments, setPayments] = useState<VendorPayment[]>([]);

  /* ===== LOAD & AUTO CREATE PAYMENTS ===== */
  useEffect(() => {
    const budgets = getFromStorage<BudgetItem[]>(STORAGE_KEYS.COUPLE_BUDGETS, []);
    const storedPayments = getFromStorage<VendorPayment[]>(STORAGE_KEYS.VENDOR_PAYMENTS, []);

    budgets
      .filter((b) => b.status === "approved_by_manager")
      .forEach((b) => {
        const exists = storedPayments.some((p) => p.budgetId === b.id);
        if (!exists) {
          const newPayment: VendorPayment = {
            id: Date.now().toString() + Math.random().toString(),
            budgetId: b.id,
            eventId: b.eventId,
            category: b.description,
            amount: b.amount,
            status: "pending",
          };
          storedPayments.push(newPayment);
          addToStorageArray<VendorPayment>(STORAGE_KEYS.VENDOR_PAYMENTS, newPayment);
        }
      });

    setPayments(storedPayments);
  }, []);

  /* ===== APPROVE JOB + ADD BANK INFO ===== */
  const approveJob = (paymentId: string) => {
    const bankName = prompt(t("bankNamePrompt"));
    const accountName = prompt(t("accountNamePrompt"));
    const accountNumber = prompt(t("accountNumberPrompt"));
    const swiftCodeInput = prompt(t("swiftCodePrompt"));

    if (!bankName || !accountName || !accountNumber) {
      alert(t("bankInfoRequired"));
      return;
    }

    const bankInfo: BankInfo = {
      bankName,
      accountName,
      accountNumber,
      ...(swiftCodeInput ? { swiftCode: swiftCodeInput } : {}),
    };

    updateStorageArray<VendorPayment>(
      STORAGE_KEYS.VENDOR_PAYMENTS,
      (p) => p.id === paymentId,
      (p) => ({ ...p, status: "approved", bankInfo })
    );

    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "approved", bankInfo } : p))
    );
  };

  /* ===== CONFIRM RECEIVED PAYMENT ===== */
  const confirmPaid = (paymentId: string) => {
    if (!window.confirm(t("confirmPaymentPrompt"))) return;

    updateStorageArray<VendorPayment>(
      STORAGE_KEYS.VENDOR_PAYMENTS,
      (p) => p.id === paymentId,
      (p) => ({ ...p, status: "paid" })
    );

    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "paid" } : p)));
  };

  /* ================= UI ================= */
  return (
    <div className="vendor-payments-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("vendorPayments")}</h1>

      {payments.length === 0 ? (
        <p className="text-gray-500">{t("noPaymentsAvailable")}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="text-blue-500" />
                <div>
                  <p className="font-semibold">{p.category}</p>
                  <p className="text-sm">${p.amount}</p>
                </div>
              </div>

              {p.status === "pending" && (
                <button
                  onClick={() => approveJob(p.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  {t("approveAddBank")}
                </button>
              )}

              {p.status === "approved" && (
                <p className="text-blue-600 text-sm">{t("waitingForPayment")}</p>
              )}

              {p.status === "payment_sent" && (
                <>
                  {p.proofImage && (
                    <img
                      src={p.proofImage}
                      alt={t("paymentProof")}
                      className="rounded border"
                    />
                  )}
                  <button
                    onClick={() => confirmPaid(p.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    {t("confirmPayment")}
                  </button>
                </>
              )}

              {p.status === "paid" && (
                <p className="text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={16} /> {t("paid")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorPayments;
