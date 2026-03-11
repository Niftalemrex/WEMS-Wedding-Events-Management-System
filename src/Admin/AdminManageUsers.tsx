import React, { useEffect, useState, useMemo } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  deleteFromStorageArray,
} from "../utils/StorageUtils";
import { Trash2, Plus, User } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AdminManageUsers.css";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "vendor";
};

const AdminManageUsers: React.FC = () => {
  const { t } = useAppSettings();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserItem["role"]>("manager");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUsers = getFromStorage<UserItem[]>(STORAGE_KEYS.USERS, []);
    setUsers(storedUsers);
  }, []);

  const addUser = () => {
    if (!name || !email) return;

    const newUser: UserItem = {
      id: Date.now().toString(),
      name,
      email,
      role,
    };

    addToStorageArray(STORAGE_KEYS.USERS, newUser);
    setUsers(prev => [...prev, newUser]);

    setName("");
    setEmail("");
    setRole("manager");
  };

  const deleteUser = (id: string) => {
    if (!window.confirm(t("reports"))) return;

    deleteFromStorageArray<UserItem>(STORAGE_KEYS.USERS, u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        u =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  return (
    <div className="admin-manage-users-container p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("users")}
      </h1>

      {/* Add User Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder={t("profile")}
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value as UserItem["role"])}
          className="border p-2 rounded w-full"
        >
          <option value="admin">Admin</option>
          <option value="manager">{t("events")}</option>
          <option value="vendor">{t("vendors")}</option>
        </select>

        <button
          onClick={addUser}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("users")}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t("analytics")}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* User List */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center">
          {t("reports")}
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredUsers.map(u => (
            <li
              key={u.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded shadow hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-gray-500 text-sm">
                    {u.email} • {u.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => deleteUser(u.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                {t("logout")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminManageUsers;
