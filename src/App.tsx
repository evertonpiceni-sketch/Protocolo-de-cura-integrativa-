import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UserProfile, DayProgress, UserAccount, JourneyType, Language, CourseProgress, AppLayout } from './types';
import { ProfileSetup } from './components/ProfileSetup';
import { MeditationSession } from './components/MeditationSession';
import { Dashboard } from './components/Dashboard';
import { PersonalJourney21 } from './components/PersonalJourney21';
import { ArcanjoProtocolView } from './components/ArcanjoProtocolView';
import { LayoutChoiceModal } from './components/LayoutChoiceModal';
import { audioEngine } from './services/audioEngine';
import { evaluateAchievements } from './services/achievementService';
import { DAILY_INSIGHTS, JOURNEY_7D_INSIGHTS } from './constants';
import { APPROVED_LOGO_DATA_URI } from './brand';

const LOCAL_STORAGE_KEY_CURRENT_LOGIN = 'cura_current_login';
const LOCAL_STORAGE_KEY_ACCOUNTS = 'cura_accounts';
const AUTH_STARTUP_HARD_DEADLINE_MS = 7000;

const normalizeLayoutId = (layout?: AppLayout | string): AppLayout => layout === 'natural-sereno' ? 'natural-sereno' : 'natural-sereno';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [progress, setProgress] = useState<DayProgress[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [activeSessionDay, setActiveSessionDay] = useState<number | null>(null);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);
  const [showPersonalJourney, setShowPersonalJourney] = useState(false);
  const [showArcanjoView, setShowArcanjoView] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt-BR');

  const loadLocalAccountFallback = (): boolean => {
    try {
      const localLogin = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_LOGIN);
      if (!localLogin) return false;
      const rawAccounts = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      if (!rawAccounts) return false;
      const accounts: UserAccount[] = JSON.parse(rawAccounts);
      const localAccount = accounts.find(a => a.login === localLogin);
      if (!localAccount) return false;
      const offlineProfile: UserProfile = {
        ...localAccount.profile,
        isAdmin: false,
        plan: 'free',
        subscriptionPlan: undefined,
        subscriptionExpiresAt: undefined,
        subscriptionPrice: undefined,
        subscriptionPaymentMethod: undefined,
        proActiveSince: undefined,
        numerologyPurchased: false,
        astralMapPurchased: false,
        specificTreatments: []
      };
      setUserProfile(offlineProfile);
      setProgress(localAccount.progress || []);
      const nextUncompleted = localAccount.progress?.find((p: any) => !p.completed);
      setCurrentDay(nextUncompleted ? nextUncompleted.dayNumber : 21);
      setIsLoggedIn(false);
      return true;
    } catch (error) {
      console.warn('Storage fallback check bypassed', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    const hardDeadline = window.setTimeout(() => {
      if (!mounted) return;
      console.warn('Auth UI hard deadline activated');
      loadLocalAccountFallback();
      setIsLoadingAuth(false);
    }, AUTH_STARTUP_HARD_DEADLINE_MS);

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;
          const account = data.user;
          const profileWithAdmin = { ...account.profile, isAdmin: account.role === 'admin' };
          setUserProfile(profileWithAdmin);
          setProgress(account.progress || []);
          const nextUncompleted = account.progress?.find((p: any) => !p.completed);
          setCurrentDay(nextUncompleted ? nextUncompleted.dayNumber : 21);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          if (!loadLocalAccountFallback()) {
            const defaultProgress: DayProgress[] = Array.from({ length: 21 }, (_, index) => ({ dayNumber: index + 1, completed: false }));
            setProgress(defaultProgress);
          }
        }
      } catch (err) {
        if (mounted) {
          setIsLoggedIn(false);
          loadLocalAccountFallback();
        }
      } finally {
        window.clearTimeout(hardDeadline);
        if (mounted) setIsLoadingAuth(false);
      }
    };

    checkAuth();
    return () => {
      mounted = false;
      window.clearTimeout(hardDeadline);
    };
  }, []);

  useEffect(() => {
    const layout = normalizeLayoutId(userProfile?.visualLayout);
    document.documentElement.dataset.layout = layout;
    return () => {
      if (document.documentElement.dataset.layout === layout) delete document.documentElement.dataset.layout;
    };
  }, [userProfile?.visualLayout]);

  useEffect(() => {
    if (userProfile) {
      audioEngine.setBioactiveConfig({
        enabled: userProfile.bioactiveBinauralEnabled ?? false,
        waveType: userProfile.binauralWaveType ?? 'alpha',
        intensity: userProfile.binauralIntensity ?? 0.35,
        carrierMode: userProfile.binauralCarrierMode ?? 'sync',
        customCarrier: userProfile.binauralCustomCarrier
      });
      const shouldPlay = (userProfile.audioEnabled !== false) && userProfile.bgMusicType !== 'none' && activeSessionDay === null && !showPersonalJourney;
      if (shouldPlay) audioEngine.startBG(userProfile.bgMusicType); else audioEngine.stopBG();
    } else audioEngine.stopBG();
  }, [userProfile?.bgMusicType,userProfile?.audioEnabled,userProfile?.bgMusicVolume,userProfile?.bioactiveBinauralEnabled,userProfile?.binauralWaveType,userProfile?.binauralIntensity,userProfile?.binauralCarrierMode,activeSessionDay,showPersonalJourney]);

  useEffect(() => {
    if (!showPersonalJourney) return;
    audioEngine.stopSpeech();
    audioEngine.stopBG();
  }, [showPersonalJourney]);

  const updateLocalAccountCache = (profileToCache: UserProfile, progressToCache: DayProgress[]) => {
    try {
      const localLogin = profileToCache.login || localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_LOGIN);
      if (!localLogin) return;
      const rawAccounts = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      const accounts: UserAccount[] = rawAccounts ? JSON.parse(rawAccounts) : [];
      const index = accounts.findIndex(account => account.login === localLogin);
      const cachedAccount: UserAccount = { ...(index >= 0 ? accounts[index] : {} as UserAccount), login: localLogin, email: profileToCache.email || '', fullName: profileToCache.fullName || profileToCache.name || '', birthDate: profileToCache.birthDate || '', profile: { ...profileToCache, isAdmin: false }, progress: progressToCache, isAdmin: false };
      if (index >= 0) accounts[index] = cachedAccount; else accounts.push(cachedAccount);
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_LOGIN, localLogin);
    } catch (error) { console.warn('Local profile cache update failed', error); }
  };

  const saveProfile = (newProfile: UserProfile) => { setUserProfile(newProfile); updateLocalAccountCache(newProfile, progress); if (isLoggedIn) fetch('/api/user/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile:newProfile,progress})}).catch(console.error); };
  const saveProgress = (newProgress: DayProgress[]) => { setProgress(newProgress); if (userProfile) updateLocalAccountCache(userProfile,newProgress); if (isLoggedIn) fetch('/api/user/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile:userProfile,progress:newProgress})}).catch(console.error); };
  const handleOnboardingComplete = (account: UserAccount) => { setUserProfile(account.profile); setProgress(account.progress || []); setCurrentDay(account.progress?.find((p:any)=>!p.completed)?.dayNumber || 21); updateLocalAccountCache(account.profile,account.progress || []); };
  const handleLogout = () => { localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_LOGIN); setUserProfile(null); setIsLoggedIn(false); };
  const handleCompleteSession = () => { if (activeSessionDay === null) return; const updated = progress.map(p=>p.dayNumber===activeSessionDay?{...p,completed:true}:p); saveProgress(updated); setActiveSessionDay(null); };
  const handleSaveDiaryDay = (dayNum:number,journalText:string,mood?:number,sensations?:string,gratitudes?:string) => { const updated=progress.map(d=>d.dayNumber===dayNum?{...d,journalText,mood:mood!==undefined?mood:d.mood,sensations,gratitudes}:d); saveProgress(updated); if(userProfile){const unlocked=evaluateAchievements(userProfile,updated);saveProfile({...userProfile,unlockedAchievements:unlocked.unlockedIds});} };

  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'arcanjo') return <ArcanjoProtocolView userProfile={{name:'Prévia',subscriptionPlan:'arcanjo_7d'} as UserProfile} onLogout={()=>window.history.replaceState({},'', '/')} />;

  if (isLoadingAuth) return <div id="auth-loading-view" className="min-h-screen bg-[#F8F4EC] text-[#2A2420] flex flex-col items-center justify-center p-6 text-center"><div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#B88736] shadow-md p-1 bg-[#FBF8F2] flex items-center justify-center mb-4 animate-pulse"><img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni" className="w-full h-full object-contain" /></div><p className="text-[11px] font-mono tracking-widest text-[#8F631E] uppercase font-bold mb-1">Éverton Rodrigo Piceni • Terapias Holísticas</p><h2 className="text-xl font-display font-medium text-[#2A2420] mb-2">Protocolo da Transformação</h2><p className="text-xs text-[#5C5248] max-w-xs leading-relaxed">Preparando seu espaço de presença e acolhimento...</p><div className="ns-loading-details hidden" role="status"><p>Cuidar de si também<br/>é um ato de amor.</p><span className="ns-loading-track" aria-hidden="true"><span /></span><small>Preparando seu espaço de presença e acolhimento...</small></div></div>;
  if (!userProfile) return <ProfileSetup onComplete={handleOnboardingComplete} />;

  return <React.Suspense fallback={null}><Dashboard userProfile={userProfile} progress={progress} currentDay={currentDay} onStartDay={(day:number)=>setActiveSessionDay(day)} onSaveProfile={saveProfile} onLogout={handleLogout} onOpenPersonalJourney={()=>setShowPersonalJourney(true)} /></React.Suspense>;
}
