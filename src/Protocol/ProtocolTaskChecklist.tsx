import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ProtocolTaskChecklist.css";

export type ProtocolTask = {
  id: string;
  task: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: "protocol" | "couple";
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string;
};

const ProtocolTaskChecklist: React.FC = () => {
  const { t } = useAppSettings();

  const [tasks, setTasks] = useState<ProtocolTask[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [priorityInput, setPriorityInput] =
    useState<"low" | "medium" | "high">("medium");
  const [dueDateInput, setDueDateInput] = useState("");

  /* ---------------- Load tasks ---------------- */
  useEffect(() => {
    setTasks(
      getFromStorage<ProtocolTask[]>(
        STORAGE_KEYS.EVENT_DAY_CHECKLIST,
        []
      )
    );
  }, []);

  /* ---------------- Add task ---------------- */
  const addTask = () => {
    if (!taskInput.trim()) {
      alert(t("taskCannotBeEmpty"));
      return;
    }

    const newTask: ProtocolTask = {
      id: crypto.randomUUID(),
      task: taskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      createdBy: "protocol",
      priority: priorityInput,
      category: categoryInput || undefined,
      dueDate: dueDateInput || undefined,
    };

    addToStorageArray(STORAGE_KEYS.EVENT_DAY_CHECKLIST, newTask);
    setTasks(prev => [...prev, newTask]);

    setTaskInput("");
    setCategoryInput("");
    setPriorityInput("medium");
    setDueDateInput("");
  };

  /* ---------------- Toggle completion ---------------- */
  const toggleTask = (id: string) => {
    const now = new Date().toISOString();

    updateStorageArray<ProtocolTask>(
      STORAGE_KEYS.EVENT_DAY_CHECKLIST,
      t => t.id === id,
      t => ({ ...t, completed: !t.completed, updatedAt: now })
    );

    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: now }
          : t
      )
    );
  };

  /* ---------------- Delete task ---------------- */
  const deleteTask = (id: string) => {
    if (!window.confirm(t("confirmDeleteTask"))) return;

    deleteFromStorageArray<ProtocolTask>(
      STORAGE_KEYS.EVENT_DAY_CHECKLIST,
      t => t.id === id
    );

    setTasks(prev => prev.filter(t => t.id !== id));
  };

  /* ---------------- Update task field ---------------- */
  const updateTask = (
    id: string,
    field: keyof ProtocolTask,
    value: any
  ) => {
    const now = new Date().toISOString();

    updateStorageArray<ProtocolTask>(
      STORAGE_KEYS.EVENT_DAY_CHECKLIST,
      t => t.id === id,
      t => ({ ...t, [field]: value || undefined, updatedAt: now })
    );

    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, [field]: value || undefined, updatedAt: now }
          : t
      )
    );
  };

  /* ---------------- Stats ---------------- */
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const byPriority = {
      high: tasks.filter(t => t.priority === "high").length,
      medium: tasks.filter(t => t.priority === "medium").length,
      low: tasks.filter(t => t.priority === "low").length,
    };

    return { total, completed, pending, byPriority };
  }, [tasks]);

  return (
    <div className="protocol-task-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {t("protocolTaskChecklist")}
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        {t("total")}: {stats.total} | {t("completed")}:{" "}
        {stats.completed} | {t("pending")}: {stats.pending} |{" "}
        {t("high")}: {stats.byPriority.high} | {t("medium")}:{" "}
        {stats.byPriority.medium} | {t("low")}:{" "}
        {stats.byPriority.low}
      </p>

      {/* -------- Add Task Form -------- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
        <input
          type="text"
          placeholder={t("taskPlaceholder")}
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          className="border p-2 rounded col-span-2"
        />

        <input
          type="text"
          placeholder={t("category")}
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={priorityInput}
          onChange={e =>
            setPriorityInput(e.target.value as any)
          }
          className="border p-2 rounded"
        >
          <option value="low">{t("low")}</option>
          <option value="medium">{t("medium")}</option>
          <option value="high">{t("high")}</option>
        </select>

        <input
          type="date"
          value={dueDateInput}
          onChange={e => setDueDateInput(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={addTask}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("add")}
        </button>
      </div>

      {/* -------- Task List -------- */}
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noProtocolTasks")}
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(tk => (
            <li
              key={tk.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-white rounded shadow hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={tk.task}
                  onChange={e =>
                    updateTask(tk.id, "task", e.target.value)
                  }
                  className={`border p-1 rounded w-full md:flex-1 ${
                    tk.completed
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                />

                <input
                  type="text"
                  value={tk.category || ""}
                  onChange={e =>
                    updateTask(
                      tk.id,
                      "category",
                      e.target.value
                    )
                  }
                  placeholder={t("category")}
                  className="border p-1 rounded w-24"
                />

                <select
                  value={tk.priority}
                  onChange={e =>
                    updateTask(
                      tk.id,
                      "priority",
                      e.target.value as any
                    )
                  }
                  className="border p-1 rounded w-24"
                >
                  <option value="low">{t("low")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="high">{t("high")}</option>
                </select>

                <input
                  type="date"
                  value={tk.dueDate || ""}
                  onChange={e =>
                    updateTask(
                      tk.id,
                      "dueDate",
                      e.target.value
                    )
                  }
                  className="border p-1 rounded w-32"
                />

                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={tk.completed}
                    onChange={() => toggleTask(tk.id)}
                  />
                  {t("done")}
                </label>

                <span className="text-xs italic text-gray-500">
                  ({tk.createdBy})
                </span>
              </div>

              <button
                onClick={() => deleteTask(tk.id)}
                className="text-red-500 hover:text-red-700 flex items-center gap-1 mt-2 md:mt-0"
              >
                <Trash2 className="h-4 w-4" />
                {t("delete")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProtocolTaskChecklist;
