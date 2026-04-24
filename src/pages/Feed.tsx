import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem } from '../types';
import PortfolioCard from '../components/PortfolioCard';
import { motion } from 'motion/react';

const Feed: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const q = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 aspect-[4/5] rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-serif italic mb-2 tracking-tight">The Daily Edit</h2>
          <p className="text-sm opacity-50 font-medium">Curated projects from the elite creator community</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">Filters</button>
          <button className="px-6 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Featured</button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="py-32 text-center space-y-8 bg-white rounded-[3rem] border border-black/5 artistic-shadow">
          <div className="w-24 h-24 bg-brand-bg rounded-full flex items-center justify-center mx-auto border border-black/5">
            <span className="text-4xl italic font-serif">!</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif italic">Gallery Empty</h3>
            <p className="text-black/40 max-w-sm mx-auto text-sm">The collection is currently being curated. Check back soon for the latest works.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
            >
              <PortfolioCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
