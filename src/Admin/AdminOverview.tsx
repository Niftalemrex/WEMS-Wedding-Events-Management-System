import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { Users, Calendar, Truck, CreditCard, TrendingUp } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminOverview.css";

type User = { id: string; name?: string; email?: string };
type EventItem = { id: string; name?: string; date?: string };
type Vendor = { id: string; name?: string; service?: string };
type Payment = { id: string; amount?: number; status?: string };

const AdminOverview: React.FC = () => {
  const { t } = useAppSettings();

  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(getFromStorage<User[]>(STORAGE_KEYS.USERS, []));
      setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
      setVendors(getFromStorage<Vendor[]>(STORAGE_KEYS.VENDORS, []));
      setPayments(getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      label: t("users"),
      value: users.length,
      icon: <Users className="h-6 w-6" />,
      trend: "+12%",
    },
    {
      label: t("events"),
      value: events.length,
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      label: t("vendors"),
      value: vendors.length,
      icon: <Truck className="h-6 w-6" />,
    },
    {
      label: t("payments"),
      value: payments.length,
      icon: <CreditCard className="h-6 w-6" />,
    },
  ];

  return (
    <div className="admin-overview-container p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {t("overview")}
          </h1>
          <p className="text-gray-500 mt-2">
            {t("analytics")}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {t("reports")}: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white p-4 rounded shadow hover:shadow-lg transition flex items-center gap-4 ${
              isLoading ? "loading" : ""
            }`}
            role="region"
            aria-label={`${stat.label} ${t("analytics")}`}
          >
            <div className="text-blue-600">
              {stat.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-semibold">
                  {isLoading ? "..." : stat.value}
                </p>

                {stat.trend && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </span>
                )}
              </div>

              <p className="text-gray-500">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
