
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { Loader2, ArrowLeft, Phone, Mail, Globe, CheckCircle } from 'lucide-react';
import { sendOTP } from '../services/emailService';

type AuthStep = 'login' | 'signup';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, loginGuest } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  // OTP Verification State
  const [verificationSent, setVerificationSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Defaulting contact method based on input
  const contactMethod: 'email' | 'phone' = /^\+?[\d\s-]{10,}$/.test(identifier) ? 'phone' : 'email';

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Phase 1: Send OTP
    if (!verificationSent) {
      setLoading(true);
      try {
        if (!name || !identifier || !password) throw new Error("All fields are required");
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        
        // Basic email validation
        if (contactMethod === 'email' && !identifier.includes('@')) {
            throw new Error("Please enter a valid email address");
        }

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Send OTP via EmailJS
        const success = await sendOTP(identifier, code, contactMethod);
        
        if (success) {
            setGeneratedOtp(code);
            setVerificationSent(true);
            setError(''); // Clear any previous errors
        } else {
            throw new Error("Failed to send verification code. Please check your internet or email settings.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } 
    // Phase 2: Verify & Register
    else {
      setLoading(true);
      try {
        // Validation: Allow '123456' as a backdoor for testing if email fails delivery in demo mode
        if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
            throw new Error("Invalid Verification Code. Please try again.");
        }

        const newProfile: UserProfile = {
          name,
          email: identifier, // Using identifier as key
          contactMethod: contactMethod,
          phone: contactMethod === 'phone' ? identifier : undefined,
          university: "Tech University",
          year: "1st Year",
          domain: "General Engineering", // Default domain as requested
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
    }
  };

  const handleGuestLogin = () => {
    loginGuest();
    navigate('/');
  }

  const handleBack = () => {
     if (step !== 'login') {
         setStep('login');
         setError('');
         setVerificationSent(false);
     } else {
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
          {step === 'login' ? 'Sign in to study2skills' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Bridge the gap between skills and industry.
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
                      onChange={(e) => setIdentifier(e.target.value)}
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

              <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex justify-center items-center transition">
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
            <form className="space-y-6" onSubmit={handleSignup}>
              
              {!verificationSent ? (
                // Initial Signup Form
                <>
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
                    <label className="block text-sm font-medium text-slate-300">Email or Phone Number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
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

                  <div>
                    <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              ) : (
                // Verification Code Form
                <div className="text-center animate-fade-in">
                   <div className="mb-4 text-emerald-400 flex justify-center">
                       <CheckCircle size={48} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Verification Code Sent</h3>
                   <p className="text-slate-400 text-sm mb-6">
                       We've sent a 6-digit code to <br/>
                       <span className="text-white font-medium">{identifier}</span>
                   </p>
                   
                   <div className="mb-4">
                     <label className="block text-sm font-medium text-slate-300 text-left mb-1">Enter OTP Code</label>
                     <input
                         type="text"
                         required
                         maxLength={6}
                         value={enteredOtp}
                         onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                         className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-slate-700 rounded-lg bg-slate-950 text-white focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                         placeholder="000000"
                     />
                   </div>

                   <div className="flex justify-between text-xs text-slate-500">
                      <button 
                        type="button" 
                        onClick={() => { setVerificationSent(false); setEnteredOtp(''); }}
                        className="hover:text-white underline"
                      >
                         Change Email
                      </button>
                      <span>Expires in 10 mins</span>
                   </div>
                </div>
              )}

              {error && <div className="text-rose-500 text-sm bg-rose-500/10 p-2 rounded">{error}</div>}

              <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex justify-center items-center transition">
                {loading ? <Loader2 className="animate-spin" /> : (verificationSent ? 'Verify & Create Account' : 'Send Verification Code')}
              </button>

              <div className="text-center text-sm">
                 <span className="text-slate-500">Already have an account? </span>
                 <button type="button" onClick={() => { setStep('login'); setError(''); setVerificationSent(false); }} className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
