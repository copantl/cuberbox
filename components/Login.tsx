import React, { useState } from 'react';
import { 
  Zap,
  Lock, 
  User, 
  ArrowRight, 
  ShieldAlert, 
  Key, 
  RefreshCw, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  UserCircle, 
  Globe, 
  Layout, 
  Shield 
} from 'lucide-react';
import { UserRole } from '../types';
import Logo from './Logo';

interface LoginProps {
  onLogin: (role?: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'LOGIN' | 'MFA' | 'FORGOT_PASSWORD' | 'RECOVERY_SENT'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(['', '', '', '', '', '']);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('MFA');
    }, 1200);
  };

  const handleSSOLogin = () => {
    setLoading(true);
    console.debug("[Auth Engine] Redirecting to SSO Provider...");
    setTimeout(() => {
      setLoading(false);
      onLogin(UserRole.AGENT); 
    }, 2000);
  };

  const handleMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(selectedRole);
    }, 800);
  };

  const handleTokenChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);
    if (value && index < 5) document.getElementById(`token-${index + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center">
            <Logo className="w-20 h-20 mb-6" />
            <h1 className="text-4xl font-black tracking-tighter text-text-primary uppercase">CUBERBOX</h1>
            <p className="text-text-secondary font-black uppercase tracking-[0.5em] text-[10px] mt-2 opacity-80">CUBERBOX Nexus Core Infrastructure</p>
          </div>
        </div>

        <div className="bg-bg-card backdrop-blur-3xl p-10 rounded-[32px] border border-border-main shadow-2xl shadow-black/50 overflow-hidden">
          {step === 'LOGIN' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <button 
                onClick={handleSSOLogin}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-4 bg-text-primary hover:bg-text-secondary text-bg-main py-4 rounded-2xl transition-all shadow-xl font-black text-[10px] uppercase tracking-widest active:scale-95 group disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Globe size={18} className="text-accent-primary group-hover:rotate-12 transition-transform" />}
                <span>{loading ? 'Redirecting...' : 'Corporate SSO Access'}</span>
              </button>

              <div className="flex items-center space-x-4 text-text-secondary">
                 <div className="h-[1px] bg-border-main flex-1"></div>
                 <span className="text-[9px] font-black uppercase tracking-[0.4em]">Or Local Access</span>
                 <div className="h-[1px] bg-border-main flex-1"></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">Select Profile</label>
                  <div className="grid grid-cols-3 gap-3">
                      {[UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT].map(r => (
                        <button 
                          key={r}
                          type="button"
                          onClick={() => setSelectedRole(r)}
                          className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all ${selectedRole === r ? 'bg-accent-primary border-accent-primary text-white shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)]' : 'bg-white/5 border-border-main text-text-secondary hover:text-text-primary hover:bg-white/10'}`}
                        >
                          {r}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">Username / ID</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-primary transition-colors" size={16} />
                    <input type="text" required defaultValue="admin" className="w-full bg-white/5 border border-border-main rounded-2xl pl-12 pr-4 py-4 text-xs text-text-primary outline-none focus:border-accent-primary/30 transition-all placeholder-text-secondary font-bold tracking-widest uppercase" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-primary transition-colors" size={16} />
                    <input type="password" required defaultValue="password" className="w-full bg-white/5 border border-border-main rounded-2xl pl-12 pr-4 py-4 text-xs text-text-primary outline-none focus:border-accent-primary/30 transition-all placeholder-text-secondary font-bold tracking-widest uppercase" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-accent-primary hover:bg-accent-secondary text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)] flex items-center justify-center space-x-2 active:scale-95">
                  <span className="text-[10px] uppercase tracking-widest">{loading ? 'Validating...' : 'Login Local'}</span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          )}

          {step === 'MFA' && (
            <form onSubmit={handleMfa} className="space-y-10 animate-in zoom-in-95 duration-500">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-6">
                  <ShieldAlert size={40} />
                </div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">2FA Verification</h3>
                <p className="text-[10px] text-text-secondary leading-relaxed px-4 font-bold uppercase tracking-widest">Enter security code for <span className="text-accent-primary">{selectedRole}</span> profile.</p>
              </div>

              <div className="flex justify-between space-x-3 px-2">
                {token.map((digit, idx) => (
                  <input key={idx} id={`token-${idx}`} type="text" maxLength={1} value={digit} onChange={(e) => handleTokenChange(idx, e.target.value)} className="w-12 h-16 bg-white/5 border border-border-main rounded-xl text-center text-2xl font-black text-accent-primary focus:border-accent-primary outline-none transition-all" />
                ))}
              </div>

              <button type="submit" disabled={loading || token.some(d => !d)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2">
                 <span className="text-[10px] uppercase tracking-widest">{loading ? 'Synchronizing...' : 'Verify Identity'}</span>
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 text-center space-y-6">
           <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.5em]">CUBERBOX NEXUS CORE INFRASTRUCTURE v4.7.9</p>
           <div className="p-6 rounded-3xl bg-white/[0.02] border border-border-main">
             <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest leading-relaxed opacity-60">
               Protected by international intellectual property laws. <br/>
               © 2026 CUBERBOX Nexus Core. Unauthorized reproduction prohibited. <br/>
               <span className="text-text-secondary mt-2 block">Lead Architect: Galel López</span>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};


export default Login;