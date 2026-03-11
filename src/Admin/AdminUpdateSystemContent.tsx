import React, { useState, useEffect } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
} from "../utils/StorageUtils";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminUpdateSystemContent.css";

const AdminUpdateSystemContent: React.FC = () => {
  const { t } = useAppSettings();

  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Load existing content on mount
  useEffect(() => {
    const storedContent = getFromStorage<string>(
      STORAGE_KEYS.SYSTEM_CONTENT,
      ""
    );
    setContent(storedContent);
  }, []);

  const handleSave = () => {
    if (!content.trim()) {
      setStatus(t("systemContentEmpty"));
      return;
    }

    saveToStorage(STORAGE_KEYS.SYSTEM_CONTENT, content);
    setStatus(t("systemContentSaved"));
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="admin-update-system-content-container p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {t("updateSystemContent")}
      </h1>

      <textarea
        className="w-full border rounded p-3 h-48 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        placeholder={t("systemContentPlaceholder")}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          {t("save")}
        </button>

        {status && (
          <span
            className={`${
              status === t("systemContentSaved")
                ? "text-green-600"
                : "text-red-600"
            } font-medium`}
          >
            {status}
          </span>
        )}
      </div>

      {/* Live Preview */}
      {content && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">
            {t("livePreview")}
          </h2>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdateSystemContent;
