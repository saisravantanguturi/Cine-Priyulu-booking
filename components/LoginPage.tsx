import React from 'react';
import { GoogleIcon } from './Icons';

interface LoginPageProps {
  onLogin: () => void;
  isLoading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent p-4">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl text-center ring-1 ring-black/10 dark:ring-white/10">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Welcome to Cine Priyulu!
        </h1>
        <p className="text-black dark:text-gray-200">Sign in with your Google account to book your tickets.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="submit"
            className="w-full py-3 px-4 font-bold text-gray-700 dark:text-gray-900 bg-white dark:bg-gray-100 border border-gray-300 dark:border-transparent rounded-lg flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
            disabled={isLoading}
          >
            <GoogleIcon className="w-6 h-6" />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </form>
         <div className="text-center text-xs text-black dark:text-gray-300 pt-4">
            <p>This is a simulated sign-in. No real data is used.</p>
        </div>
      </div>
    </div>
  );
};