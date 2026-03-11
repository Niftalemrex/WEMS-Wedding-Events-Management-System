import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2 } from "lucide-react";
import "./CouplesTaskChecklist.css";

export type TaskItem = {
  id: string;
  eventId?: string;
  task: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: "couple" | "protocol";
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string;
};

const CoupleTaskChecklist: React.FC<{ eventId?: string }> = ({ eventId }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<"low" | "medium" | "high">("medium");
  const [dueDateInput, setDueDateInput] = useState("");

  // Load tasks
  useEffect(() => {
    const storedTasks = getFromStorage<TaskItem[]>(STORAGE_KEYS.TASKS, []);
    setTasks(storedTasks);
  }, []);

  // Add task
  const addTask = (origin: "couple" | "protocol" = "couple") => {
    if (!taskInput.trim()) return alert("Task cannot be empty.");

    const newTask: TaskItem = {
      id: Date.now().toString(),
      eventId: eventId?.trim() || undefined,
      task: taskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      createdBy: origin,
      priority: priorityInput,
      category: categoryInput?.trim() || undefined,
      dueDate: dueDateInput || undefined,
    };

    addToStorageArray(STORAGE_KEYS.TASKS, newTask);
    setTasks(prev => [...prev, newTask]);

    setTaskInput("");
    setCategoryInput("");
    setPriorityInput("medium");
    setDueDateInput("");
  };

  // Toggle completion
  const toggleTask = (id: string) => {
    const now = new Date().toISOString();
    updateStorageArray<TaskItem>(
      STORAGE_KEYS.TASKS,
      t => t.id === id,
      t => ({ ...t, completed: !t.completed, updatedAt: now })
    );
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: now } : t));
  };

  // Delete task
  const deleteTask = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    deleteFromStorageArray<TaskItem>(STORAGE_KEYS.TASKS, t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Update task field
  const updateTask = (id: string, field: keyof TaskItem, value: any) => {
    const now = new Date().toISOString();
    updateStorageArray<TaskItem>(
      STORAGE_KEYS.TASKS,
      t => t.id === id,
      t => ({ ...t, [field]: value || undefined, updatedAt: now })
    );
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value || undefined, updatedAt: now } : t));
  };

  // Stats
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
    <div className="couple-task-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Task Checklist</h1>
      <p className="text-sm text-gray-500 mb-4">
        Total: {stats.total} | Completed: {stats.completed} | Pending: {stats.pending} | High: {stats.byPriority.high} | Medium: {stats.byPriority.medium} | Low: {stats.byPriority.low}
      </p>

      {/* Add Task Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
        <input
          type="text"
          placeholder="Task name..."
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={priorityInput}
          onChange={e => setPriorityInput(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDateInput}
          onChange={e => setDueDateInput(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => addTask("couple")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks
            .sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              if (priorityOrder[a.priority] !== priorityOrder[b.priority])
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              if (a.dueDate && b.dueDate)
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map(t => {
              const done = t.completed;
              return (
                <li key={t.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-white rounded shadow hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      value={t.task}
                      onChange={e => updateTask(t.id, "task", e.target.value)}
                      className={`border p-1 rounded w-full md:flex-1 ${done ? "line-through text-gray-400" : ""}`}
                    />
                    <input
                      type="text"
                      value={t.category || ""}
                      onChange={e => updateTask(t.id, "category", e.target.value)}
                      placeholder="Category"
                      className="border p-1 rounded w-24"
                    />
                    <select
                      value={t.priority}
                      onChange={e => updateTask(t.id, "priority", e.target.value as any)}
                      className="border p-1 rounded w-24"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <input
                      type="date"
                      value={t.dueDate || ""}
                      onChange={e => updateTask(t.id, "dueDate", e.target.value)}
                      className="border p-1 rounded w-32"
                    />
                    <input
                      type="text"
                      value={t.eventId || ""}
                      onChange={e => updateTask(t.id, "eventId", e.target.value)}
                      placeholder="Event ID"
                      className="border p-1 rounded w-32"
                    />
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={done} onChange={() => toggleTask(t.id)} />
                      Done
                    </label>
                    <span className="text-xs italic text-gray-500">({t.createdBy})</span>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default CoupleTaskChecklist;
