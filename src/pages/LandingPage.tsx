import React from 'react';
import { motion } from 'motion/react';
import { signInWithGoogle, seedMarketplaceData } from '../lib/firebase';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-black/5 -skew-x-12 translate-x-1/2" />

      {/* Header */}
      <header className="px-10 py-8 flex justify-between items-center max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif font-black tracking-tighter uppercase italic">
            Creator<span className="text-black/20">.</span>
          </h1>
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => seedMarketplaceData()}
            className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors"
          >
            Seed Demo
          </button>
          <button 
            onClick={() => signInWithGoogle()}
            className="px-8 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-10 pt-20 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-[0.85]">
              Creative <br/>
              <span className="text-black/20 not-italic font-sans font-black">Capital.</span>
            </h2>
            <p className="text-lg text-black/60 max-w-md font-medium leading-relaxed">
              Curating the top 1% of digital visual talent. From 3D maestros to cinematic editors, build your vision with the best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => signInWithGoogle()}
                className="px-12 py-5 bg-black text-white rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-2xl artistic-shadow"
              >
                Join the Fold
              </button>
              <button className="px-12 py-5 border border-black/10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black/5 transition-all">
                The Archive
              </button>
            </div>
          </motion.div>

          {/* Featured Image Grid - Artistic Flair style */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 gap-4 h-[600px]"
          >
            <div className="rounded-[3rem] overflow-hidden bg-zinc-200 grayscale hover:grayscale-0 transition-all duration-700">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Art" />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="rounded-[2rem] overflow-hidden bg-zinc-300">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Creator" />
              </div>
              <div className="rounded-[2rem] overflow-hidden bg-zinc-400 rotate-3 translate-x-4 border-4 border-white shadow-2xl">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Work" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Preview - Technical / Informative style */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-black/5 pt-20">
          {[
            { label: 'Network', title: 'Global Collective', text: 'Access a curated network of creators spanning 40+ countries and hundreds of specialized skills.' },
            { label: 'Pipeline', title: 'Direct Access', text: 'Streamlined collaboration from initial discovery to final delivery. No middlemen, no friction.' },
            { label: 'Quality', title: 'Vetted Portfolios', text: 'Every portfolio item is verified for authenticity and professional standard.' }
          ].map((f, i) => (
            <div key={i} className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">{f.label}</p>
              <h3 className="text-xl font-serif italic">{f.title}</h3>
              <p className="text-sm text-black/50 leading-relaxed font-medium">{f.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
