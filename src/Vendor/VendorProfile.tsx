// src/Vendor/VendorProfile.tsx
import React, { useState, useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./VendorProfile.css";

interface VendorProfileProps {
  userProfile?: {
    name: string;
    email: string;
    avatar: string;
  };
  setUserProfile?: (profile: { name: string; email: string; avatar: string }) => void;
}

const VendorProfile: React.FC<VendorProfileProps> = ({ userProfile, setUserProfile }) => {
  const { t } = useAppSettings();

  // State initialization
  const [name, setName] = useState(userProfile?.name || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [avatar, setAvatar] = useState(userProfile?.avatar || "");
  const [preview, setPreview] = useState(userProfile?.avatar || "");

  // Load from localStorage if props are not provided
  useEffect(() => {
    if (!userProfile) {
      setName(localStorage.getItem("vendor-name") || t("defaultVendorName"));
      setEmail(localStorage.getItem("vendor-email") || "vendor@example.com");
      const storedAvatar = localStorage.getItem("vendor-avatar") || "";
      setAvatar(storedAvatar);
      setPreview(storedAvatar);
    }
  }, [userProfile, t]);

  // Handle avatar preview
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
    if (setUserProfile) {
      setUserProfile({ name, email, avatar });
    } else {
      localStorage.setItem("vendor-name", name);
      localStorage.setItem("vendor-email", email);
      localStorage.setItem("vendor-avatar", avatar);

      window.dispatchEvent(new Event("storage"));
    }

    alert(t("profileUpdated"));
  };

  return (
    <div className="vendor-profile-page max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">{t("profile")}</h2>

      <div className="profile-form space-y-4">
        <div className="avatar-section flex flex-col items-center gap-2">
          <img
            src={preview || "/default-avatar.png"}
            alt={t("avatarPreview")}
            className="avatar-preview w-24 h-24 rounded-full object-cover border"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <div className="input-group flex flex-col">
          <label className="font-medium">{t("name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="input-group flex flex-col">
          <label className="font-medium">{t("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <button
          className="save-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
};

export default VendorProfile;
