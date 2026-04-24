import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { User, Briefcase, ChevronRight } from 'lucide-react';
import { UserRole } from '../types';

const Onboarding: React.FC = () => {
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await setRole(selectedRole);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Choose your journey</h1>
          <p className="text-gray-500">How do you plan to use CreatorHub?</p>
        </div>

        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole('creator')}
            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${
              selectedRole === 'creator' ? 'border-black bg-gray-50' : 'border-gray-100'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              selectedRole === 'creator' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl">I am a Creator</h3>
              <p className="text-gray-500 text-sm">I want to showcase my work and find clients.</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole('client')}
            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${
              selectedRole === 'client' ? 'border-black bg-gray-50' : 'border-gray-100'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              selectedRole === 'client' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl">I am a Client</h3>
              <p className="text-gray-500 text-sm">I want to discover and hire amazing talent.</p>
            </div>
          </motion.div>
        </div>

        <button
          disabled={!selectedRole || loading}
          onClick={handleContinue}
          className="w-full mt-12 py-5 bg-black text-white rounded-2xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Continue <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
