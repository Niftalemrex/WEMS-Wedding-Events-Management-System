import React, { useEffect, useState, useMemo } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminViewAnalytics.css";

type UserItem = { id: string; role: "admin" | "manager" | "vendor" };
type EventItem = { id: string; date: string };
type VendorItem = { id: string };
type PaymentItem = { id: string; amount: number };

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const AdminViewAnalytics: React.FC = () => {
  const { t } = useAppSettings();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  useEffect(() => {
    setUsers(getFromStorage<UserItem[]>(STORAGE_KEYS.USERS, []));
    setEvents(getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []));
    setVendors(getFromStorage<VendorItem[]>(STORAGE_KEYS.VENDORS, []));
    setPayments(getFromStorage<PaymentItem[]>(STORAGE_KEYS.PAYMENTS, []));
  }, []);

  /* -------------------- BAR CHART DATA -------------------- */

  const monthlyEventData = useMemo(() => {
    const months = [
      t("jan"), t("feb"), t("mar"), t("apr"), t("may"), t("jun"),
      t("jul"), t("aug"), t("sep"), t("oct"), t("nov"), t("dec"),
    ];

    const data = months.map(m => ({ name: m, events: 0 }));

    events.forEach(ev => {
      const monthIndex = new Date(ev.date).getMonth();
      if (!isNaN(monthIndex)) data[monthIndex].events += 1;
    });

    return data;
  }, [events, t]);

  /* -------------------- PIE CHART DATA -------------------- */

  const userRolesData = useMemo(() => {
    const roles: Record<string, number> = {
      admin: 0,
      manager: 0,
      vendor: 0,
    };

    users.forEach(u => roles[u.role]++);

    return [
      { name: t("admin"), value: roles.admin },
      { name: t("manager"), value: roles.manager },
      { name: t("vendor"), value: roles.vendor },
    ];
  }, [users, t]);

  return (
    <div className="admin-analytics-container p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("adminAnalytics")}
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-gray-500 text-sm">{t("totalUsers")}</p>
          <p className="text-xl font-semibold">{users.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-gray-500 text-sm">{t("totalEvents")}</p>
          <p className="text-xl font-semibold">{events.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-gray-500 text-sm">{t("totalVendors")}</p>
          <p className="text-xl font-semibold">{vendors.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-gray-500 text-sm">{t("totalPayments")}</p>
          <p className="text-xl font-semibold">
            ${payments.reduce((a, p) => a + p.amount, 0)}
          </p>
        </div>
      </div>

      {/* Monthly Events */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {t("eventsPerMonth")}
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyEventData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="events" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Roles */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">
          {t("userRolesDistribution")}
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={userRolesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {userRolesData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminViewAnalytics;
