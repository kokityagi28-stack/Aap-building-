import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CATEGORIES, PortfolioType } from '../types';
import { Plus, Image as ImageIcon, Video, Music, Check, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ProfileSettings: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  // Profile Form
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(profile?.categories || []);
  const [skillsStr, setSkillsStr] = useState(profile?.skills?.join(', ') || '');

  // Portfolio Form
  const [pType, setPType] = useState<PortfolioType>('image');
  const [pTitle, setPTitle] = useState('');
  const [pUrl, setPUrl] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pTags, setPTags] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      const skills = skillsStr.split(',').map(s => s.trim()).filter(s => s !== '');
      await setDoc(doc(db, 'users', profile.uid), {
        displayName,
        photoURL,
        bio,
        categories: selectedCategories,
        skills,
        updatedAt: Timestamp.now(),
        // Ensure defaults if it's a first-time set
        uid: profile.uid,
        email: profile.email,
        role: profile.role || 'client'
      }, { merge: true });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      const tags = pTags.split(',').map(t => t.trim()).filter(t => t !== '');
      await addDoc(collection(db, 'portfolios'), {
        creatorId: profile.uid,
        type: pType,
        url: pUrl,
        title: pTitle,
        description: pDesc,
        tags,
        likesCount: 0,
        commentsCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      setShowAddPortfolio(false);
      setPTitle('');
      setPUrl('');
      setPDesc('');
      setPTags('');
      alert('Project added to your portfolio!');
    } catch (error) {
      console.error(error);
      alert('Failed to add project.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight uppercase tracking-tighter">Settings</h1>
          <p className="text-gray-500 font-medium tracking-tight">Manage your professional presence.</p>
        </div>
        <button 
          onClick={() => signOut()}
          className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors md:hidden"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Profile Form */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 space-y-8">
             <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <Check className="text-indigo-600 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Basic Information</h2>
             </div>

             <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Profile Photo URL</label>
                  <input 
                    type="url" 
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Biography</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your story..."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          if (selectedCategories.includes(cat)) {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          } else {
                            setSelectedCategories([...selectedCategories, cat]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedCategories.includes(cat)
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Skills (comma separated)</label>
                  <input 
                    type="text" 
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="e.g. Adobe Premiere, Blender, Unreal Engine"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
             </form>
          </section>

          {/* Portfolio Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-2xl font-bold tracking-tight uppercase tracking-tighter">My Portfolio</h2>
              <button 
                onClick={() => setShowAddPortfolio(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-indigo-600 shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="w-5 h-5" /> Add Project
              </button>
            </div>

            <AnimatePresence>
              {showAddPortfolio && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-indigo-100 shadow-2xl space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Add New Project</h3>
                    <button onClick={() => setShowAddPortfolio(false)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-black">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleAddPortfolio} className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                       {(['image', 'video', 'audio'] as PortfolioType[]).map(t => (
                         <button
                           type="button"
                           key={t}
                           onClick={() => setPType(t)}
                           className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                             pType === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-50 text-gray-400 hover:border-gray-200'
                           }`}
                         >
                           {t === 'image' && <ImageIcon className="w-6 h-6" />}
                           {t === 'video' && <Video className="w-6 h-6" />}
                           {t === 'audio' && <Music className="w-6 h-6" />}
                           <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                         </button>
                       ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Project Title</label>
                      <input 
                        required
                        type="text" 
                        value={pTitle}
                        onChange={(e) => setPTitle(e.target.value)}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Media URL (Image/Video/Audio)</label>
                      <input 
                        required
                        type="url" 
                        value={pUrl}
                        onChange={(e) => setPUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                      <textarea 
                        rows={3}
                        value={pDesc}
                        onChange={(e) => setPDesc(e.target.value)}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Tags (comma separated)</label>
                      <input 
                        type="text" 
                        value={pTags}
                        onChange={(e) => setPTags(e.target.value)}
                        placeholder="e.g. CGI, Cinematic, Minimal"
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Publish Project'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Sidebar Help */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold tracking-tight">Pro Tip 💡</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Creators with complete profiles and at least 3 high-quality portfolio items get <span className="font-bold text-white uppercase tracking-tighter">5x more reach</span> on our discovery algorithm.
            </p>
            <div className="pt-4 border-t border-indigo-500/30">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
              <p className="font-bold mt-1">Profile {profile.skills?.length ? '80%' : '40%'} Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
