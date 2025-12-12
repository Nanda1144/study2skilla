
import React, { useState } from 'react';
import { Mentor } from '../types';
import { Search, MapPin, Briefcase, MessageCircle, Star } from 'lucide-react';

const Mentors: React.FC = () => {
  const [mentors] = useState<Mentor[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      company: 'Google',
      expertise: ['System Design', 'Cloud Architecture', 'Career Growth'],
      imageUrl: ''
    },
    {
      id: '2',
      name: 'David Miller',
      role: 'Tech Lead',
      company: 'Netflix',
      expertise: ['Backend', 'Microservices', 'Java'],
      imageUrl: ''
    },
    {
      id: '3',
      name: 'Emily Davis',
      role: 'Product Manager',
      company: 'Airbnb',
      expertise: ['Product Sense', 'Interview Prep', 'UX'],
      imageUrl: ''
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = mentors.filter(mentor => {
    const term = searchTerm.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(term) ||
      mentor.role.toLowerCase().includes(term) ||
      mentor.company.toLowerCase().includes(term) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold mb-2">Find a Mentor</h2>
           <p className="text-slate-400">Connect with alumni and industry veterans to guide your path.</p>
        </div>
        <div className="relative">
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, company, or role..." 
                className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 w-full md:w-80 focus:border-indigo-500 focus:outline-none text-white"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-slate-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition group">
              <div className="h-24 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
                 <div className="absolute -bottom-10 left-6">
                     <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-900 flex items-center justify-center text-2xl font-bold text-slate-500">
                         {mentor.name.charAt(0)}
                     </div>
                 </div>
              </div>
              
              <div className="pt-12 p-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                    {mentor.name} 
                    <Star size={14} className="ml-2 text-amber-500 fill-amber-500" />
                </h3>
                <div className="flex items-center text-slate-400 text-sm mt-1 mb-4">
                   <Briefcase size={14} className="mr-1" /> {mentor.role} at <span className="text-white font-medium ml-1">{mentor.company}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                   {mentor.expertise.map(skill => (
                       <span key={skill} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                           {skill}
                       </span>
                   ))}
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center transition">
                    <MessageCircle size={18} className="mr-2" /> Request Mentorship
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
             <Search size={48} className="mx-auto mb-4 opacity-20" />
             <p className="text-lg">No mentors found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;
