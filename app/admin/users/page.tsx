"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { UserModel } from "@/types/user_models";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/getUsers");
      if (response.data.success) {
        setUsers(response.data.users);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch users");
      }
    } catch (err: any) {
      const errorMessage = (err as Error).message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && users.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user) =>
                user.role !== "admin" && (
                  <tr key={user.uid}>
                    <td className="border px-4 py-2">{user.uid}</td>
                    <td className="border px-4 py-2">{user.username || "-"}</td>
                    <td className="border px-4 py-2">{user.email || "-"}</td>
                    <td className="border px-4 py-2">{user.role || "-"}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
