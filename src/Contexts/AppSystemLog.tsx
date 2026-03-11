import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, getFromStorage, saveToStorage } from "../utils/StorageUtils";

/* =====================================================
   TYPES
===================================================== */

export type SystemLog = {
  id: string;
  action: string;        // LOGIN_SUCCESS, CREATE_EVENT, DELETE_VENDOR, etc.
  actor: string;         // Admin | Manager | Protocol | System
  description: string;   // Human-readable explanation
  timestamp: string;
};

type SystemLogContextType = {
  logs: SystemLog[];
  addLog: (action: string, actor: string, description: string) => void;
  deleteLog: (id: string) => void;
  clearLogs: () => void;
};

/* =====================================================
   CONTEXT
===================================================== */

const AppSystemLogContext = createContext<SystemLogContextType | undefined>(undefined);

/* =====================================================
   PROVIDER
===================================================== */

export const AppSystemLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<SystemLog[]>([]);

  /* ---------------- LOAD FROM STORAGE ---------------- */
  useEffect(() => {
    const storedLogs = getFromStorage<SystemLog[]>(STORAGE_KEYS.SYSTEMLOG, []);
    setLogs(storedLogs);
  }, []);

  /* ---------------- SAVE TO STORAGE ---------------- */
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SYSTEMLOG, logs);
  }, [logs]);

  /* =====================================================
     ACTIONS
  ===================================================== */

  const addLog = (action: string, actor: string, description: string) => {
    const newLog: SystemLog = {
      id: crypto.randomUUID(),
      action,
      actor,
      description,
      timestamp: new Date().toLocaleString(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <AppSystemLogContext.Provider value={{ logs, addLog, deleteLog, clearLogs }}>
      {children}
    </AppSystemLogContext.Provider>
  );
};

/* =====================================================
   CUSTOM HOOK
===================================================== */

export const useAppSystemLog = (): SystemLogContextType => {
  const context = useContext(AppSystemLogContext);
  if (!context) {
    throw new Error("useAppSystemLog must be used within AppSystemLogProvider");
  }
  return context;
};
