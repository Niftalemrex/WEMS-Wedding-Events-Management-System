// src/Couple/CoupleProfile.tsx
import React, { useState, useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./CoupleProfile.css";

interface UserProfile {
  name: string;
  email: string;
  avatar: string; // always a string
}

interface CoupleProfileProps {
  userProfile?: UserProfile;
  setUserProfile?: (profile: UserProfile) => void;
}

const CoupleProfile: React.FC<CoupleProfileProps> = ({ userProfile, setUserProfile }) => {
  const { t } = useAppSettings();

  const [name, setName] = useState<string>(userProfile?.name || "");
  const [email, setEmail] = useState<string>(userProfile?.email || "");
  const [avatar, setAvatar] = useState<string>(userProfile?.avatar || "");
  const [preview, setPreview] = useState<string>(userProfile?.avatar || "/default-avatar.png");

  // Load profile from localStorage if props not provided
  useEffect(() => {
    if (!userProfile) {
      setName(localStorage.getItem("couple-name") || "Couple User");
      setEmail(localStorage.getItem("couple-email") || "couple@example.com");
      const storedAvatar = localStorage.getItem("couple-avatar") || "";
      setAvatar(storedAvatar);
      setPreview(storedAvatar || "/default-avatar.png");
    }
  }, [userProfile]);

  // Handle avatar upload and preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      // temporary blob URL for saving
      setAvatar(URL.createObjectURL(file));
    }
  };

  // Save changes
  const handleSave = () => {
    const profileData: UserProfile = {
      name,
      email,
      avatar: avatar || "/default-avatar.png",
    };

    if (userProfile && setUserProfile) {
      setUserProfile(profileData);
    } else {
      localStorage.setItem("couple-name", name);
      localStorage.setItem("couple-email", email);
      localStorage.setItem("couple-avatar", profileData.avatar);

      // trigger update events
      window.dispatchEvent(new Event("storage"));
    }

    alert(t("profileUpdated") || "Profile updated!");
  };

  return (
    <div className="couple-profile-page">
      <h2>{t("profile")}</h2>

      <div className="profile-form">
        <div className="avatar-section">
          <img
            src={preview}
            alt="Avatar Preview"
            className="avatar-preview"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <div className="input-group">
          <label>{t("name")}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-group">
          <label>{t("email")}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <button className="save-button" onClick={handleSave}>
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
};

export default CoupleProfile;
