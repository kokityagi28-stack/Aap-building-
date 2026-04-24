import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const { signOut } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: 'Explore' },
    { to: '/search', icon: Search, label: 'Talent' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/settings', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Bottom Bar - Glass style */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] md:hidden h-16 bg-white/80 backdrop-blur-xl border border-black/10 rounded-full shadow-2xl flex items-center justify-around px-8 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-center p-2 rounded-full transition-all",
                isActive ? "bg-black text-white scale-110 shadow-lg" : "text-black/30"
              )
            }
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>

      {/* Desktop Sidebar - Artistic Flair Sidebar Categories style */}
      <nav className="fixed top-0 left-0 bottom-0 w-64 border-r border-black/5 bg-brand-bg hidden md:flex flex-col z-50">
        <div className="p-10 border-b border-black/5">
          <h1 className="text-3xl font-serif font-black tracking-tighter uppercase italic">
            Creator<span className="text-black/20">.</span>
          </h1>
        </div>

        <div className="flex-1 p-10 flex flex-col gap-10 overflow-y-auto">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 opacity-40">Navigation</h3>
            <ul className="flex flex-col gap-5">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "font-serif text-xl italic transition-all hover:pl-2 flex items-center gap-3",
                        isActive ? "text-black underline underline-offset-8" : "text-black/50 hover:text-black opacity-60 hover:opacity-100"
                      )
                    }
                  >
                    <item.icon className="w-5 h-5 hidden" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-auto">
            <div className="bg-brand-ink text-white p-6 rounded-3xl artistic-shadow">
              <p className="text-xs font-light leading-relaxed mb-4 opacity-70">Join the top 1% of digital creators worldwide.</p>
              <button 
                onClick={() => signOut()}
                className="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </section>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
