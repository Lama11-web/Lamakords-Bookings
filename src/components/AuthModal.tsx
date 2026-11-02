import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, loginAsUser } = useApp();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('mubianalamaswala311@gmail.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [fullName, setFullName] = useState<string>('Mubiana Lamaswala');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsUser();
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
              Authentication Required (FR-01, FR-28)
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isRegister ? 'Create Lama Kords Account' : 'Sign in to Continue'}
            </h3>
          </div>
          <button onClick={() => setShowAuthModal(false)} className="text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          To save favorites, leave reviews, and message business hosts, please log in or register.
        </p>

        {/* Quick 1-Click Demo Login Button */}
        <button
          onClick={() => {
            loginAsUser();
            setShowAuthModal(false);
          }}
          className="w-full py-2.5 mb-4 text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 rounded-xl hover:bg-amber-500/25 transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Quick 1-Click Sign In as Mubiana Lamaswala</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 pt-2"
          >
            <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          <span>{isRegister ? 'Already have an account?' : "Don't have an account yet?"} </span>
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-amber-600 hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register now'}
          </button>
        </div>

      </div>
    </div>
  );
};
