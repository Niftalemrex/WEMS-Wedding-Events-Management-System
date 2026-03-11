import React, { useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
} from "../utils/StorageUtils";
import { UserPlus, Briefcase } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ProtocolAssignments.css";

export type ProtocolAssignment = {
  id: string;
  staffName: string;
  role: string;
};

const ProtocolAssignments: React.FC = () => {
  const { t } = useAppSettings();

  const [assignments, setAssignments] = useState<ProtocolAssignment[]>([]);
  const [staffName, setStaffName] = useState("");
  const [role, setRole] = useState("");

  /* ------------------ Load from Storage ------------------ */
  useEffect(() => {
    setAssignments(
      getFromStorage<ProtocolAssignment[]>(STORAGE_KEYS.ASSIGNMENTS, [])
    );
  }, []);

  /* ------------------ Add Assignment ------------------ */
  const addAssignment = () => {
    if (!staffName.trim() || !role.trim()) return;

    const newAssignment: ProtocolAssignment = {
      id: crypto.randomUUID(),
      staffName: staffName.trim(),
      role: role.trim(),
    };

    addToStorageArray(STORAGE_KEYS.ASSIGNMENTS, newAssignment);
    setAssignments(prev => [...prev, newAssignment]);

    setStaffName("");
    setRole("");
  };

  return (
    <div className="protocol-assignments-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {t("protocolAssignments")}
      </h1>

      {/* -------- Add Assignment Form -------- */}
      <div className="assignment-form grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
        <input
          type="text"
          placeholder={t("staffName")}
          value={staffName}
          onChange={e => setStaffName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder={t("roleResponsibility")}
          value={role}
          onChange={e => setRole(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={addAssignment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          {t("addAssignment")}
        </button>
      </div>

      {/* -------- Assignment List -------- */}
      {assignments.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("noProtocolAssignments")}
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map(a => (
            <li
              key={a.id}
              className="assignment-card flex items-center gap-3 p-4 bg-white rounded shadow hover:shadow-lg transition"
            >
              <Briefcase className="h-6 w-6 text-indigo-500" />
              <div>
                <p className="font-semibold">{a.staffName}</p>
                <p className="text-sm text-gray-500">{a.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProtocolAssignments;
