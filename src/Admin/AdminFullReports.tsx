import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import {
  Users,
  Calendar,
  ShoppingCart,
  CreditCard,
  Download,
} from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminFullReports.css";

type Report = {
  users: number;
  events: number;
  vendors: number;
  payments: number;
  generatedAt: string;
};

const AdminFullReports: React.FC = () => {
  const { t } = useAppSettings();

  const [report, setReport] = useState<Report>({
    users: 0,
    events: 0,
    vendors: 0,
    payments: 0,
    generatedAt: "",
  });

  useEffect(() => {
    setReport({
      users: getFromStorage(STORAGE_KEYS.USERS, []).length,
      events: getFromStorage(STORAGE_KEYS.EVENTS, []).length,
      vendors: getFromStorage(STORAGE_KEYS.VENDORS, []).length,
      payments: getFromStorage(STORAGE_KEYS.PAYMENTS, []).length,
      generatedAt: new Date().toLocaleString(),
    });
  }, []);

  /* ---------------------- DOWNLOAD HELPERS ---------------------- */

  const downloadFile = (content: string, fileName: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const csv = [
      [t("metric"), t("value")],
      [t("users"), report.users],
      [t("events"), report.events],
      [t("vendors"), report.vendors],
      [t("payments"), report.payments],
      [t("generatedAt"), report.generatedAt],
    ]
      .map(row => row.join(","))
      .join("\n");

    downloadFile(csv, "admin_full_report.csv", "text/csv");
  };

  const downloadJSON = () => {
    downloadFile(
      JSON.stringify(report, null, 2),
      "admin_full_report.json",
      "application/json"
    );
  };

  /* ---------------------- UI DATA ---------------------- */

  const reportItems = [
    {
      label: t("users"),
      value: report.users,
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      label: t("events"),
      value: report.events,
      icon: <Calendar className="h-6 w-6 text-green-600" />,
    },
    {
      label: t("vendors"),
      value: report.vendors,
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
    },
    {
      label: t("payments"),
      value: report.payments,
      icon: <CreditCard className="h-6 w-6 text-yellow-600" />,
    },
  ];

  return (
    <div className="admin-full-reports-container p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {t("adminFullReports")}
        </h1>

        <div className="flex gap-2">
          <button className="report-download-btn" onClick={downloadCSV}>
            <Download size={16} /> CSV
          </button>
          <button className="report-download-btn" onClick={downloadJSON}>
            <Download size={16} /> JSON
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {t("generatedAt")}: {report.generatedAt}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportItems.map(item => (
          <div
            key={item.label}
            className="bg-white shadow rounded p-4 flex items-center gap-4 hover:shadow-lg transition"
          >
            {item.icon}
            <div>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFullReports;
