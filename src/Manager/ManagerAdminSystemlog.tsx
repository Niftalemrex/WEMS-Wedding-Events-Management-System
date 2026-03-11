import React, { useEffect, useState } from "react";

// ✅ Correct import (all lowercase)
import { STORAGE_KEYS, getFromStorage, addToStorageArray, updateStorageArray, deleteFromStorageArray } from "../utils/StorageUtils";

export type SystemLogItem = {
  id: string;
  action: string;
  timestamp: string;
  userRole: string;
};

const ManagerAdminSystemlog: React.FC = () => {
  const [logs, setLogs] = useState<SystemLogItem[]>([]);

  // ✅ Use the correct key from STORAGE_KEYS
  useEffect(() => setLogs(getFromStorage(STORAGE_KEYS.SYSTEMLOG, [])), []);

  return (
    <div>
      <h2>Manager - System Log</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            [{log.timestamp}] ({log.userRole}) - {log.action}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerAdminSystemlog;
