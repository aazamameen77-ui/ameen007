import React, { useState } from 'react';
import { Cloud, X, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { User } from '../types';
import { initialUser } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onToast,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('sarah.jenkins@acmecorp.io');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Sarah Jenkins');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onToast('error', 'Missing fields', 'Please enter your email and password.');
      return;
    }

    const userObj: User = {
      ...initialUser,
      name: mode === 'signup' ? name || 'New User' : initialUser.name,
      email: email,
    };

    onLogin(userObj);
    onToast(
      'success',
      mode === 'signin' ? 'Welcome back!' : 'Account created!',
      `Logged in as ${userObj.name}`
    );
    onClose();
  };

  const handleDemoSignIn = () => {
    onLogin(initialUser);
    onToast('success', 'Logged in as Demo User', `Welcome, ${initialUser.name}!`);
    onClose();
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="auth-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Brand */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">CloudVault</h3>
              <p className="text-xs text-slate-500">Secure enterprise cloud storage</p>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-1 m-6 mb-4 bg-slate-100 rounded-xl flex text-xs font-semibold">
          <button
            id="auth-tab-signin"
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Quick Demo User Login Banner */}
        <div className="px-6 mb-2">
          <button
            id="demo-user-quick-login-btn"
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Instant Demo Login (Sarah Jenkins, Pro Plan)</span>
          </button>
        </div>

        <div className="relative px-6 my-3">
          <div className="absolute inset-0 flex items-center px-6">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span className="bg-white px-2">or continue with email</span>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="auth-email-input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => onToast('info', 'Password Reset', 'Password recovery link sent to your email.')}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="auth-password-input"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2">
            By continuing, you agree to CloudVault’s Terms of Service & Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};
