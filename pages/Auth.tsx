
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOTP } from '../services/emailService';
import { UserProfile } from '../types';
import { Loader2, ArrowLeft, Phone, Mail, Globe } from 'lucide-react';

type AuthStep = 'login' | 'signup' | 'otp';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, loginGuest } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('Full Stack Development');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  
  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const isPhone = (input: string) => /^\+?[\d\s-]{10,}$/.test(input);

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setIdentifier(val);
      setContactMethod(isPhone(val) ? 'phone' : 'email');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
      if (identifier.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!name || !identifier || !password) throw new Error("All fields are required");
      
      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      
      // Send Email or SMS
      await sendOTP(identifier, otp, contactMethod);
      
      // Move to OTP step
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (enteredOtp !== generatedOtp) {
        throw new Error("Invalid OTP code. Please try again.");
      }

      const newProfile: UserProfile = {
        name,
        email: identifier, // Using identifier as key
        contactMethod: contactMethod,
        phone: contactMethod === 'phone' ? identifier : undefined,
        university: "Tech University",
        year: "1st Year",
        domain,
        skills: [],
        bio: "Ready to learn!",
        gamification: {
          xp: 0,
          level: 1,
          badges: [],
          streakDays: 0,
          studyHoursTotal: 0
        }
      };

      await register(newProfile, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginGuest();
    navigate('/');
  }

  // Handle Back Navigation
  const handleBack = () => {
     // If we are on steps other than login, go back to login
     if (step !== 'login') {
         setStep('login');
         setError('');
     } else {
         // Otherwise go back in history or to a landing page if it exists (currently just reloads auth or goes nowhere if stack is empty, but user asked for "back arrow")
         navigate(-1);
     }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
       
      <button 
        onClick={handleBack} 
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center transition z-10 p-2 rounded-lg hover:bg-slate-900"
      >
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>
       
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {step === 'login' ? 'Sign in to study2skills' : step === 'otp' ? 'Verify your Contact' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          {step === 'otp' ? `We sent a code to ${identifier}` : 'Bridge the gap between skills and industry.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-xl sm:px-10">
          
          {step === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-300">Email or Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={handleIdentifierChange}
                      className="block w-full pl-10 px-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="alex@example.com or +1234567890"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        {contactMethod === 'email' ? <Mail size={16}/> : <Phone size={16}/>}
                    </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {error && <div className="text-rose-500 text-sm bg-rose-500/10 p-2 rounded">{error}</div>}

              <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </button>

              <div className="text-center text-sm">
                 <span className="text-slate-500">New here? </span>
                 <button type="button" onClick={() => { setStep('signup'); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-medium">Create account</button>
              </div>

              {/* Guest Login Divider */}
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-500">Or exploring?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full mt-4 py-2 px-4 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-medium flex justify-center items-center transition"
              >
                <Globe size={16} className="mr-2" /> Continue as Guest (Demo)
              </button>
            </form>
          )}

          {step === 'signup' && (
            <form className="space-y-6" onSubmit={handleSignupStart}>
              <div>
                <label className="block text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Interested Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Full Stack Development</option>
                  <option>Data Science</option>
                  <option>Machine Learning</option>
                  <option>Cybersecurity</option>
                  <option>Cloud Computing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Email or Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={handleIdentifierChange}
                      className="block w-full pl-10 px-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="alex@example.com or +1234567890"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        {contactMethod === 'email' ? <Mail size={16}/> : <Phone size={16}/>}
                    </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {error && <div className="text-rose-500 text-sm bg-rose-500/10 p-2 rounded">{error}</div>}

              <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : `Verify & Sign Up`}
              </button>

              <div className="text-center text-sm">
                 <span className="text-slate-500">Already have an account? </span>
                 <button type="button" onClick={() => { setStep('login'); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleOtpVerify}>
               <div className="text-center">
                  <p className="text-slate-300 mb-4">Enter the 6-digit code sent to your {contactMethod}.</p>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="block w-full text-center text-2xl tracking-widest px-3 py-4 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                    placeholder="000000"
                  />
               </div>

               {error && <div className="text-rose-500 text-sm bg-rose-500/10 p-2 rounded text-center">{error}</div>}

               <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Create Account'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep('signup')}
                className="w-full text-sm text-slate-500 hover:text-white"
              >
                Change Contact Info / Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
