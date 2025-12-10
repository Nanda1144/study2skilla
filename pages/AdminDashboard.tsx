
import React, { useEffect, useState } from 'react';
import { getStoredUsers, toggleUserStatus } from '../services/storage';
import { UserProfile } from '../types';
import { Users, Search, Trash2, Mail, Ban, CheckCircle, Info, X } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const refreshUsers = () => {
    setUsers(getStoredUsers());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleToggleStatus = (email: string) => {
    toggleUserStatus(email);
    refreshUsers();
  };

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Administration Dashboard</h2>
            <p className="text-slate-400">Monitor active users and their progress.</p>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-500/30">
             <Users className="text-indigo-400" />
             <span className="text-white font-bold">{users.length}</span>
             <span className="text-slate-400 text-sm">Registered Users</span>
          </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center">
             <Search className="text-slate-500 mr-2" size={20} />
             <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-white w-full"
             />
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-300 uppercase font-medium">
                   <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Domain</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                   {filteredUsers.map((user) => (
                      <tr key={user.email} className="hover:bg-slate-800/50 transition">
                         <td className="px-6 py-4">
                            <div className="flex items-center">
                               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold mr-3">
                                  {user.name.charAt(0)}
                               </div>
                               <div>
                                  <div className="font-medium text-white">{user.name}</div>
                                  <div className="text-xs text-slate-500">{user.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">
                               {user.domain}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-300'
                            }`}>
                               {user.role || 'student'}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            {user.status === 'disabled' ? (
                                <span className="flex items-center text-rose-400 text-xs font-bold"><Ban size={12} className="mr-1"/> Disabled</span>
                            ) : (
                                <span className="flex items-center text-emerald-400 text-xs font-bold"><CheckCircle size={12} className="mr-1"/> Active</span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                               <button 
                                  onClick={() => setSelectedUser(user)}
                                  className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg"
                                  title="View Details"
                               >
                                  <Info size={16} />
                               </button>
                               {user.role !== 'admin' && (
                                   <button 
                                      onClick={() => handleToggleStatus(user.email)}
                                      className={`p-2 rounded-lg transition ${
                                          user.status === 'disabled' 
                                          ? 'text-emerald-500 hover:bg-emerald-500/10' 
                                          : 'text-rose-500 hover:bg-rose-500/10'
                                      }`}
                                      title={user.status === 'disabled' ? "Enable Account" : "Disable Account"}
                                   >
                                      {user.status === 'disabled' ? <CheckCircle size={16} /> : <Ban size={16} />}
                                   </button>
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {filteredUsers.length === 0 && (
                 <div className="p-8 text-center text-slate-500">
                     No users found matching "{searchTerm}"
                 </div>
             )}
          </div>
       </div>

       {/* User Details Modal */}
       {selectedUser && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
               <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
                   <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                       <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                       <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                           <X size={20} />
                       </button>
                   </div>
                   <div className="p-6 space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="text-xs text-slate-500 uppercase font-bold">University</label>
                               <p className="text-white">{selectedUser.university}</p>
                           </div>
                           <div>
                               <label className="text-xs text-slate-500 uppercase font-bold">Year</label>
                               <p className="text-white">{selectedUser.year}</p>
                           </div>
                           <div>
                               <label className="text-xs text-slate-500 uppercase font-bold">Email</label>
                               <p className="text-white">{selectedUser.email}</p>
                           </div>
                           <div>
                               <label className="text-xs text-slate-500 uppercase font-bold">Contact Method</label>
                               <p className="text-white capitalize">{selectedUser.contactMethod || 'email'}</p>
                           </div>
                       </div>
                       
                       <div>
                           <label className="text-xs text-slate-500 uppercase font-bold">Skills</label>
                           <div className="flex flex-wrap gap-2 mt-1">
                               {selectedUser.skills.length > 0 ? selectedUser.skills.map(s => (
                                   <span key={s} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{s}</span>
                               )) : <span className="text-slate-500 italic">No skills listed</span>}
                           </div>
                       </div>

                       <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                           <div className="flex justify-between items-center mb-2">
                               <h4 className="font-bold text-indigo-400">Platform Stats</h4>
                               <span className="text-xs text-slate-500">Last Active: Today</span>
                           </div>
                           <div className="grid grid-cols-3 gap-2 text-center">
                               <div>
                                   <p className="text-xl font-bold text-white">{selectedUser.gamification?.level || 1}</p>
                                   <p className="text-xs text-slate-500">Level</p>
                               </div>
                               <div>
                                   <p className="text-xl font-bold text-white">{selectedUser.gamification?.xp || 0}</p>
                                   <p className="text-xs text-slate-500">XP</p>
                               </div>
                               <div>
                                   <p className="text-xl font-bold text-white">{selectedUser.gamification?.streakDays || 0}</p>
                                   <p className="text-xs text-slate-500">Streak</p>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default AdminDashboard;
