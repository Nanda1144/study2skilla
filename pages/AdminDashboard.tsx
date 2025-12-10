
import React, { useEffect, useState } from 'react';
import { getStoredUsers } from '../services/storage';
import { UserProfile } from '../types';
import { Users, Search, Trash2, Mail } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load all users
    setUsers(getStoredUsers());
  }, []);

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
                      <th className="px-6 py-4">University</th>
                      <th className="px-6 py-4">Role</th>
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
                         <td className="px-6 py-4">{user.university}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                               {user.role || 'student'}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                               <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg">
                                  <Mail size={16} />
                               </button>
                               <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                                  <Trash2 size={16} />
                               </button>
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
    </div>
  );
};

export default AdminDashboard;
