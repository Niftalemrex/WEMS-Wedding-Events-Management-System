import React, { useState, useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerProfile.css";

interface ManagerProfileProps {
  userProfile?: {
    name: string;
    email: string;
    avatar?: string;
  };
  setUserProfile?: (profile: { name: string; email: string; avatar: string }) => void;
}

const ManagerProfile: React.FC<ManagerProfileProps> = ({ userProfile, setUserProfile }) => {
  const { t } = useAppSettings();

  const [name, setName] = useState(userProfile?.name || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [avatar, setAvatar] = useState(userProfile?.avatar || "");
  const [preview, setPreview] = useState(userProfile?.avatar || "");

  // Load profile from localStorage if no userProfile prop
  useEffect(() => {
    if (!userProfile) {
      setName(localStorage.getItem("manager-name") || t("defaultManagerName") || "Manager User");
      setEmail(localStorage.getItem("manager-email") || "manager@example.com");
      const storedAvatar = localStorage.getItem("manager-avatar") || "";
      setAvatar(storedAvatar);
      setPreview(storedAvatar);
    }
  }, [userProfile, t]);

  // Handle avatar upload with live preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      setAvatar(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSave = () => {
    localStorage.setItem("manager-name", name);
    localStorage.setItem("manager-email", email);
    localStorage.setItem("manager-avatar", avatar);

    window.dispatchEvent(new Event("storage"));

    if (setUserProfile) setUserProfile({ name, email, avatar });

    alert(t("profileUpdated") || "Profile updated!");
  };

  return (
    <div className="manager-profile-page p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">{t("profile")}</h2>

      <div className="profile-form space-y-4 bg-white p-4 rounded shadow">
        {/* Avatar Section */}
        <div className="avatar-section flex flex-col items-center">
          <img
            src={preview || "/default-avatar.png"}
            alt={t("avatarPreview") || "Avatar Preview"}
            className="avatar-preview w-24 h-24 rounded-full object-cover mb-2"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        {/* Name Input */}
        <div className="input-group flex flex-col">
          <label className="font-semibold mb-1">{t("name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Email Input */}
        <div className="input-group flex flex-col">
          <label className="font-semibold mb-1">{t("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="save-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
};

export default ManagerProfile;
