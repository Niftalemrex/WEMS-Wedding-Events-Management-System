// src/Vendor/VendorOverview.tsx
import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { Calendar, CreditCard } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // assuming you have this
import "./VendorOverview.css";

type AssignedEvent = { id: string; name: string; date: string };
type Payment = { id: string; eventId: string; amount: number; paid: boolean };

const VendorOverview: React.FC = () => {
  const { t } = useAppSettings(); // t(key: string) => string
  const [assignedEvents, setAssignedEvents] = useState<AssignedEvent[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    setAssignedEvents(getFromStorage<AssignedEvent[]>(STORAGE_KEYS.EVENTS, []));
    setPayments(getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []));
  }, []);

  const totalPaid = payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
  const totalUnpaid = payments.filter(p => !p.paid).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="vendor-overview-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("vendorOverview")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assigned Events */}
        <div className="overview-card flex items-center gap-4 p-4 rounded shadow hover:shadow-lg bg-white transition">
          <Calendar className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-gray-500">{t("assignedEvents")}</p>
            <p className="text-xl font-bold">{assignedEvents.length}</p>
          </div>
        </div>

        {/* Payments Summary */}
        <div className="overview-card flex items-center gap-4 p-4 rounded shadow hover:shadow-lg bg-white transition">
          <CreditCard className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-gray-500">{t("payments")}</p>
            <p className="text-xl font-bold">
              {t("paid")}: ${totalPaid} / {t("unpaid")}: ${totalUnpaid}
            </p>
          </div>
        </div>
      </div>

      {/* Optional Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="font-semibold mb-2">{t("assignedEvents")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {assignedEvents.map(e => (
              <li key={e.id}>
                {e.name} – {new Date(e.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t("payments")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {payments.map(p => (
              <li key={p.id}>
                {t("eventId")}: {p.eventId} – ${p.amount} –{" "}
                {p.paid ? `${t("paid")} ✅` : `${t("pending")} ⬜`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;
