import React, { useState } from 'react';
import { Course } from '../types';
import { PlayCircle, Award, ExternalLink, Youtube, MonitorPlay, BookOpen } from 'lucide-react';

const Courses: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  
  // Mock data - in real app would come from AI or DB based on domain
  const courses: Course[] = [
    {
      id: '1',
      title: 'Full Stack Open 2024',
      provider: 'University of Helsinki',
      type: 'Free',
      platform: 'Official Docs',
      url: 'https://fullstackopen.com/en/',
      thumbnail: 'https://fullstackopen.com/static/og-image.png',
      rating: 4.9,
      duration: '40h'
    },
    {
      id: '2',
      title: 'React.js Frontend Web Development for Beginners',
      provider: 'freeCodeCamp',
      type: 'Free',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
      rating: 4.8,
      duration: '5h'
    },
    {
      id: '3',
      title: 'The Complete 2024 Web Development Bootcamp',
      provider: 'Dr. Angela Yu',
      type: 'Paid',
      platform: 'Udemy',
      url: '#',
      thumbnail: 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg',
      rating: 4.7,
      duration: '65h'
    },
    {
      id: '4',
      title: 'CS50\'s Introduction to Computer Science',
      provider: 'Harvard University',
      type: 'Free',
      platform: 'EdX',
      url: 'https://cs50.harvard.edu/x/2024/',
      thumbnail: 'https://cs50.harvard.edu/x/2024/og-image.png',
      rating: 5.0,
      duration: '12 weeks'
    },
    {
      id: '5',
      title: 'Node.js Crash Course',
      provider: 'Traversy Media',
      type: 'Free',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
      thumbnail: 'https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg',
      rating: 4.8,
      duration: '1.5h'
    },
    {
      id: '6',
      title: 'Advanced React Patterns',
      provider: 'Kent C. Dodds',
      type: 'Paid',
      platform: 'Official Docs',
      url: '#',
      thumbnail: 'https://kentcdodds.com/img/og/default.png',
      rating: 4.9,
      duration: '10h'
    }
  ];

  const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.type === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold mb-2">Curated Learning Resources</h2>
           <p className="text-slate-400">Master your domain with the best free and paid resources from across the web.</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
           {(['All', 'Free', 'Paid'] as const).map((type) => (
             <button
               key={type}
               onClick={() => setFilter(type)}
               className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                 filter === type 
                   ? 'bg-indigo-600 text-white shadow' 
                   : 'text-slate-400 hover:text-white hover:bg-slate-800'
               }`}
             >
               {type} Resources
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredCourses.map(course => (
           <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition group flex flex-col h-full">
             <div className="relative h-48 bg-slate-800 overflow-hidden">
                {course.thumbnail && (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition transform group-hover:scale-105 duration-500"
                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image'}}
                  />
                )}
                <div className="absolute top-3 right-3">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                     course.type === 'Free' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                   }`}>
                     {course.type}
                   </span>
                </div>
                {course.platform === 'YouTube' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <PlayCircle size={24} className="text-white fill-white" />
                    </div>
                  </div>
                )}
             </div>

             <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide flex items-center">
                     {course.platform === 'YouTube' ? <Youtube size={12} className="mr-1"/> : <MonitorPlay size={12} className="mr-1"/>}
                     {course.platform}
                   </span>
                   <div className="flex items-center text-amber-400 text-xs font-bold">
                      <span className="mr-1">★</span> {course.rating}
                   </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{course.provider}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                   <span className="text-xs text-slate-500 flex items-center">
                      <BookOpen size={12} className="mr-1" /> {course.duration}
                   </span>
                   <a 
                     href={course.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center"
                   >
                     Start Learning <ExternalLink size={14} className="ml-1" />
                   </a>
                </div>
             </div>
           </div>
         ))}
      </div>

      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 flex items-start space-x-4">
         <div className="bg-indigo-500/20 p-2 rounded-lg">
            <Award className="text-indigo-400" size={24} />
         </div>
         <div>
            <h3 className="text-lg font-bold text-white">Certification vs Knowledge</h3>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
               Did you know? 87% of tech companies prioritize skills and portfolios over certifications. 
               The free resources listed above are often sufficient to build the projects required to land your dream job. 
               Focus on building, not just watching!
            </p>
         </div>
      </div>
    </div>
  );
};

export default Courses;