"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "@/context/ProductContext.jsx";
import { 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiSearch,
  FiFilter,
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiMoreVertical,
  FiMail,
  FiCalendar,
  FiShield,
  FiCheckCircle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ChangeUserRole from "@/components/ChangeUserRole.jsx";
import { useSelector } from "react-redux";

/* Avatar color generator with better gradients */
const getAvatarColor = (letter) => {
  if (!letter) return "from-slate-400 to-slate-600";
  const gradients = [
    "from-red-400 to-rose-600",
    "from-orange-400 to-amber-600",
    "from-amber-400 to-yellow-600",
    "from-yellow-400 to-lime-600",
    "from-green-400 to-emerald-600",
    "from-emerald-400 to-teal-600",
    "from-teal-400 to-cyan-600",
    "from-cyan-400 to-sky-600",
    "from-sky-400 to-blue-600",
    "from-blue-400 to-indigo-600",
    "from-indigo-400 to-violet-600",
    "from-violet-400 to-purple-600",
    "from-purple-400 to-fuchsia-600",
    "from-fuchsia-400 to-pink-600",
    "from-pink-400 to-rose-600",
    "from-rose-400 to-red-600",
  ];
  return gradients[letter.toUpperCase().charCodeAt(0) % gradients.length];
};

/* Stat Card Component */
const StatCard = ({ title, value, icon: Icon, trend, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative group"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="text-xl text-white" />
        </div>
      </div>
    </div>
  </motion.div>
);

/* User Table Row Component */
const UserTableRow = ({ user, index, onEdit, currentUser }) => {
  const isCurrentUser = currentUser?._id === user._id;
  
  return (
    <motion.tr 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group ${isCurrentUser ? 'bg-indigo-50/50' : ''}`}
    >
      {/* USER */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(user?.name?.charAt(0))} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white`}>
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-800">{user?.name}</p>
              {isCurrentUser && (
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {user?._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </td>

      {/* EMAIL */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-slate-600">
          <FiMail className="text-slate-400 text-xs" />
          <span className="text-sm">{user?.email}</span>
        </div>
      </td>

      {/* ROLE */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
          user?.role === 'Admin' 
            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
            : user?.role === 'Vendor'
            ? 'bg-amber-100 text-amber-700 border border-amber-200'
            : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
        }`}>
          <FiShield className="text-xs" />
          {user?.role || "Customer"}
        </span>
      </td>

      {/* CREATED */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <FiCalendar className="text-slate-400" />
          {new Date(user?.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </td>

      {/* STATUS */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Active
        </span>
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
            title="View Details"
          >
            <FiEye size={16} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(user)}
            className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
            title="Change Role"
          >
            <FiEdit size={16} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-200"
            title="Delete User"
          >
            <FiTrash2 size={16} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

/* Mobile User Card Component */
const UserMobileCard = ({ user, index, onEdit, currentUser }) => {
  const isCurrentUser = currentUser?._id === user._id;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-5 mb-4 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 ${isCurrentUser ? 'ring-2 ring-indigo-500/20' : ''}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAvatarColor(user?.name?.charAt(0))} flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white`}>
          {user?.name?.charAt(0) || "U"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800">{user?.name}</h3>
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full">
                YOU
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
            <FiMail className="text-xs" />
            {user?.email}
          </p>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <FiMoreVertical className="text-slate-400" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
          user?.role === 'Admin' 
            ? 'bg-purple-100 text-purple-700' 
            : user?.role === 'Vendor'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-indigo-100 text-indigo-700'
        }`}>
          <FiShield className="text-xs" />
          {user?.role || "Customer"}
        </span>
        
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Active
        </span>
        
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          <FiCalendar className="text-xs" />
          {new Date(user?.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
        >
          <FiEye size={16} />
          View
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEdit(user)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-600 rounded-xl font-medium hover:bg-amber-100 transition-colors"
        >
          <FiEdit size={16} />
          Edit Role
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium hover:bg-rose-100 transition-colors"
        >
          <FiTrash2 size={16} />
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

const AllUsers = () => {
  const { allUsers, getAllUsers, updateUserData } = useContext(Context);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUser, setUpdateUser] = useState({ name: "", email: "", role: "", _id: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const currentUser = useSelector((state) => state?.user?.user);

  useEffect(() => { getAllUsers(); }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    return allUsers?.filter(user => {
      const matchesSearch = user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user?.role === roleFilter;
      return matchesSearch && matchesRole;
    }) || [];
  }, [allUsers, searchTerm, roleFilter]);

  // Stats
  const totalUsers = allUsers?.length || 0;
  const adminCount = allUsers?.filter(u => u?.role === 'ADMIN').length || 0;
  const newThisMonth = allUsers?.filter(u => {
    const created = new Date(u?.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length || 0;

  const handleOpenModal = (userData) => {
    setSelectedUser(userData);
    setUpdateUser({
      _id: userData._id,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "GENERAL",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-slate-500 mt-1">Manage customer accounts and permissions</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 font-medium hover:shadow-xl transition-all"
            >
              <FiUserPlus className="text-lg" />
              Add User
            </motion.button>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Total Users" 
              value={totalUsers.toLocaleString()} 
              icon={FiUsers}
              trend="+12 this month"
              gradient="from-blue-500 to-indigo-600"
              delay={0}
            />
            <StatCard 
              title="Administrators" 
              value={adminCount.toLocaleString()} 
              icon={FiUserCheck}
              trend="Active now"
              gradient="from-purple-500 to-pink-600"
              delay={0.1}
            />
            <StatCard 
              title="New This Month" 
              value={newThisMonth.toLocaleString()} 
              icon={FiCheckCircle}
              trend="+24% growth"
              gradient="from-emerald-500 to-teal-600"
              delay={0.2}
            />
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
              
              <div className="relative md:w-64">
                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="Vendor">Vendor</option>
                  <option value="GENERAL">Customer</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DESKTOP TABLE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <UserTableRow
                      key={user._id}
                      user={user}
                      index={index}
                      onEdit={handleOpenModal}
                      currentUser={currentUser}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <FiUsers className="text-slate-400 text-2xl" />
                        </div>
                        <p className="text-slate-500 font-medium">No users found</p>
                        <p className="text-slate-400 text-sm mt-1">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* MOBILE CARDS */}
        <div className="md:hidden">
          {filteredUsers.length > 0 ? (
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <UserMobileCard
                  key={user._id}
                  user={user}
                  index={index}
                  onEdit={handleOpenModal}
                  currentUser={currentUser}
                />
              ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <FiUsers className="text-slate-400 text-3xl" />
              </div>
              <p className="text-slate-500 font-medium">No users found</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* CHANGE ROLE MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <ChangeUserRole
            user={selectedUser}
            updateUser={updateUser}
            setUpdateUser={setUpdateUser}
            onClose={() => setSelectedUser(null)}
            onSave={(id, newRole) => updateUserData(id, newRole)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllUsers;