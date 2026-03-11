// src/Vendor/VendorReports.tsx
import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./VendorReports.css";

type Payment = { id: string; eventId: string; amount: number; paid: boolean };
type InventoryItem = { id: string; item: string; quantity: number };

const VendorReports: React.FC = () => {
  const { t } = useAppSettings();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setPayments(getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []));
    setInventory(getFromStorage<InventoryItem[]>(STORAGE_KEYS.INVENTORY, []));
  }, []);

  // Calculate totals
  const totalPaid = payments.filter(p => p.paid).length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalItems = inventory.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">{t("vendorReports")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-green-50 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">{t("payments")}</h2>
          <p>
            {t("totalPayments")}: <span className="font-medium">{payments.length}</span>
          </p>
          <p>
            {t("paidPayments")}: <span className="font-medium">{totalPaid}</span>
          </p>
          <p>
            {t("totalAmount")}: <span className="font-medium">${totalAmount}</span>
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">{t("inventory")}</h2>
          <p>
            {t("totalInventoryItems")}: <span className="font-medium">{inventory.length}</span>
          </p>
          <p>
            {t("totalQuantity")}: <span className="font-medium">{totalItems}</span>
          </p>
        </div>
      </div>

      {payments.length === 0 && inventory.length === 0 && (
        <p className="text-gray-500 text-center mt-6">{t("noReports")}</p>
      )}
    </div>
  );
};

export default VendorReports;
