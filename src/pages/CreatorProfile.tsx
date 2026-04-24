import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, PortfolioItem } from '../types';
import { motion } from 'motion/react';
import { Heart, Star, ArrowLeft, Plus } from 'lucide-react';
import PortfolioCard from '../components/PortfolioCard';

const CreatorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'work' | 'reviews' | 'about'>('work');

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch Profile
        const profileDoc = await getDoc(doc(db, 'users', id));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as UserProfile);
        }

        // Fetch Portfolio
        const portfolioQuery = query(
          collection(db, 'portfolios'), 
          where('creatorId', '==', id),
          orderBy('createdAt', 'desc')
        );
        const portfolioSnap = await getDocs(portfolioQuery);
        setPortfolio(portfolioSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem)));

      } catch (error) {
        console.error('Error fetching creator profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [id]);

  const handleMessage = () => {
    // In a real app, this would create/navigate to a conversation
    navigate(`/messages?with=${id}`);
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Loading profile...</div>;
  if (!profile) return <div className="p-20 text-center">Creator not found.</div>;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="relative group">
        <button 
          onClick={() => navigate(-1)}
          className="absolute -top-16 left-0 p-3 text-black/30 hover:text-black transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Archive</span>
        </button>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-black/5 artistic-shadow space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start relative z-10 text-center lg:text-left">
            <div className="relative shrink-0">
              <div className="w-40 h-40 md:w-64 md:h-64 rounded-[4rem] overflow-hidden bg-brand-bg border border-black/5 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
                {profile.photoURL ? (
                   <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-6xl font-serif italic text-black/10">
                    {profile.displayName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full shadow-2xl text-[9px] font-bold uppercase tracking-[0.3em] border border-white/10 whitespace-nowrap">
                Authentic Artisan
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">Profile Index / {profile.role}</p>
                  <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-black leading-tight">
                    {profile.displayName}
                  </h1>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
                    {profile.categories?.map(cat => (
                      <span key={cat} className="text-[10px] font-bold text-black/40 uppercase tracking-widest border border-black/5 px-4 py-1.5 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={handleMessage}
                    className="px-10 py-5 bg-black text-white rounded-3xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-2xl active:scale-95"
                  >
                    Initiate Contact
                  </button>
                  <button className="p-5 bg-brand-bg text-black/20 rounded-3xl hover:text-black hover:border-black/10 border border-transparent transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-start gap-12 pt-10 border-t border-black/5">
                {[
                  { value: profile.followerCount, label: 'Patrons' },
                  { value: profile.rating.toFixed(1), label: 'Expertise', icon: Star },
                  { value: portfolio.length, label: 'Manifestos' }
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                      <p className="text-3xl font-serif italic text-black">{stat.value}</p>
                      {stat.icon && <stat.icon className="w-4 h-4 text-black/20" />}
                    </div>
                    <p className="text-[9px] font-bold text-black/20 uppercase tracking-[0.3em]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 border-b border-black/5 sticky top-0 bg-brand-bg/80 backdrop-blur-xl z-40 py-6 px-4">
        {[
          { id: 'work', label: 'Portfolio' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'about', label: 'About' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'work' | 'reviews' | 'about')}
            className={`font-serif italic text-xl transition-all relative ${
              activeTab === tab.id 
                ? 'text-black opacity-100' 
                : 'text-black/30 hover:opacity-100'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-underline" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'work' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {portfolio.length === 0 ? (
              <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-black/5 artistic-shadow">
                <div className="w-24 h-24 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6 border border-black/5">
                  <Plus className="text-black/10 w-8 h-8" />
                </div>
                <p className="font-serif italic text-xl opacity-30 text-black">Empty Archive</p>
              </div>
            ) : (
              portfolio.map(item => (
                <PortfolioCard key={item.id} item={item} />
              ))
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-[4rem] p-20 border border-black/5 text-center artistic-shadow italic font-serif text-black/30 text-2xl">
            Awaiting critical acclaim.
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 bg-white rounded-[4rem] p-16 border border-black/5 artistic-shadow space-y-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/20">Creative Philosophy</h3>
                <p className="text-2xl font-serif italic text-black/70 leading-relaxed">
                  {profile.bio || "The philosophy of this creator is unspoken, woven directly into the fabric of their work. Every detail is a deliberate act of creation."}
                </p>
              </div>
            </div>
            
            <div className="bg-brand-ink text-white rounded-[4rem] p-12 artistic-shadow space-y-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Specializations</h3>
                <div className="flex flex-col gap-4">
                  {profile.skills?.map(skill => (
                    <div key={skill} className="flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white transition-colors" />
                      <span className="text-sm font-bold uppercase tracking-widest">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-6">Status</h3>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">{profile.role}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
