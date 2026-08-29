import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [botAccount] = useState('lilman110200');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle initial username submit
  const handleStartVerify = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your Roblox username.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Check if player joined the game & complete verification
  const handleCompleteVerify = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch user rank from Supabase to confirm sync
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .ilike('roblox_username', username.trim())
        .single();

      if (dbError || !data) {
        setError('Verification not detected yet. Please make sure you joined the game and were kicked with the confirmation message.');
        setLoading(false);
        return;
      }

      // Save active session locally and redirect to dashboard
      localStorage.setItem('portal_user', JSON.stringify(data));
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Head>
        <title>Golden Glades Middle - Verify</title>
      </Head>

      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Golden Glades Middle</h1>
        <button 
          onClick={() => setStep(1)} 
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 tracking-wider uppercase flex items-center gap-1"
        >
          ➔ VERIFY
        </button>
      </nav>

      {/* Main Content Box */}
      <main className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
          
          {/* STEP 1: Enter Username */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-sm font-semibold text-gray-700 pb-3 border-b border-gray-100">
                Golden Glades Middle Portal Verification
              </h2>
              <p className="text-xs text-gray-500 my-4">
                Follow this simple verification process to confirm your identity and access your gradebook and student records.
              </p>

              <form onSubmit={handleStartVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    What is your Roblox username?
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm transition"
                >
                  ➔ Next
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Join Verification Game */}
          {step === 2 && (
            <div className="p-6 space-y-6">
              {/* Step 1 Card */}
              <div className="bg-white border border-gray-100 rounded p-4 text-center space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Step 1</h3>
                <p className="text-xs text-gray-600">
                  Join the Golden Glades verification game on the <span className="font-semibold text-gray-800">{botAccount}</span> account.
                </p>
                <a
                  href="https://www.roblox.com/games/85015447144654/Verification-Center"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm transition text-center"
                >
                  ❐ Launch Verification Game
                </a>
              </div>

              {/* Step 2 Card */}
              <div className="bg-white border border-gray-100 rounded p-4 text-center space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Step 2</h3>
                <p className="text-xs text-gray-600">
                  Press the button below once kicked to open your portal
                </p>
                <button
                  onClick={handleCompleteVerify}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 rounded text-sm transition"
                >
                  {loading ? 'Verifying...' : '✓ Done'}
                </button>
              </div>

              {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}