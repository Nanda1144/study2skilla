import React, { useState, useEffect } from 'react';
import { Course, RoadmapData } from '../types';
import { PlayCircle, Award, ExternalLink, Youtube, MonitorPlay, BookOpen, Map, X, PlusCircle, CheckCircle, CheckSquare, Square } from 'lucide-react';
import { getUserData, saveUserData } from '../services/storage';
import { Link, useNavigate } from 'react-router-dom';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  
  // Add to Roadmap Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [courseToAdd, setCourseToAdd] = useState<Course | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  useEffect(() => {
     const savedRoadmap = getUserData('roadmap');
     if (savedRoadmap) setRoadmap(savedRoadmap);

     const savedCompleted = getUserData('completed_courses');
     if (savedCompleted) setCompletedCourses(savedCompleted);
  }, []);
  
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

  const getRoadmapMatch = (course: Course) => {
      if (!roadmap || !roadmap.roadmap) return null;
      for (const sem of roadmap.roadmap) {
          const match = sem.resources?.find(r => 
              r.toLowerCase().includes(course.title.toLowerCase()) || 
              course.title.toLowerCase().includes(r.toLowerCase())
          );
          if (match) return sem.semester;
      }
      return null;
  };

  const handleStartCourse = (course: Course) => {
    // Check if it's a YouTube link
    if (course.platform === 'YouTube' || course.url.includes('youtube.com') || course.url.includes('youtu.be')) {
        let videoId = '';
        if (course.url.includes('v=')) {
            videoId = course.url.split('v=')[1]?.split('&')[0];
        } else if (course.url.includes('youtu.be/')) {
            videoId = course.url.split('youtu.be/')[1];
        }

        if (videoId) {
            setSelectedVideo(videoId);
            return;
        }
    }
    
    // Default fallback: open new tab
    window.open(course.url, '_blank');
  };

  const toggleCompletion = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    let newCompleted;
    if (completedCourses.includes(courseId)) {
        newCompleted = completedCourses.filter(id => id !== courseId);
    } else {
        newCompleted = [...completedCourses, courseId];
    }
    setCompletedCourses(newCompleted);
    saveUserData('completed_courses', newCompleted);
  };

  const openAddModal = (e: React.MouseEvent, course: Course) => {
      e.stopPropagation();
      if (!roadmap || !roadmap.roadmap) {
          if(window.confirm("You don't have a roadmap yet. Would you like to generate one first?")) {
              navigate('/roadmap');
          }
          return;
      }
      setCourseToAdd(course);
      setShowAddModal(true);
  };

  const confirmAddToRoadmap = () => {
      if (!roadmap || !roadmap.roadmap || !courseToAdd) return;

      const updatedRoadmap = { ...roadmap };
      // Find the semester
      const semesterIndex = updatedRoadmap.roadmap.findIndex(s => s.semester === selectedSemester);
      
      if (semesterIndex !== -1) {
          // Add to resources if not already there
          const resourceEntry = `${courseToAdd.title} (${courseToAdd.platform})`;
          if (!updatedRoadmap.roadmap[semesterIndex].resources) {
              updatedRoadmap.roadmap[semesterIndex].resources = [];
          }
          if (!updatedRoadmap.roadmap[semesterIndex].resources.includes(resourceEntry)) {
             updatedRoadmap.roadmap[semesterIndex].resources.push(resourceEntry);
          }
          
          setRoadmap(updatedRoadmap);
          saveUserData('roadmap', updatedRoadmap);
          setShowAddModal(false);
          setCourseToAdd(null);
          alert(`Added "${courseToAdd.title}" to Semester ${selectedSemester} resources.`);
      }
  };

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
         {filteredCourses.map(course => {
           const matchSemester = getRoadmapMatch(course);
           const isCompleted = completedCourses.includes(course.id);
           
           return (
           <div key={course.id} className={`bg-slate-900 border rounded-xl overflow-hidden hover:border-slate-600 transition group flex flex-col h-full relative ${isCompleted ? 'border-emerald-900/50 opacity-80' : 'border-slate-800'}`}>
             
             <div className="relative h-48 bg-slate-800 overflow-hidden cursor-pointer" onClick={() => handleStartCourse(course)}>
                {course.thumbnail && (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className={`w-full h-full object-cover transition transform duration-500 ${isCompleted ? 'grayscale' : 'group-hover:scale-105'}`}
                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image'}}
                  />
                )}
                
                {/* Roadmap Indicator */}
                {matchSemester && (
                    <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold flex items-center shadow-lg z-10 border border-indigo-400/30">
                        <Map size={12} className="mr-1" /> Recommended: Sem {matchSemester}
                    </div>
                )}

                {/* Completed Indicator */}
                {isCompleted && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-600/90 backdrop-blur text-white px-4 py-2 rounded-full font-bold flex items-center shadow-2xl z-20 border border-emerald-400/50">
                        <CheckCircle size={20} className="mr-2" /> COMPLETED
                    </div>
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
                
                <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>{course.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{course.provider}</p>
                
                <div className="mt-auto space-y-3">
                   <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-500 flex items-center">
                            <BookOpen size={12} className="mr-1" /> {course.duration}
                        </span>
                        
                        <div className="flex space-x-2">
                            {/* Completion Toggle */}
                            <button 
                                onClick={(e) => toggleCompletion(e, course.id)}
                                className={`text-xs px-3 py-1.5 rounded-md transition border flex items-center ${isCompleted ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                                title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
                            >
                                {isCompleted ? <CheckSquare size={14} className="mr-1" /> : <Square size={14} className="mr-1"/>}
                                {isCompleted ? 'Done' : 'Mark Done'}
                            </button>

                            <button 
                                onClick={() => handleStartCourse(course)}
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center bg-indigo-500/10 px-3 py-1.5 rounded-md hover:bg-indigo-500/20 transition"
                            >
                                Start <ExternalLink size={14} className="ml-1" />
                            </button>
                        </div>
                   </div>

                   {/* Add to Roadmap Action */}
                   {!matchSemester && (
                       <button 
                         onClick={(e) => openAddModal(e, course)}
                         className="w-full text-xs flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 py-2 rounded-lg transition"
                       >
                           <PlusCircle size={12} className="mr-1" /> Add to Roadmap
                       </button>
                   )}
                   {matchSemester && (
                       <Link to="/roadmap" className="w-full text-xs flex items-center justify-center text-indigo-400 hover:bg-indigo-900/20 py-2 rounded-lg transition">
                           View in Roadmap (Sem {matchSemester})
                       </Link>
                   )}
                </div>
             </div>
           </div>
         )})}
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

      {/* Video Modal */}
      {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-4 right-4 text-white hover:text-red-500 bg-black/50 p-2 rounded-full z-10"
                  >
                      <X size={24} />
                  </button>
                  <div className="aspect-video">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                  </div>
              </div>
          </div>
      )}

      {/* Add to Roadmap Modal */}
      {showAddModal && courseToAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white">Add to Roadmap</h3>
                      <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="mb-6">
                      <p className="text-slate-300 text-sm mb-2">Adding resource:</p>
                      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white font-medium">
                          {courseToAdd.title}
                      </div>
                  </div>

                  <div className="mb-6">
                      <label className="block text-slate-400 text-sm mb-2">Select Semester</label>
                      <select 
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                      >
                          {roadmap?.roadmap?.map(sem => (
                              <option key={sem.semester} value={sem.semester}>
                                  Semester {sem.semester}: {sem.focus}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={confirmAddToRoadmap}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition"
                      >
                          Confirm Add
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Courses;