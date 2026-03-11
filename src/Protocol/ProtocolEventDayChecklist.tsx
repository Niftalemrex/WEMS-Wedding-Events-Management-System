import React, { useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
} from "../utils/StorageUtils";
import { CheckCircle2, Circle, Plus, ClipboardList } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ProtocolEventDayChecklist.css";

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

const ProtocolEventDayChecklist: React.FC = () => {
  const { t } = useAppSettings();

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [text, setText] = useState("");

  /* ---------------- Load checklist ---------------- */
  useEffect(() => {
    setItems(
      getFromStorage<ChecklistItem[]>(
        STORAGE_KEYS.EVENT_DAY_CHECKLIST,
        []
      )
    );
  }, []);

  /* ---------------- Add checklist item ---------------- */
  const addItem = () => {
    if (!text.trim()) return;

    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      done: false,
    };

    addToStorageArray(STORAGE_KEYS.EVENT_DAY_CHECKLIST, newItem);
    setItems(prev => [...prev, newItem]);
    setText("");
  };

  /* ---------------- Toggle checklist item ---------------- */
  const toggleItem = (id: string) => {
    updateStorageArray<ChecklistItem>(
      STORAGE_KEYS.EVENT_DAY_CHECKLIST,
      i => i.id === id,
      i => ({ ...i, done: !i.done })
    );

    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, done: !i.done } : i
      )
    );
  };

  const completedCount = items.filter(i => i.done).length;

  return (
    <div className="protocol-checklist-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-indigo-600" />
        {t("eventDayChecklist")}
      </h1>

      {/* ✅ FIXED COUNT TEXT (NO interpolation object) */}
      <p className="text-sm text-gray-500 mb-6">
        {t("completed")} {completedCount} / {items.length}
      </p>

      {/* -------- Add Task -------- */}
      <div className="checklist-form flex gap-3 mb-6">
        <input
          type="text"
          placeholder={t("addChecklistTaskPlaceholder")}
          value={text}
          onChange={e => setText(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={addItem}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("add")}
        </button>
      </div>

      {/* -------- Checklist -------- */}
      {items.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noChecklistItems")}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map(item => (
            <li
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`checklist-item flex items-center gap-3 p-3 rounded shadow cursor-pointer transition ${
                item.done ? "completed" : ""
              }`}
            >
              {item.done ? (
                <CheckCircle2 className="text-green-600 h-5 w-5" />
              ) : (
                <Circle className="text-gray-400 h-5 w-5" />
              )}

              <span className="flex-1">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProtocolEventDayChecklist;
