import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerTaskChecklist.css";

export type ManagerTask = {
  id: string;
  eventId?: string;
  task: string;
  done?: boolean;
  completed?: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: "manager" | "couple" | "protocol";
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string;
};

const ManagerTaskChecklist: React.FC = () => {
  const { t } = useAppSettings();
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [eventId, setEventId] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<"low" | "medium" | "high">("medium");
  const [categoryInput, setCategoryInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");
  const [search, setSearch] = useState("");

  /** Load tasks */
  useEffect(() => {
    const coupleAndManagerTasks = getFromStorage<ManagerTask[]>(STORAGE_KEYS.TASKS, []);
    const protocolTasks = getFromStorage<ManagerTask[]>(STORAGE_KEYS.EVENT_DAY_CHECKLIST, []);
    const allTasks = [...coupleAndManagerTasks, ...protocolTasks].map(t => ({
      ...t,
      done: t.done ?? t.completed ?? false
    }));
    setTasks(allTasks);
  }, []);

  /** Add manager task */
  const handleAdd = () => {
    if (!eventId.trim() || !taskInput.trim()) return alert(t("taskAddError"));

    const newTask: ManagerTask = {
      id: Date.now().toString(),
      eventId: eventId.trim(),
      task: taskInput.trim(),
      done: false,
      createdAt: new Date().toISOString(),
      createdBy: "manager",
      priority: priorityInput,
      category: categoryInput || undefined,
      dueDate: dueDateInput || undefined,
    };

    addToStorageArray(STORAGE_KEYS.TASKS, newTask);
    setTasks(prev => [...prev, newTask]);
    setEventId(""); setTaskInput(""); setPriorityInput("medium"); setCategoryInput(""); setDueDateInput("");
  };

  /** Toggle done/completed */
  const handleToggleDone = (id: string) => {
    const now = new Date().toISOString();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.createdBy === "manager" || task.createdBy === "couple") {
      updateStorageArray<ManagerTask>(
        STORAGE_KEYS.TASKS,
        t => t.id === id,
        t => ({ ...t, done: !t.done, updatedAt: now })
      );
    } else if (task.createdBy === "protocol") {
      updateStorageArray<ManagerTask>(
        STORAGE_KEYS.EVENT_DAY_CHECKLIST,
        t => t.id === id,
        t => ({ ...t, completed: !t.completed, updatedAt: now })
      );
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  /** Update task inline */
  const handleUpdate = (id: string, field: keyof ManagerTask, value: any) => {
    const now = new Date().toISOString();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.createdBy === "manager" || task.createdBy === "couple") {
      updateStorageArray<ManagerTask>(
        STORAGE_KEYS.TASKS,
        t => t.id === id,
        t => ({ ...t, [field]: value, updatedAt: now })
      );
    } else if (task.createdBy === "protocol") {
      updateStorageArray<ManagerTask>(
        STORAGE_KEYS.EVENT_DAY_CHECKLIST,
        t => t.id === id,
        t => ({ ...t, [field]: value, updatedAt: now })
      );
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value, updatedAt: now } : t));
  };

  /** Delete task */
  const handleDelete = (id: string) => {
    if (!window.confirm(t("taskDeleteConfirm"))) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.createdBy === "manager" || task.createdBy === "couple") {
      deleteFromStorageArray<ManagerTask>(STORAGE_KEYS.TASKS, t => t.id === id);
    } else if (task.createdBy === "protocol") {
      deleteFromStorageArray<ManagerTask>(STORAGE_KEYS.EVENT_DAY_CHECKLIST, t => t.id === id);
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  /** Filter/search */
  const filteredTasks = useMemo(() => {
    return tasks.filter(t =>
      t.task.toLowerCase().includes(search.toLowerCase()) ||
      (t.eventId?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (t.category?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      t.priority.toLowerCase().includes(search.toLowerCase()) ||
      t.createdBy.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const coupleTasks = useMemo(() => filteredTasks.filter(t => t.createdBy === "couple"), [filteredTasks]);
  const protocolTasks = useMemo(() => filteredTasks.filter(t => t.createdBy === "protocol"), [filteredTasks]);
  const managerTasks = useMemo(() => filteredTasks.filter(t => t.createdBy === "manager"), [filteredTasks]);

  const getTaskColor = (task: ManagerTask) => {
    const done = task.done ?? task.completed ?? false;
    if (done) return "bg-green-100";
    if (!task.dueDate) return "bg-white";
    const daysLeft = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000*60*60*24));
    if (daysLeft < 0) return "bg-red-200";
    if (daysLeft <= 3) return "bg-yellow-200";
    return "bg-white";
  };

  const TaskCard: React.FC<{ task: ManagerTask }> = ({ task }) => {
    const done = task.done ?? task.completed ?? false;
    return (
      <li className={`${getTaskColor(task)} flex flex-col md:flex-row justify-between items-start md:items-center p-3 rounded shadow transition`}>
        <div className="flex-1 space-y-1 md:space-y-0 md:flex md:items-center md:gap-3">
          <input type="text" value={task.eventId || ""} onChange={ev => handleUpdate(task.id, "eventId", ev.target.value)} className="border p-1 rounded w-full md:w-32" placeholder={t("eventId")}/>
          <input type="text" value={task.task} onChange={ev => handleUpdate(task.id, "task", ev.target.value)} className={`border p-1 rounded w-full md:flex-1 ${done ? "line-through text-gray-400" : ""}`} placeholder={t("task")}/>
          <input type="text" value={task.category || ""} onChange={ev => handleUpdate(task.id, "category", ev.target.value)} className="border p-1 rounded w-24" placeholder={t("category")}/>
          <select value={task.priority} onChange={ev => handleUpdate(task.id, "priority", ev.target.value as any)} className="border p-1 rounded w-24">
            <option value="low">{t("low")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="high">{t("high")}</option>
          </select>
          <input type="date" value={task.dueDate || ""} onChange={ev => handleUpdate(task.id, "dueDate", ev.target.value)} className="border p-1 rounded w-32"/>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={done} onChange={() => handleToggleDone(task.id)}/> {t("done")}
          </label>
          <span className="text-xs italic text-gray-500">({task.createdBy})</span>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button onClick={() => handleDelete(task.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1">
            <Trash2 className="h-4 w-4"/> {t("delete")}
          </button>
          <button onClick={() => { const newName = prompt(t("editTaskPrompt"), task.task); if(newName) handleUpdate(task.id,"task",newName); }} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1">
            <Edit2 className="h-4 w-4"/> {t("edit")}
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="manager-task-container p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t("managerTaskChecklist")}</h1>

      <p className="text-sm text-gray-500 mb-4">
        {t("total")}: {tasks.length} | {t("completed")}: {tasks.filter(t => (t.done ?? t.completed ?? false)).length} | {t("pending")}: {tasks.filter(t => !(t.done ?? t.completed ?? false)).length}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
        <input type="text" placeholder={t("eventId")} value={eventId} onChange={e => setEventId(e.target.value)} className="border p-2 rounded"/>
        <input type="text" placeholder={t("task")} value={taskInput} onChange={e => setTaskInput(e.target.value)} className="border p-2 rounded col-span-2"/>
        <input type="text" placeholder={t("category")} value={categoryInput} onChange={e => setCategoryInput(e.target.value)} className="border p-2 rounded"/>
        <select value={priorityInput} onChange={e => setPriorityInput(e.target.value as any)} className="border p-2 rounded">
          <option value="low">{t("low")}</option>
          <option value="medium">{t("medium")}</option>
          <option value="high">{t("high")}</option>
        </select>
        <input type="date" value={dueDateInput} onChange={e => setDueDateInput(e.target.value)} className="border p-2 rounded"/>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1 justify-center">
          <Plus className="h-4 w-4"/> {t("add")}
        </button>
      </div>

      <div className="mb-4">
        <input type="text" placeholder={t("searchTasks")} value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded w-full"/>
      </div>

      {managerTasks.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">{t("managerAddedTasks")}</h2>
          <ul className="space-y-2">{managerTasks.map(t => <TaskCard key={t.id} task={t} />)}</ul>
        </>
      )}
      {coupleTasks.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">{t("tasksFromCouples")}</h2>
          <ul className="space-y-2">{coupleTasks.map(t => <TaskCard key={t.id} task={t} />)}</ul>
        </>
      )}
      {protocolTasks.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">{t("tasksFromProtocol")}</h2>
          <ul className="space-y-2">{protocolTasks.map(t => <TaskCard key={t.id} task={t} />)}</ul>
        </>
      )}

      {filteredTasks.length === 0 && <p className="text-gray-500 text-center mt-4">{t("noTasksFound")}</p>}
    </div>
  );
};

export default ManagerTaskChecklist;
