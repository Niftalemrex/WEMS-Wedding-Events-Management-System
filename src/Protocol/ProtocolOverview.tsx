import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage } from "../utils/StorageUtils";
import { ClipboardList, Calendar, CheckSquare } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ProtocolOverview.css";

type Assignment = { id: string; staffId?: string; taskId?: string };
type AgendaItem = { id: string; eventId?: string; time?: string; activity?: string };
type TaskItem = { id: string; eventId?: string; task?: string; done?: boolean };

const ProtocolOverview: React.FC = () => {
  const { t } = useAppSettings();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Load all protocol-related data from localStorage
  useEffect(() => {
    setAssignments(getFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []));
    setAgenda(getFromStorage<AgendaItem[]>(STORAGE_KEYS.AGENDA, []));
    setTasks(getFromStorage<TaskItem[]>(STORAGE_KEYS.EVENT_DAY_CHECKLIST, []));
  }, []);

  return (
    <div className="protocol-overview-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {t("protocolOverview")}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="overview-card flex items-center gap-3 p-4 rounded shadow hover:shadow-lg transition bg-white">
          <ClipboardList className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-gray-500">{t("totalAssignments")}</p>
            <p className="text-xl font-bold">{assignments.length}</p>
          </div>
        </div>

        <div className="overview-card flex items-center gap-3 p-4 rounded shadow hover:shadow-lg transition bg-white">
          <Calendar className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-gray-500">{t("totalAgendaItems")}</p>
            <p className="text-xl font-bold">{agenda.length}</p>
          </div>
        </div>

        <div className="overview-card flex items-center gap-3 p-4 rounded shadow hover:shadow-lg transition bg-white">
          <CheckSquare className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-gray-500">{t("totalTasksChecklist")}</p>
            <p className="text-xl font-bold">{tasks.length}</p>
          </div>
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">{t("assignments")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {assignments.map(a => (
              <li key={a.id}>
                {t("staffId")}: {a.staffId ?? t("notAvailable")} –{" "}
                {t("taskId")}: {a.taskId ?? t("notAvailable")}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t("agenda")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {agenda.map(a => (
              <li key={a.id}>
                {a.time ?? t("notAvailable")} –{" "}
                {a.activity ?? t("noActivity")}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t("tasksChecklist")}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {tasks.map(tk => (
              <li key={tk.id}>
                {tk.task ?? t("noTask")} –{" "}
                {tk.done ? t("done") : t("pending")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProtocolOverview;
