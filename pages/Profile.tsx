
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { Award, BookOpen, Clock, Save, Check, Trophy, Lock, X, Camera, Wand2, Loader2, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { editProfileImage } from '../services/geminiService';
import FAQ from '../components/FAQ';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    university: '',
    year: '',
    domain: ''
  });

  // Photo Studio State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPrompt, setPhotoPrompt] = useState('');
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSaveBio = async () => {
    if (!user) return;
    setIsSaving(true);
    
    // Create new user object
    const updatedUser = { ...user, bio };
    await updateUser(updatedUser);
    
    // Simulate slight delay for effect
    setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const openEditModal = () => {
    if (!user) return;
    setEditForm({
      name: user.name,
      university: user.university,
      year: user.year,
      domain: user.domain
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const updatedUser = {
      ...user,
      name: editForm.name,
      university: editForm.university,
      year: editForm.year,
      domain: editForm.domain
    };

    await updateUser(updatedUser);
    setShowEditModal(false);
  };

  // Photo Handling
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              // Get base64
              const base64 = (reader.result as string);
              setUploadedPhoto(base64);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleGeneratePhoto = async () => {
      if (!uploadedPhoto || !photoPrompt) return;
      
      setIsGeneratingPhoto(true);
      // Strip prefix for API
      const base64Data = uploadedPhoto.split(',')[1];
      
      const result = await editProfileImage(base64Data, photoPrompt);
      
      if (result) {
          setUploadedPhoto(`data:image/png;base64,${result}`);
      } else {
          alert("Could not edit image. Please try a different prompt.");
      }
      setIsGeneratingPhoto(false);
  };

  const handleSavePhoto = async () => {
      if (!user || !uploadedPhoto) return;
      await updateUser({ ...user, avatarUrl: uploadedPhoto });
      setShowPhotoModal(false);
      setUploadedPhoto(null);
      setPhotoPrompt('');
  };

  if (!user) {
    return <div className="text-center p-10 text-slate-400">Loading profile...</div>;
  }

  // Potential Badges (Mock)
  const allBadges = [
    { id: '1', name: 'Newbie', description: 'Joined the platform', icon: '🌱' },
    { id: '2', name: 'Code Warrior', description: 'Completed 10 study hours', icon: '⚔️' },
    { id: '3', name: 'Bug Hunter', description: 'Fixed 5 projects', icon: '🐞' },
    { id: '4', name: 'Night Owl', description: 'Studied after midnight', icon: '🦉' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div 
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 relative group cursor-pointer"
            onClick={() => setShowPhotoModal(true)}
        >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    user.name.charAt(0)
                )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Camera size={20} className="text-white"/>
            </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-slate-400">{user.university} • {user.year}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30">
                    {user.domain}
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">
                    Level {user.gamification?.level || 1}
                </span>
            </div>
        </div>

        <div className="flex flex-col gap-2 relative z-10">
            <button 
                onClick={openEditModal}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-slate-700"
            >
                Edit Details
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/20">
                Public View
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress & Badges */}
          <div className="md:col-span-2 space-y-6">
              
              {/* Trophy Case */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Trophy size={20} className="mr-2 text-amber-400"/> Trophy Case
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {allBadges.map(badge => {
                          const isUnlocked = user.gamification?.badges?.find(b => b.name === badge.name);
                          return (
                            <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center ${isUnlocked ? 'bg-slate-800 border-slate-700' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                                <div className="text-3xl mb-2">{isUnlocked ? badge.icon : <Lock size={24} className="text-slate-600"/>}</div>
                                <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                                <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
                            </div>
                          )
                      })}
                  </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Award size={20} className="mr-2 text-indigo-400"/> Skill Progress
                  </h3>
                  <div className="space-y-4">
                      {user.skills.length > 0 ? user.skills.map((skill, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="text-slate-300">{skill}</span>
                                  <span className="text-slate-500">Level {Math.floor(Math.random() * 5) + 3}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                              </div>
                          </div>
                      )) : (
                          <p className="text-slate-500 text-sm">No skills listed yet. Complete roadmap items to add skills.</p>
                      )}
                  </div>
              </div>
          </div>

          {/* Bio & Stats */}
          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">About Me</h3>
                      <button 
                        onClick={handleSaveBio}
                        disabled={isSaving || bio === user.bio}
                        className={`flex items-center text-xs px-3 py-1.5 rounded-lg transition ${
                            saveSuccess 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-800'
                        }`}
                      >
                        {saveSuccess ? <Check size={14} className="mr-1"/> : <Save size={14} className="mr-1"/>}
                        {saveSuccess ? 'Saved' : isSaving ? 'Saving...' : 'Save'}
                      </button>
                  </div>
                  <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm focus:outline-none focus:border-indigo-500 min-h-[140px] resize-none leading-relaxed"
                      placeholder="Tell us about your career goals and interests..."
                  />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Clock size={20} className="mr-2 text-amber-400"/> Activity Stats
                  </h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Total XP</span>
                          <span className="text-white font-bold">{user.gamification?.xp || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Study Hours</span>
                          <span className="text-white font-bold">{user.gamification?.studyHoursTotal || 0}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Current Streak</span>
                          <span className="text-emerald-400 font-bold">{user.gamification?.streakDays || 0} days</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      {/* FAQ Section specifically requested for Profile */}
      <FAQ />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Edit Profile Details</h3>
                    <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">University / College</label>
                        <input 
                            type="text" 
                            required
                            value={editForm.university}
                            onChange={(e) => setEditForm({...editForm, university: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Year of Study</label>
                            <select 
                                value={editForm.year}
                                onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                                <option>Graduate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Domain</label>
                             <select 
                                value={editForm.domain}
                                onChange={(e) => setEditForm({...editForm, domain: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option>Full Stack Development</option>
                                <option>Data Science</option>
                                <option>Machine Learning</option>
                                <option>Cybersecurity</option>
                                <option>Cloud Computing</option>
                                <option>Blockchain</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex space-x-3">
                        <button 
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-bold"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Photo AI Studio Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <Camera className="mr-2 text-indigo-400" /> AI Profile Studio
                    </h3>
                    <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image Preview Area */}
                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <div className="relative w-64 h-64 rounded-full bg-slate-950 border-4 border-indigo-500/30 overflow-hidden mb-4 group">
                                {uploadedPhoto ? (
                                    <img src={uploadedPhoto} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <Camera size={48} />
                                    </div>
                                )}
                                
                                {isGeneratingPhoto && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-indigo-400">
                                        <Loader2 size={32} className="animate-spin mb-2" />
                                        <span className="text-sm font-bold animate-pulse">AI is working...</span>
                                    </div>
                                )}
                            </div>
                            
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*" 
                                onChange={handlePhotoUpload}
                            />
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center text-sm text-slate-400 hover:text-white transition"
                            >
                                <Upload size={14} className="mr-1" /> Upload New Photo
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="w-full md:w-1/2 flex flex-col space-y-4">
                            <div>
                                <h4 className="font-bold text-white mb-2">Edit with AI</h4>
                                <p className="text-xs text-slate-400 mb-4">Use a text prompt to edit your photo. e.g., "Add a professional suit", "Change background to office".</p>
                                
                                <textarea 
                                    value={photoPrompt}
                                    onChange={(e) => setPhotoPrompt(e.target.value)}
                                    placeholder="Describe how you want to change the image..."
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 h-24 resize-none mb-2"
                                />
                                
                                <button 
                                    onClick={handleGeneratePhoto}
                                    disabled={!uploadedPhoto || !photoPrompt.trim() || isGeneratingPhoto}
                                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <Wand2 size={16} className="mr-2" /> Magic Edit
                                </button>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-xs text-slate-400">
                                <strong>Tip:</strong> Upload a clear headshot for best results. The AI will try to follow your prompt while keeping your face recognizable.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900">
                    <button 
                        onClick={() => setShowPhotoModal(false)}
                        className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSavePhoto}
                        disabled={!uploadedPhoto}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition disabled:opacity-50"
                    >
                        Save Profile Picture
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
