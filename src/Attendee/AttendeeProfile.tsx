// src/Attendee/AttendeeProfile.tsx
import React, { useState, useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AttendeeProfile.css";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface AttendeeProfileProps {
  userProfile: UserProfile;
}

const AttendeeProfile: React.FC<AttendeeProfileProps> = ({ userProfile }) => {
  const { t } = useAppSettings();

  const [name, setName] = useState(userProfile.name || "");
  const [email, setEmail] = useState(userProfile.email || "");
  const [avatar, setAvatar] = useState(userProfile.avatar || "");
  const [preview, setPreview] = useState(userProfile.avatar || "");

  // Load attendee profile from localStorage on mount
  useEffect(() => {
    setName(localStorage.getItem("attendee-name") || userProfile.name || "");
    setEmail(localStorage.getItem("attendee-email") || userProfile.email || "");
    const storedAvatar = localStorage.getItem("attendee-avatar") || userProfile.avatar || "";
    setAvatar(storedAvatar);
    setPreview(storedAvatar);
  }, [userProfile]);

  // Handle avatar upload and live preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Store temporary blob URL for storage
      setAvatar(URL.createObjectURL(file));
    }
  };

  // Save profile changes to localStorage
  const handleSave = () => {
    localStorage.setItem("attendee-name", name);
    localStorage.setItem("attendee-email", email);
    localStorage.setItem("attendee-avatar", avatar);

    // Trigger a storage event for live updates
    window.dispatchEvent(new Event("storage"));

    alert(t("profileUpdated")); // Inline key
  };

  return (
    <div className="attendee-profile-page p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t("profile")}</h2>

      <div className="profile-form flex flex-col gap-4">
        {/* Avatar Upload */}
        <div className="avatar-section flex flex-col items-center gap-2">
          <img
            src={preview || "/default-avatar.png"}
            alt={t("avatarPreview")}
            className="avatar-preview rounded-full w-24 h-24 object-cover border"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        {/* Name Input */}
        <div className="input-group flex flex-col">
          <label className="font-semibold">{t("name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            placeholder={t("enterName")}
          />
        </div>

        {/* Email Input */}
        <div className="input-group flex flex-col">
          <label className="font-semibold">{t("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            placeholder={t("enterEmail")}
          />
        </div>

        {/* Save Button */}
        <button
          className="save-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSave}
        >
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
};

export default AttendeeProfile;
