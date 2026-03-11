// src/Protocol/ProtocolProfile.tsx
import React, { useState, useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ProtocolProfile.css";

interface ProtocolProfileProps {
  userProfile: {
    name: string;
    email: string;
    avatar?: string;
  };
  setUserProfile?: (profile: {
    name: string;
    email: string;
    avatar?: string;
  }) => void;
}

const ProtocolProfile: React.FC<ProtocolProfileProps> = ({
  userProfile,
  setUserProfile,
}) => {
  const { t } = useAppSettings();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [avatar, setAvatar] = useState(userProfile.avatar || "");
  const [preview, setPreview] = useState(userProfile.avatar || "");

  useEffect(() => {
    setName(
      localStorage.getItem("protocol-name") ||
        userProfile.name
    );
    setEmail(
      localStorage.getItem("protocol-email") ||
        userProfile.email
    );

    const storedAvatar =
      localStorage.getItem("protocol-avatar") ||
      userProfile.avatar ||
      "";

    setAvatar(storedAvatar);
    setPreview(storedAvatar);
  }, [userProfile]);

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () =>
        setPreview(reader.result as string);

      reader.readAsDataURL(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    localStorage.setItem("protocol-name", name);
    localStorage.setItem("protocol-email", email);
    localStorage.setItem("protocol-avatar", avatar);

    // Notify other components (e.g., sidebar) of the update
    window.dispatchEvent(new Event("storage"));

    if (setUserProfile) {
      setUserProfile({ name, email, avatar });
    }

    alert(t("profileUpdated"));
  };

  return (
    <div className="protocol-profile-page">
      <h2>{t("profile")}</h2>

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
          />
        </div>

        <div className="input-group">
          <label>{t("name")}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>{t("email")}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button
          className="save-button"
          onClick={handleSave}
        >
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
};

export default ProtocolProfile;
