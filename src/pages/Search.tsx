import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, CATEGORIES } from '../types';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import CreatorCard from '../components/CreatorCard';
import { motion, AnimatePresence } from 'motion/react';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [creators, setCreators] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchCreators = useCallback(async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'users'), where('role', '==', 'creator'), limit(20));
      
      if (selectedCategory) {
        q = query(collection(db, 'users'), 
          where('role', '==', 'creator'),
          where('categories', 'array-contains', selectedCategory),
          limit(20)
        );
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => doc.data() as UserProfile);
      
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        results = results.filter(c => 
          c.displayName.toLowerCase().includes(lowerSearch) || 
          c.skills?.some(s => s.toLowerCase().includes(lowerSearch)) ||
          c.bio?.toLowerCase().includes(lowerSearch)
        );
      }

      setCreators(results);
    } catch (error) {
      console.error('Error searching creators:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCreators();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchCreators]);

  return (
    <div className="space-y-12">
      <header className="space-y-8">
        <div>
          <h2 className="text-5xl font-serif italic mb-2 tracking-tight">Talent Archive</h2>
          <p className="text-sm opacity-50 font-medium tracking-wide">Browse the world's most innovative visual storytellers</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Find by name, skill, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-black/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 transition-all font-serif italic text-lg"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border ${
              showFilters ? 'bg-black text-white border-black' : 'bg-white text-black border-black/5 hover:bg-black/5'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest leading-none">Filters</span>
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-10 bg-white rounded-[2rem] border border-black/5 artistic-shadow space-y-6">
                <div className="flex justify-between items-center border-b border-black/5 pb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Categories</h3>
                  {selectedCategory && (
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="text-[10px] font-bold text-black uppercase tracking-widest flex items-center gap-2 hover:opacity-50 transition-opacity"
                    >
                      <X className="w-3 h-3" /> Clear Selection
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                      className={`px-6 py-3 rounded-xl font-serif italic transition-all border ${
                        selectedCategory === cat 
                          ? 'bg-black text-white border-black shadow-lg scale-105' 
                          : 'bg-brand-bg text-black/50 border-transparent hover:border-black/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-black/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 pb-20">
          {creators.length === 0 ? (
            <div className="py-32 text-center bg-white rounded-[3rem] border border-black/5">
              <p className="text-black/40 font-serif italic text-xl">No artisans found matching your search.</p>
            </div>
          ) : (
            creators.map((creator, index) => (
              <motion.div
                key={creator.uid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <CreatorCard creator={creator} />
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
