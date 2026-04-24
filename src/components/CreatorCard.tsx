import React from 'react';
import { UserProfile } from '../types';
import { Star, MapPin, ExternalLink, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CreatorCardProps {
  creator: UserProfile;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
    <Link to={`/creator/${creator.uid}`} className="block group">
      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 flex flex-col md:flex-row gap-10 transition-all hover:artistic-shadow">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-[3rem] overflow-hidden bg-brand-bg border border-black/5 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105">
            {creator.photoURL ? (
              <img src={creator.photoURL} alt={creator.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-3xl font-serif italic text-black/10">
                {creator.displayName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20 mb-2">Featured Creator</p>
              <h3 className="text-3xl md:text-4xl font-serif italic text-black leading-tight">
                {creator.displayName}
              </h3>
              <div className="flex flex-wrap gap-4 mt-3">
                {creator.categories?.map(cat => (
                  <span key={cat} className="text-[10px] font-bold text-black uppercase tracking-widest bg-brand-bg px-3 py-1 rounded-full border border-black/5">{cat}</span>
                ))}
              </div>
            </div>
            <button className="p-4 bg-brand-bg text-black/20 rounded-2xl hover:text-black hover:border-black/20 border border-transparent transition-all">
              <Bookmark className="w-5 h-5 flex-shrink-0" />
            </button>
          </div>

          <p className="text-black/50 text-sm leading-relaxed max-w-xl font-medium">
            {creator.bio || "Crafting digital narratives with technical precision and artistic intent. Portfolio available upon request."}
          </p>

          <div className="flex flex-wrap gap-8 items-center pt-4 border-t border-black/5">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-black/10 text-black/10" />
              <span className="text-[11px] font-bold text-black">{creator.rating.toFixed(1)}</span>
              <span className="text-[9px] text-black/30 font-bold uppercase tracking-tighter">/ {creator.reviewCount} Reviews</span>
            </div>
            
            <div className="flex items-center gap-2 text-black/20">
              <MapPin className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-widest italic">Global</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {creator.skills?.slice(0, 3).map(skill => (
                <span key={skill} className="text-[9px] font-bold uppercase tracking-tighter text-black/40">
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center border-l border-black/5 pl-10">
          <button className="w-12 h-12 md:w-16 md:h-16 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 shadow-2xl transition-all">
            <ExternalLink className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
