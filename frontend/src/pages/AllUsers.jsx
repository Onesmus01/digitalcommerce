"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/context/ProductContext.jsx";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import ChangeUserRole from "@/components/ChangeUserRole.jsx";
import { useSelector } from "react-redux";

/* Avatar color generator */
const getAvatarColor = (letter) => {
  if (!letter) return "bg-slate-600";
  const colors = [
    "bg-red-500","bg-orange-500","bg-amber-500","bg-yellow-500",
    "bg-green-500","bg-emerald-500","bg-teal-500","bg-cyan-500",
    "bg-sky-500","bg-blue-500","bg-indigo-500","bg-violet-500",
    "bg-purple-500","bg-fuchsia-500","bg-pink-500","bg-rose-500",
  ];
  return colors[letter.toUpperCase().charCodeAt(0) % colors.length];
};

const AllUsers = () => {
  const { allUsers, getAllUsers, updateUserData } = useContext(Context);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUser, setUpdateUser] = useState({ name: "", email: "", role: "", _id: "" });
  const currentUser = useSelector((state) => state?.user?.user);

  useEffect(() => { getAllUsers(); }, []);

  const handleOpenModal = (userData) => {
    setSelectedUser(userData);
    setUpdateUser({
      _id: userData._id,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "Customer",
    });
  };

  return (
    <div className="p-6 sm:p-8 bg-gray-50 min-h-screen">

      <div className="bg-white shadow-xl rounded-2xl border border-gray-200">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Customers
          </h2>
          <span className="text-sm text-gray-500">Total: {allUsers?.length || 0}</span>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allUsers?.length ? (
                allUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-all duration-150">
                    {/* USER */}
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold ${getAvatarColor(u?.name?.charAt(0))} shadow ring-1 ring-gray-300`}>
                        {u?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u?.name}</p>
                        <p className="text-xs text-gray-400">ID: {u?._id?.slice(0, 8)}</p>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-4 text-gray-600">{u?.email}</td>

                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 shadow-sm">
                        {u?.role || "Customer"}
                      </span>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4 text-gray-600">{new Date(u?.createdAt).toLocaleDateString()}</td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 shadow-sm animate-pulse">
                        Active
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition shadow" title="View">
                          <FiEye size={18} />
                        </button>
                        <button onClick={() => handleOpenModal(u)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition shadow" title="Change Role">
                          <FiEdit size={18} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition shadow" title="Delete">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-lg">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-100 mt-4">
          {allUsers?.map((u) => (
            <div key={u._id} className="p-5 bg-white rounded-xl shadow-md mb-4 transition hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-semibold ${getAvatarColor(u?.name?.charAt(0))} shadow ring-1 ring-gray-300`}>
                  {u?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{u?.name}</p>
                  <p className="text-xs text-gray-500">{u?.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold shadow-sm">{u?.role || "Customer"}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold shadow-sm animate-pulse">Active</span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold shadow-sm">{new Date(u?.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <FiEye className="text-indigo-600 cursor-pointer hover:scale-105 transition" size={18} />
                <FiEdit onClick={() => handleOpenModal(u)} className="text-amber-600 cursor-pointer hover:scale-105 transition" size={18} />
                <FiTrash2 className="text-red-600 cursor-pointer hover:scale-105 transition" size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHANGE ROLE MODAL */}
      {selectedUser && (
        <ChangeUserRole
          user={selectedUser}
          updateUser={updateUser}
          setUpdateUser={setUpdateUser}
          onClose={() => setSelectedUser(null)}
          onSave={(id, newRole) => updateUserData(id, newRole)}
        />
      )}
    </div>
  );
};

export default AllUsers;