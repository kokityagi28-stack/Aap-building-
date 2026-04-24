import React from 'react';
import { PortfolioItem } from '../types';
import { Heart, MessageCircle, Play, Music } from 'lucide-react';
import { formatTimeAgo } from '../lib/utils';
import { Link } from 'react-router-dom';

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-black/5 transition-all hover:artistic-shadow">
      {/* Media Content */}
      <div className="relative aspect-[4/5] bg-[#FAF9F6] overflow-hidden">
        {item.type === 'image' && (
          <img 
            src={item.url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        {item.type === 'video' && (
          <div className="w-full h-full flex items-center justify-center relative">
            <video 
              src={item.url} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0"
              muted
              loop
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => e.currentTarget.pause()}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:opacity-0 transition-opacity">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play className="text-white fill-white w-5 h-5" />
              </div>
            </div>
          </div>
        )}
        {item.type === 'audio' && (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 relative p-8">
            <div className="z-10 text-center text-white">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-serif italic text-xl">{item.title}</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay for bottom text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Overlay Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          {item.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">
              {item.type}
            </p>
            <h3 className="text-xl font-serif italic text-black leading-tight">{item.title}</h3>
          </div>
          <Link to={`/creator/${item.creatorId}`} className="group/avatar">
            <div className="w-10 h-10 rounded-full border border-black/10 overflow-hidden group-hover/avatar:border-black transition-colors">
              <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-[10px] font-bold text-black/30">
                {item.creatorId.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-6 pt-2 border-t border-black/5">
          <div className="flex items-center gap-2 text-black/40">
            <Heart className="w-4 h-4" />
            <span className="text-[10px] font-bold font-sans">{item.likesCount}</span>
          </div>
          <div className="flex items-center gap-2 text-black/40">
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold font-sans">{item.commentsCount}</span>
          </div>
          <span className="ml-auto text-[9px] font-bold text-black/20 uppercase tracking-widest">
            {formatTimeAgo(item.createdAt.toDate())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
