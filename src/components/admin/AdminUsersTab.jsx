import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, CheckCircle, X, Search } from "lucide-react";
import { adminUsersAPI, departmentAPI } from "../../services/api";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  role: "admin",
  department: "",
  password: "",
  isActive: true,
};

const AdminUsersTab = ({ onError = () => {}, onSuccess = () => {} }) => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUsersAPI.getAll();
      const payload = response.data?.users || response.data || [];
      setUsers(Array.isArray(payload) ? payload : []);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load users.";
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const response = await departmentAPI.getAll();
      const payload = response.data.data?.departments || response.data.data.departments || [];
      setDepartments(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("Failed to load departments", error);
      onError("Failed to load departments.");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      return [
        user.firstName,
        user.lastName,
        user.email,
        user.role,
        user.department,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [search, users]);

  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const resetForm = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (user) => {
    setEditingId(user._id || user.id);
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "admin",
      department: user.department || "",
      password: "",
      isActive: user.isActive !== false,
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setSubmitting(true);
      await adminUsersAPI.deleteUser(id);
      setUsers((prev) =>
        prev.filter((user) => user._id !== id && user.id !== id),
      );
      onSuccess("User deleted successfully.");
    } catch (error) {
      onError(error.response?.data?.message || "Unable to delete user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.firstName || !form.email) {
      onError("Please provide a name and email.");
      return;
    }

    if (!editingId && !form.password) {
      onError("Password is required when creating a new user.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          role: form.role,
          department: form.department,
          isActive: form.isActive,
        };
        await adminUsersAPI.updateUser(editingId, payload);
        setUsers((prev) =>
          prev.map((user) =>
            (user._id || user.id) === editingId
              ? { ...user, ...payload }
              : user,
          ),
        );
        onSuccess("User updated successfully.");
      } else {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          role: form.role,
          department: form.department,
          password: form.password,
        };
        const response = await adminUsersAPI.create(payload);
        const createdUser = response.data?.user || response.data;
        setUsers((prev) => [createdUser, ...prev]);
        onSuccess("User created successfully.");
      }

      resetForm();
    } catch (error) {
      onError(error.response?.data?.message || "Failed to save user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-3xl shadow-lg border border-slate-200"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold">
            Super Admin Tools
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Users
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold">Total Users</p>
            <p className="text-2xl mt-1 font-bold">{users.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] font-semibold text-slate-500">
                {editingId ? "Edit User" : "Add User"}
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {editingId ? "Update account details" : "Create a new user"}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Plus size={18} />
              <span className="text-sm">Quick access</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm text-slate-600">
                First Name
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="mt-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="John"
                />
              </label>
              <label className="flex flex-col text-sm text-slate-600">
                Last Name
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="mt-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Doe"
                />
              </label>
            </div>

            <label className="flex flex-col text-sm text-slate-600">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                placeholder="john@example.com"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm text-slate-600">
                Role
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="flex flex-col text-sm text-slate-600">
                Department
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  disabled={departmentsLoading}
                  className="mt-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option
                      key={dept._id || dept.id}
                      value={dept.name || dept._id}
                    >
                      {dept.name || dept.departmentName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {!editingId && (
              <label className="flex flex-col text-sm text-slate-600">
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Create a password"
                />
              </label>
            )}

            {editingId && (
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Keep account active
              </label>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? "Update User" : "Create User"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
                User List
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                All system users
              </h3>
            </div>
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              {filteredUsers.length} records
            </span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200">
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr
                      key={user._id || user.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{user.email}</td>
                      <td className="px-4 py-4 text-slate-700 capitalize">
                        {user.role}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {user.department || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user._id || user.id)}
                            disabled={submitting}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

// ✅ CRITICAL FIX: Changed from 'export default' to named export
// This matches the named import in AdminDashboard.jsx: import {AdminUsersTab}
export { AdminUsersTab };