import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Trash2, Trash } from "lucide-react";
import { useAppSystemLog } from "../Contexts/AppSystemLog"; // runtime hook
import type { SystemLog } from "../Contexts/AppSystemLog"; // type only
import { useAppSettings } from "../Contexts/AppSettingsContext"; // multi-language context
import "./AdminSystemlog.css"; // Optional external CSS

const AdminSystemlog: React.FC = () => {
  const { t } = useAppSettings(); // Translation function
  const { logs, addLog, deleteLog, clearLogs } = useAppSystemLog();
  const [search, setSearch] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  // Filtered & sorted logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.actor.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortNewestFirst
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }, [logs, search, sortNewestFirst]);

  return (
    <div className="admin-systemlog-container">
      <div className="content-wrapper p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t("admin_system_log_title")}</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder={t("search_logs_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            onClick={() => setSortNewestFirst(!sortNewestFirst)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            {t("sort_label")}: {sortNewestFirst ? t("newest") : t("oldest")}
          </button>
          <button
            onClick={() => setSearch("")}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" /> {t("refresh")}
          </button>
          <button
            onClick={clearLogs}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
          >
            <Trash className="h-4 w-4" /> {t("clear_all")}
          </button>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-gray-500 text-center">{t("no_logs_found")}</p>
        ) : (
          <ul className="space-y-2">
            {filteredLogs.map((log: SystemLog) => (
              <li
                key={log.id}
                className="bg-gray-50 p-3 rounded shadow hover:bg-gray-100 transition flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-800 font-medium">{log.action}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(log.timestamp).toLocaleString()} • {t("actor")}: {log.actor}
                  </p>
                  <p className="text-gray-600 text-sm">{log.description}</p>
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="text-red-500 hover:text-red-700"
                  title={t("delete_log")}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminSystemlog;
