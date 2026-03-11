import React, { useState, useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminProfile.css";

interface Profile {
  name: string;
  email: string;
  avatar: string;
}

interface AdminProfileProps {
  onProfileChange?: (profile: Profile) => void; // callback to notify sidebar
}

const AdminProfile: React.FC<AdminProfileProps> = ({ onProfileChange }) => {
  const { t } = useAppSettings();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(""); // Base64 string
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("admin-name") || t("defaultAdminName");
    const storedEmail = localStorage.getItem("admin-email") || "admin@example.com";
    const storedAvatar = localStorage.getItem("admin-avatar") || "";

    setName(storedName);
    setEmail(storedEmail);
    setAvatar(storedAvatar);
    setPreview(storedAvatar);

    if (onProfileChange) {
      onProfileChange({ name: storedName, email: storedEmail, avatar: storedAvatar });
    }
  }, [t, onProfileChange]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("admin-name", name);
    localStorage.setItem("admin-email", email);
    localStorage.setItem("admin-avatar", avatar);

    if (onProfileChange) {
      onProfileChange({ name, email, avatar });
    }

    alert(t("profileUpdated"));
  };

  return (
    <div className="admin-profile-container">
      <div className="content-wrapper">
        <h2 className="profile-title">{t("profile")}</h2>

        <div className="profile-form">
          <div className="avatar-section">
            <img
              src={preview || "/default-avatar.png"}
              alt={t("avatarPreview")}
              className="avatar-preview"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="avatar-upload-label">
              {t("changeAvatar")}
            </label>
          </div>

          <div className="input-group">
            <label className="input-label">{t("name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <button className="save-button" onClick={handleSave}>
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
