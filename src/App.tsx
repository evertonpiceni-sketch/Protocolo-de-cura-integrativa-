/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Calendar, BookOpen, Volume2, VolumeX, User, RefreshCw, Compass, Heart, Award, Info, X, Play, Clock, Smile, LogOut, Crown, Star, Check, Mic, Sliders, Activity, FileText, Globe, MessageCircle, Phone, Smartphone, Download, Leaf, Bell, Headphones } from 'lucide-react';
import { DayProgress, UserProfile, UserAccount, DAILY_INSIGHTS, JOURNEY_7D_INSIGHTS, PROTOCOL_STAGES, AnamnesisData, SpecificTreatment, SessionCheckIn, JourneyType } from './types';
import ProfileSetup from './components/ProfileSetup';
import TrackerGrid from './components/TrackerGrid';
import MeditationSession from './components/MeditationSession';
import JournalLog from './components/JournalLog';
import ProUpgradeModal from './components/ProUpgradeModal';
import ProReportCertificateModal from './components/ProReportCertificateModal';
import AnamnesisModal from './components/AnamnesisModal';
import SpecificTreatmentModal from './components/SpecificTreatmentModal';
import ChakrasGuideModal from './components/ChakrasGuideModal';
import HerbalBathsModal from './components/HerbalBathsModal';
import PlansValuesGuideModal from './components/PlansValuesGuideModal';
import AstralMapModal from './components/AstralMapModal';
import NumerologyModal from './components/NumerologyModal';
import MobileInstallModal from './components/MobileInstallModal';
import OnboardingFlow from './components/OnboardingFlow';
import ArchangelMichaelPrayerModal from './components/ArchangelMichaelPrayerModal';
import AudioSettingsModal from './components/AudioSettingsModal';
import CoursesModal from './components/CoursesModal';
import AdminPanelModal from './components/AdminPanelModal';
import HooponoponoModal from './components/HooponoponoModal';
import AchievementsModal from './components/AchievementsModal';
import SystemicQuestionsModal from './components/SystemicQuestionsModal';
import DailyDiaryModal from './components/DailyDiaryModal';
import ContactModal from './components/ContactModal';
import PromoVideoModal from './components/PromoVideoModal';
import MilestoneCelebrationModal from './components/MilestoneCelebrationModal';
import { calculateAstralMap } from './utils/astrology';
import { audioEngine } from './lib/audio';
import { evaluateAchievements } from './lib/achievementsData';
import { AppLanguage, SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from './lib/i18n';
import { AnimatePresence } from "motion/react";
import SimpleProtocol from './components/SimpleProtocol';
import { localNotificationManager } from './lib/notifications';

const LOCAL_STORAGE_KEY_CURRENT_LOGIN = 'cura_integrada_logged_in_user_v1';
const LOCAL_STORAGE_KEY_ACCOUNTS = 'cura_integrada_accounts_v1';

const BG_TRACKS: Record<'396hz' | '528hz' | '432hz' | 'waves', string[]> = {
  '396hz': [
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/Ethereal_Ether_%28ambient_synthesizer_music_by_Z8Phyr%29.mp3',
    'https://upload.wikimedia.org/wikipedia/commons/1/1d/Stargazing_%28ambient_synthesizer_music_by_Z8Phyr%29.mp3'
  ],
  '528hz': [
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/Ethereal_Ether_%28ambient_synthesizer_music_by_Z8Phyr%29.mp3',
    'https://upload.wikimedia.org/wikipedia/commons/a/a2/Clair_de_Lune_%28Debussy%29.mp3'
  ],
  '432hz': [
    'https://upload.wikimedia.org/wikipedia/commons/2/23/Warm_Aura_%28ambient_synthesizer_music_by_Z8Phyr%29.mp3',
    'https://upload.wikimedia.org/wikipedia/commons/e/e5/Gymnop%C3%A9die_No._1_-_Satie_-_performed_by_La_Tempesta.mp3'
  ],
  'waves': [
    'https://upload.wikimedia.org/wikipedia/commons/1/1d/Stargazing_%28ambient_synthesizer_music_by_Z8Phyr%29.mp3',
    'https://upload.wikimedia.org/wikipedia/commons/c/c9/Stardust_%28ambient_synthesizer_music_by_Z8Phyr%29.mp3'
  ],
};

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<DayProgress[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>('pt');
  
  // Navigation & Interactive states
  const [showSimpleProtocol, setShowSimpleProtocol] = useState(false);
  const [activeSessionDay, setActiveSessionDay] = useState<number | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showAnamnesisModal, setShowAnamnesisModal] = useState<boolean>(false);
  const [showSpecificTreatmentModal, setShowSpecificTreatmentModal] = useState<boolean>(false);
  const [showChakrasModal, setShowChakrasModal] = useState<boolean>(false);
  const [showHerbalBathsModal, setShowHerbalBathsModal] = useState<boolean>(false);
  const [showPlansGuideModal, setShowPlansGuideModal] = useState<boolean>(false);
  const [showAstralMapModal, setShowAstralMapModal] = useState<boolean>(false);
  const [showNumerologyModal, setShowNumerologyModal] = useState<boolean>(false);
  const [showMobileInstallModal, setShowMobileInstallModal] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [showArchangelModal, setShowArchangelModal] = useState<boolean>(false);
  const [showHooponoponoModal, setShowHooponoponoModal] = useState<boolean>(false);
  const [showAudioSettingsModal, setShowAudioSettingsModal] = useState<boolean>(false);
  const [showCoursesModal, setShowCoursesModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showSystemicQuestionsModal, setShowSystemicQuestionsModal] = useState<boolean>(false);
  const [systemicModalDay, setSystemicModalDay] = useState<number>(1);
  const [showDailyDiaryModal, setShowDailyDiaryModal] = useState<boolean>(false);
  const [dailyDiaryModalDay, setDailyDiaryModalDay] = useState<number>(1);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showPromoVideoModal, setShowPromoVideoModal] = useState<boolean>(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState<boolean>(false);
  const [milestoneModalDay, setMilestoneModalDay] = useState<number>(8);
  const [inAppToast, setInAppToast] = useState<{ title: string; body: string } | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingVoiceTest, setIsPlayingVoiceTest] = useState<boolean>(false);

  // Initialize and register local notification daily checker
  useEffect(() => {
    localNotificationManager.setInAppNotifier((title, body) => {
      setInAppToast({ title, body });
      setTimeout(() => setInAppToast(null), 8000);
    });

    if (userProfile && userProfile.notificationsEnabled !== false) {
      localNotificationManager.startDailyChecker(
        userProfile.reminderTime || '20:00', 
        userProfile.name,
        currentDay,
        userProfile.anamnesis?.mainComplaints || []
      );
    }

    return () => {
      localNotificationManager.stopDailyChecker();
    };
  }, [userProfile?.reminderTime, userProfile?.notificationsEnabled, userProfile?.name, currentDay, userProfile?.anamnesis?.mainComplaints]);

  // Capture PWA / Android installation prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Load available system voices for voice humanization
  useEffect(() => {
    const updateVoices = () => {
      const voices = audioEngine.getAvailableVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Synchronize global audio player with profile settings and fallbacks using unified audioEngine
  useEffect(() => {
    if (userProfile) {
      // Set volume
      audioEngine.setBGVolume(userProfile.bgMusicVolume ?? 0.5);

      // Handle play/pause state
      const shouldPlay = (userProfile.audioEnabled !== false) && 
                         userProfile.bgMusicType !== 'none' && 
                         activeSessionDay === null; // Pause global background music during active session to prevent overlapping

      if (shouldPlay) {
        audioEngine.startBG(userProfile.bgMusicType);
      } else {
        audioEngine.stopBG();
      }
    } else {
      audioEngine.stopBG();
    }
  }, [userProfile?.bgMusicType, userProfile?.audioEnabled, userProfile?.bgMusicVolume, activeSessionDay]);

  // Handle autoplay block browser policy unlock on first interaction
  useEffect(() => {
    const handleGesture = () => {
      audioEngine.unlock();

      if (userProfile) {
        const shouldPlay = (userProfile.audioEnabled !== false) && 
                           userProfile.bgMusicType !== 'none' && 
                           activeSessionDay === null;
                           
        if (shouldPlay) {
          audioEngine.startBG(userProfile.bgMusicType);
          // Successfully started, safe to remove listeners now
          window.removeEventListener('click', handleGesture);
          window.removeEventListener('touchstart', handleGesture);
        }
      }
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [userProfile, activeSessionDay]);

  useEffect(() => {
    if (!userProfile?.reminderTime || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const checkReminder = () => {
      const now = new Date();
      const currentHHMM = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      if (currentHHMM === userProfile.reminderTime) {
        const lastNotified = localStorage.getItem('cura_last_notified_date');
        const todayStr = now.toDateString();
        
        if (lastNotified !== todayStr) {
          localStorage.setItem('cura_last_notified_date', todayStr);
          new Notification('Hora da sua Cura Integrada', {
            body: `Olá, ${userProfile.name}! Reserve este momento sagrado para a sua meditação de hoje.`,
            icon: '/icon-192.png'
          });
        }
      }
    };

    const interval = setInterval(checkReminder, 60000); // Check every minute
    checkReminder(); // Initial check

    return () => clearInterval(interval);
  }, [userProfile?.reminderTime, userProfile?.name]);

  // Initialize and load saved state from localStorage on mount
  useEffect(() => {
    const activeLogin = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_LOGIN);
    const savedAccounts = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);

    const defaultProgress: DayProgress[] = Array.from({ length: 21 }, (_, index) => ({
      dayNumber: index + 1,
      completed: false,
      journalText: '',
      mood: 5
    }));

    if (activeLogin && savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts) as UserAccount[];
        const account = accounts.find(acc => acc.login === activeLogin.toLowerCase());
        
        if (account) {
          const profile = account.profile;
          if (profile && profile.audioEnabled === undefined) {
            profile.audioEnabled = true;
          }
          setUserProfile(profile);
          
          const parsedProgress = account.progress || defaultProgress;
          const cleanProgress = defaultProgress.map(def => {
            const match = parsedProgress.find(p => p.dayNumber === def.dayNumber);
            return match ? { ...def, ...match } : def;
          });
          setProgress(cleanProgress);
          
          const nextUncompleted = cleanProgress.find(p => !p.completed);
          if (nextUncompleted) {
            setCurrentDay(nextUncompleted.dayNumber);
          } else {
            setCurrentDay(21);
          }
        }
      } catch (e) {
        console.error("Error loading account data on mount", e);
      }
    }
  }, []);

  // Save profile state whenever it changes
  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    if (newProfile.login) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      let accounts: UserAccount[] = [];
      if (saved) {
        try { accounts = JSON.parse(saved); } catch (e) {}
      }
      const updatedAccounts = accounts.map(acc => {
        if (acc.login === newProfile.login) {
          return { ...acc, profile: newProfile };
        }
        return acc;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
    }
  };

  // Save progress state whenever it changes
  const saveProgress = (newProgress: DayProgress[]) => {
    setProgress(newProgress);
    if (userProfile && userProfile.login) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      let accounts: UserAccount[] = [];
      if (saved) {
        try { accounts = JSON.parse(saved); } catch (e) {}
      }
      const updatedAccounts = accounts.map(acc => {
        if (acc.login === userProfile.login) {
          return { ...acc, progress: newProgress };
        }
        return acc;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
    }
  };

  // Profile Onboarding complete (Register or Login complete)
  const handleOnboardingComplete = (account: UserAccount) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_LOGIN, account.login);
    setUserProfile(account.profile);
    setProgress(account.progress);
    
    const nextUncompleted = account.progress.find(p => !p.completed);
    setCurrentDay(nextUncompleted ? nextUncompleted.dayNumber : 21);

    const bgMusic = account.profile.bgMusicType;
    if (bgMusic !== 'none') {
      audioEngine.unlock();
      audioEngine.setBGVolume(account.profile.bgMusicVolume ?? 0.5);
      audioEngine.startBG(bgMusic);
    }

    // Check if welcome modal was seen
    const seenWelcome = localStorage.getItem('cura_integrada_welcome_seen_v1');
    if (!seenWelcome) {
      setShowWelcomeModal(true);
    }
  };

  // Complete a meditation session
  const handleCompleteSession = (
    dayNum: number,
    journalText: string,
    moodRating: number,
    beforeFeeling?: SessionCheckIn,
    afterFeeling?: SessionCheckIn
  ) => {
    // 1. Update the daily progress logs
    const updatedProgress = progress.map(day => {
      if (day.dayNumber === dayNum) {
        return {
          ...day,
          completed: true,
          completedAt: new Date().toISOString(),
          journalText,
          mood: moodRating,
          beforeFeeling,
          afterFeeling
        };
      }
      return day;
    });

    // 2. Compute streaks and update profile
    let updatedProfile = userProfile;
    if (userProfile) {
      let streak = userProfile.currentStreak;
      streak = streak + 1;
      const newLongest = Math.max(streak, userProfile.longestStreak);

      const evaluatedAchievements = evaluateAchievements({
        ...userProfile,
        currentStreak: streak,
        longestStreak: newLongest
      }, updatedProgress);

      updatedProfile = {
        ...userProfile,
        currentStreak: streak,
        longestStreak: newLongest,
        unlockedAchievements: evaluatedAchievements.unlockedIds
      };
      setUserProfile(updatedProfile);
    }

    setProgress(updatedProgress);

    // Save both updatedProfile and updatedProgress to accounts
    if (updatedProfile && updatedProfile.login) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      let accounts: UserAccount[] = [];
      if (saved) {
        try { accounts = JSON.parse(saved); } catch (e) {}
      }
      const updatedAccounts = accounts.map(acc => {
        if (acc.login === updatedProfile!.login) {
          return {
            ...acc,
            profile: updatedProfile!,
            progress: updatedProgress
          };
        }
        return acc;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
    }

    // 3. Move to next day automatically or lock on 21
    const nextUncompleted = updatedProgress.find(p => !p.completed);
    if (nextUncompleted) {
      setCurrentDay(nextUncompleted.dayNumber);
    }

    // Close players and open details or success alert
    setActiveSessionDay(null);
    setSelectedDayDetail(dayNum); // show summary modal

    // Trigger milestone celebration for day 8 (Karuna Ki), 15 (Raio Rosa), and 21 (Conclusão & Assumir o Trono)
    if (dayNum === 8 || dayNum === 15 || dayNum === 21) {
      setMilestoneModalDay(dayNum);
      setShowMilestoneModal(true);
    }
  };

  // Factory reset utility for users wishing to restart their 21-day program
  const handleResetProgram = () => {
    if (window.confirm("Atenção: Isso irá apagar todo o seu progresso dos 21 dias e as anotações do diário de cura. Deseja reiniciar o ciclo de cura?")) {
      const defaultProgress: DayProgress[] = Array.from({ length: 21 }, (_, index) => ({
        dayNumber: index + 1,
        completed: false,
        journalText: '',
        mood: 5
      }));

      setProgress(defaultProgress);
      setCurrentDay(1);
      setIsJournalOpen(false);
      setSelectedDayDetail(null);
      setShowSettings(false);

      if (userProfile) {
        const updatedProfile: UserProfile = {
          ...userProfile,
          currentStreak: 0,
          longestStreak: 0
        };
        setUserProfile(updatedProfile);

        // Update in accounts array
        if (userProfile.login) {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
          let accounts: UserAccount[] = [];
          if (saved) {
            try { accounts = JSON.parse(saved); } catch (e) {}
          }
          const updatedAccounts = accounts.map(acc => {
            if (acc.login === userProfile.login) {
              return {
                ...acc,
                profile: updatedProfile,
                progress: defaultProgress
              };
            }
            return acc;
          });
          localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
        }
      }
    }
  };

  // Log out the current user
  const handleLogout = () => {
    audioEngine.stopBG();
    localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_LOGIN);
    setUserProfile(null);
    setProgress([]);
    setCurrentDay(1);
    setIsJournalOpen(false);
    setSelectedDayDetail(null);
    setShowSettings(false);
  };

  // Retrieve mood description text
  const getMoodLabel = (mood?: number) => {
    if (!mood) return "Pacífico";
    switch (mood) {
      case 1: return "Pesado";
      case 2: return "Inquieto";
      case 3: return "Neutro";
      case 4: return "Calmo";
      case 5: return "Em Paz";
      default: return "Pacífico";
    }
  };

  // Toggle user audio configuration options
  const handleSettingsUpdate = (bgType: '528hz' | '432hz' | 'waves' | 'none') => {
    if (userProfile) {
      saveProfile({
        ...userProfile,
        bgMusicType: bgType
      });
    }
  };

  // Save updated anamnesis data to user profile and adjust recommended frequency
  const handleSaveAnamnesis = (newAnamnesis: AnamnesisData) => {
    if (!userProfile) return;
    const updatedProfile: UserProfile = {
      ...userProfile,
      anamnesis: newAnamnesis,
      // If user hasn't set custom music yet or accepts recommended frequency:
      bgMusicType: (newAnamnesis.recommendedFrequency === '963hz' || newAnamnesis.recommendedFrequency === '741hz') && userProfile.plan !== 'pro'
        ? userProfile.bgMusicType
        : newAnamnesis.recommendedFrequency,
      audioEnabled: true
    };
    saveProfile(updatedProfile);
    if (updatedProfile.bgMusicType !== 'none') {
      audioEngine.startBG(updatedProfile.bgMusicType);
    }
  };

  // Save purchased / requested specific individual treatment
  const handleConfirmSpecificTreatment = (newTreatment: SpecificTreatment) => {
    if (!userProfile) return;
    const existing = userProfile.specificTreatments || [];
    const updatedProfile: UserProfile = {
      ...userProfile,
      specificTreatments: [newTreatment, ...existing]
    };
    saveProfile(updatedProfile);
  };

  // Save systemic answer for a specific day and evaluate achievements
  const handleSaveSystemicAnswer = (dayNum: number, answer: string) => {
    const updatedProgress = progress.map(d => {
      if (d.dayNumber === dayNum) {
        return {
          ...d,
          systemicAnswer: answer,
          systemicAnsweredAt: new Date().toISOString()
        };
      }
      return d;
    });

    saveProgress(updatedProgress);

    if (userProfile) {
      const unlocked = evaluateAchievements(userProfile, updatedProgress);
      const updatedProfile: UserProfile = {
        ...userProfile,
        unlockedAchievements: unlocked.unlockedIds
      };
      saveProfile(updatedProfile);
    }
  };

  // Save detailed diary entry for a day
  const handleSaveDiaryDay = (dayNum: number, journalText: string, mood?: number, sensations?: string, gratitudes?: string) => {
    const updatedProgress = progress.map(d => {
      if (d.dayNumber === dayNum) {
        return {
          ...d,
          journalText,
          mood: mood !== undefined ? mood : d.mood,
          sensations,
          gratitudes
        };
      }
      return d;
    });

    saveProgress(updatedProgress);

    if (userProfile) {
      const unlocked = evaluateAchievements(userProfile, updatedProgress);
      const updatedProfile: UserProfile = {
        ...userProfile,
        unlockedAchievements: unlocked.unlockedIds
      };
      saveProfile(updatedProfile);
    }
  };

  // Save treatment expectations
  const handleSaveTreatmentExpectations = (expectations: string) => {
    if (!userProfile) return;
    const updatedProfile: UserProfile = {
      ...userProfile,
      treatmentExpectations: expectations
    };
    
    const unlocked = evaluateAchievements(updatedProfile, progress);
    const withAchievements: UserProfile = {
      ...updatedProfile,
      unlockedAchievements: unlocked.unlockedIds
    };
    saveProfile(withAchievements);
  };

  // If user profile is not configured yet, direct to onboarding profile setup
  if (!userProfile) {
    return <ProfileSetup onComplete={handleOnboardingComplete} />;
  }

  const selectedProgress = selectedDayDetail ? progress.find(p => p.dayNumber === selectedDayDetail) : null;
  const currentInsightsList = userProfile.selectedJourney === '7d' ? JOURNEY_7D_INSIGHTS : DAILY_INSIGHTS;
  const selectedInsight = selectedDayDetail ? currentInsightsList[selectedDayDetail - 1] : null;

  return (
    <>

      <AnimatePresence>
        {showSimpleProtocol && (
          <SimpleProtocol onClose={() => setShowSimpleProtocol(false)} />
        )}
      </AnimatePresence>

      {activeSessionDay !== null ? (
                <MeditationSession
          dayNumber={activeSessionDay}
          userName={userProfile.name}
          bgMusicType={userProfile.bgMusicType}
          voiceId={userProfile.voiceId}
          voiceRate={userProfile.voiceRate}
          voicePitch={userProfile.voicePitch}
          userPlan={userProfile.plan}
          customDecree={userProfile.anamnesis?.customDecree}
          prescribedFocus={userProfile.anamnesis?.prescribedFocus}
          initialLanguage={currentLanguage}
          journeyType={userProfile.plan === 'pro' && userProfile.anamnesis?.recommendedCycle === '7d' ? '7d' : '21d'}
          healingFocuses={userProfile.healingFocuses}
          pauseDuration={userProfile.pauseDuration}
          onCompleteSession={handleCompleteSession}
          onClose={() => setActiveSessionDay(null)}
          onOpenProModal={() => setShowProModal(true)}
          onChangeBgMusic={(bgType) => {
            saveProfile({
              ...userProfile,
              bgMusicType: bgType,
              audioEnabled: bgType !== 'none' ? true : userProfile.audioEnabled
            });
          }}
        />
      ) : (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500/30 selection:text-indigo-200" id="cura-main-layout">
      {/* Dynamic atmospheric radial flares */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.08)_0,transparent_60%)] pointer-events-none" />

      {/* Main Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-3 sm:px-4 py-3" id="main-header">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase font-semibold block truncate">Terapia Integrada</span>
              <h1 className="text-xs sm:text-sm font-display font-medium text-slate-200 tracking-tight leading-tight truncate">
                Protocolo Éverton Piceni
              </h1>
            </div>
          </div>

          {/* Header Controls: VIP, Audio, Language */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
            {/* VIP Pro Badge or Upgrade CTA */}
            {userProfile.plan === 'pro' ? (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-amber-500/5 shrink-0"
                title="Abrir Certificado e Relatório Quântico"
              >
                <Crown size={14} className="text-amber-400" />
                <span className="hidden sm:inline">MEMBRO PRO</span>
                <span className="sm:hidden">PRO</span>
              </button>
            ) : (
              <button
                onClick={() => setShowProModal(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold font-sans flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/10 shrink-0"
              >
                <Crown size={14} />
                <span>Seja VIP</span>
              </button>
            )}

            {/* Botão Oração Arcanjo Miguel (100% Gratuito) */}
            <button
              onClick={() => setShowArchangelModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer shadow-sm shrink-0"
              title="Oração de 21 Dias do Arcanjo Miguel (Gratuito)"
              id="header-btn-archangel"
            >
              <Sparkles size={13} className="text-blue-400" />
              <span className="hidden md:inline">Oração Arcanjo Miguel</span>
              <span className="md:hidden hidden xs:inline">Arcanjo</span>
            </button>

            {/* Quick Audio Mute/Unmute & Volume Controller */}
            {userProfile && (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" id="header-audio-quick-control">
                <button
                  onClick={() => {
                    const nextAudioEnabled = !userProfile.audioEnabled;
                    const nextMusicType = nextAudioEnabled && userProfile.bgMusicType === 'none' 
                      ? '528hz' 
                      : userProfile.bgMusicType;
                    saveProfile({
                      ...userProfile,
                      audioEnabled: nextAudioEnabled,
                      bgMusicType: nextMusicType
                    });
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl transition flex items-center justify-center border cursor-pointer ${
                    userProfile.audioEnabled && userProfile.bgMusicType !== 'none'
                      ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-400 hover:bg-indigo-950/50'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                  title={userProfile.audioEnabled && userProfile.bgMusicType !== 'none' ? "Silenciar trilha de cura" : "Ativar trilha de cura"}
                >
                  {userProfile.audioEnabled && userProfile.bgMusicType !== 'none' ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
                </button>
                
                {/* Botão de Ajuste Completo de Som */}
                <button
                  onClick={() => setShowAudioSettingsModal(true)}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition cursor-pointer"
                  title="Ajustar sons, frequências e vozes personalizadas"
                  id="header-btn-audio-settings"
                >
                  <Sliders size={13} className="text-indigo-400" />
                  <span className="hidden sm:inline">Ajustar Som</span>
                </button>
              </div>
            )}

            {/* Language Selector (Centered & Balanced Layout) */}
            <div className="hidden xs:flex items-center justify-center bg-slate-900/90 border border-slate-800 rounded-xl px-2 py-1.5 gap-1.5 shrink-0 shadow-sm" id="header-language-selector">
              <Globe size={13} className="text-indigo-400 shrink-0" />
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as AppLanguage)}
                className="bg-transparent text-[11px] font-mono text-indigo-300 font-semibold cursor-pointer outline-none border-none py-0 focus:ring-0 leading-none pr-1"
                title="Mudar idioma do aplicativo e do áudio"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-200">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Google Play / Android App Install CTA */}
            <button
              onClick={() => setShowMobileInstallModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-500/5 shrink-0"
              title="Instalar aplicativo oficial no seu celular Android / Google Play"
              id="header-btn-google-play"
            >
              <Smartphone size={13} className="text-emerald-400 animate-pulse" />
              <span className="hidden lg:inline">Google Play</span>
              <span className="lg:hidden hidden sm:inline">App</span>
            </button>

            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm"
              title="Encerrar sessão e sair do aplicativo"
              id="header-btn-logout"
            >
              <LogOut size={13} className="text-rose-400" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Workspace View Area */}
      <main className="flex-1 relative z-10 py-6 pb-28 md:pb-24">
        {/* Settings view */}
        {showSettings ? (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6" id="settings-view">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-display font-medium text-slate-200">Ajustes da Prática</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 text-slate-500 hover:text-slate-300">
                <X size={16} />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6">
              {/* PRO VIP Status Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="text-amber-400" size={18} />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      Status da Conta: {userProfile.plan === 'pro' ? 'MEMBRO PRO VIP' : 'PLANO GRATUITO'}
                    </span>
                  </div>
                  {userProfile.plan === 'pro' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-semibold border border-amber-500/40">
                      ATIVO ANUAL
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowProModal(true)}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Fazer Upgrade</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {userProfile.plan === 'pro'
                    ? 'Você possui acesso anual a todas as Frequências Sagradas (963Hz/741Hz), vozes neurais humanizadas, download dos áudios e emissão do certificado nominal.'
                    : 'Acesse as frequências quânticas 963Hz e 741Hz, emissão do Certificado Oficial Nominal de Conclusão e Relatório Quântico dos 21 Dias.'}
                </p>

                {userProfile.plan === 'pro' && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Award size={14} />
                      <span>Ver Certificado & Relatório</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Profile details */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-500 uppercase block">Dados do Usuário</span>
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3.5">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-indigo-400" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Nome Completo</span>
                      <span className="text-sm font-medium text-slate-200">{userProfile.fullName || userProfile.name}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3.5 border-t border-slate-900">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Login</span>
                      <span className="text-xs font-semibold text-indigo-300">@{userProfile.login || "local"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">E-mail</span>
                      <span className="text-xs text-slate-300 break-all">{userProfile.email || "Não cadastrado"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Nascimento</span>
                      <span className="text-xs text-slate-300">
                        {userProfile.birthDate ? new Date(userProfile.birthDate + 'T00:00:00').toLocaleDateString('pt-BR') : "Não informado"}
                      </span>
                    </div>
                  </div>

                  {/* Mapa Astral Quick Trigger inside Profile Card */}
                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-xs text-purple-300 flex items-center gap-1.5 font-medium">
                      <Compass size={14} className="text-amber-400" />
                      <span>Mapa Astral & Energético Quântico</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAstralMapModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles size={12} className="text-amber-400" />
                      <span>Ver Mapa Astral Completo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Daily Reminder Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1.5 font-bold">
                    <Bell size={14} className="text-amber-400" />
                    <span>Lembrete Diário da Prática</span>
                  </span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs text-slate-300 font-medium">Receber notificação inspiradora</p>
                    <p className="text-[10px] text-slate-500">Avisaremos você no horário da sua meditação diária.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={userProfile.reminderTime || "20:00"}
                      onChange={(e) => {
                        saveProfile({ ...userProfile, reminderTime: e.target.value });
                        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
                          Notification.requestPermission();
                        }
                      }}
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                    />
                    <button 
                      onClick={() => {
                         if (typeof Notification !== 'undefined') {
                           if (Notification.permission !== 'granted') {
                             Notification.requestPermission().then(p => {
                               if(p === 'granted') {
                                 new Notification('Terapia Integrada', { body: 'Permissão concedida! Você receberá seus lembretes diários.' });
                               }
                             });
                           } else {
                             new Notification('Terapia Integrada', { body: 'Tudo certo! Lembrete configurado para ' + (userProfile.reminderTime || '20:00') });
                           }
                         }
                      }}
                      className="text-[10px] bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg font-medium border border-indigo-500/30 hover:bg-indigo-500/30 transition cursor-pointer"
                    >
                      Ativar Lembrete
                    </button>
                  </div>
                </div>
              </div>

              {/* Anamnesis Terapêutica in Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 uppercase block flex items-center gap-1.5 font-bold">
                    <Activity size={14} className="text-indigo-400" />
                    <span>Ficha de Anamnese & Prescrição Energética</span>
                  </span>
                  {userProfile.anamnesis ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      Ficha Preenchida
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                      Pendente
                    </span>
                  )}
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {userProfile.anamnesis
                      ? `Frequência Prescrita: ${userProfile.anamnesis.recommendedFrequency.toUpperCase()} • Foco: ${userProfile.anamnesis.primaryGoal}`
                      : 'Realize o diagnóstico holístico para mapear dores, chakras desbalanceados e gerar sua frequência e decreto personalizados.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAnamnesisModal(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>{userProfile.anamnesis ? 'Visualizar / Refazer Ficha de Anamnese' : 'Preencher Ficha de Anamnese'}</span>
                  </button>
                </div>
              </div>

              {/* Humanized Voice & Synthesis Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 uppercase block flex items-center gap-1.5">
                    <Mic size={14} className="text-indigo-400" />
                    <span>Voz Neural & Humanização de Leitura</span>
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Pausas Naturais
                  </span>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                  {/* Voice Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">
                      Voz de Condução ({availableVoices.length > 0 ? `${availableVoices.length} vozes detectadas` : 'Voz Padrão do Sistema'})
                    </label>
                    <select
                      value={userProfile.voiceId || ''}
                      onChange={(e) => {
                        saveProfile({
                          ...userProfile,
                          voiceId: e.target.value
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                    >
                      <option key="voice-auto" value="">Automático: Melhor Voz Português (Neural/Acolhedora)</option>
                      {availableVoices.map((v, index) => (
                        <option key={`voice-${v.voiceURI || v.name}-${index}`} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Speed / Cadence Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-slate-400 text-[10px] uppercase">
                        Cadência da Fala (Compassada para Meditação)
                      </span>
                      <span className="text-indigo-400 font-mono font-semibold">
                        {(userProfile.voiceRate ?? 0.82).toFixed(2)}x
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500">Mais Calma</span>
                      <input
                        type="range"
                        min="0.70"
                        max="1.05"
                        step="0.02"
                        value={userProfile.voiceRate ?? 0.82}
                        onChange={(e) => {
                          saveProfile({
                            ...userProfile,
                            voiceRate: parseFloat(e.target.value)
                          });
                        }}
                        className="flex-1 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500">Mais Rápida</span>
                    </div>
                  </div>

                  {/* Preview Voice Button */}
                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 italic">
                      * O algoritmo adiciona micropausas em vírgulas e pontos para respirar naturalmente.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlayingVoiceTest(true);
                        audioEngine.previewVoice({
                          text: `Olá, ${userProfile.name}. Respire profundamente. Sinta a paz se expandir em todo o seu ser agora.`,
                          voiceId: userProfile.voiceId,
                          rate: userProfile.voiceRate ?? 0.82,
                          pitch: userProfile.voicePitch ?? 1.0,
                          onEnd: () => setIsPlayingVoiceTest(false)
                        });
                        setTimeout(() => setIsPlayingVoiceTest(false), 5500);
                      }}
                      className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      <Volume2 size={13} className={isPlayingVoiceTest ? 'animate-pulse' : ''} />
                      <span>{isPlayingVoiceTest ? 'Ouvindo...' : 'Testar Voz'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Solfeggio soundscape toggle in settings */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-500 uppercase block">Frequência Padrão de Fundo</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: '528hz', title: '528Hz • Paz & Transformação', subtitle: 'Piano e Harmônicos Celestes', isPro: false },
                    { id: '432hz', title: '432Hz • Cura Cósmica', subtitle: 'Ressonância com a Terra', isPro: false },
                    { id: '639hz', title: '639Hz • Amor & Relacionamentos', subtitle: 'Harmonia e Abertura do Coração', isPro: false },
                    { id: '417hz', title: '417Hz • Transmutação & Limpeza', subtitle: 'Dissolução de Traumas e Apego', isPro: false },
                    { id: '852hz', title: '852Hz • Despertar da Intuição', subtitle: 'Retorno à Ordem Espiritual', isPro: true },
                    { id: '963hz', title: '963Hz • Glândula Pineal', subtitle: 'Conexão Superior & Luz Divina', isPro: true },
                    { id: '741hz', title: '741Hz • Limpeza Celular', subtitle: 'Desintoxicação & Desbloqueio', isPro: true },
                    { id: 'florestazen', title: '🌿 Floresta Zen', subtitle: 'Canto Suave de Pássaros & Águas Claras', isPro: false },
                    { id: 'chuvaserena', title: '🌧️ Chuva Serena', subtitle: 'Gotas Relaxantes para Sono Profundo', isPro: false },
                    { id: 'waves', title: '🔔 Sinos & Brisa Tibetana', subtitle: 'Atmosfera de Templo Sagrado', isPro: false },
                    { id: 'none', title: 'Sem Música de Fundo', subtitle: 'Apenas a Voz Canalizada do Protocolo', isPro: false }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (option.isPro && userProfile.plan !== 'pro') {
                          setShowProModal(true);
                          return;
                        }
                        handleSettingsUpdate(option.id as any);
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col gap-0.5 cursor-pointer transition relative ${
                        userProfile.bgMusicType === option.id
                          ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {option.isPro && (
                        <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-bold">
                          {userProfile.plan === 'pro' ? '👑 PRO' : '🔒 VIP'}
                        </span>
                      )}
                      <span className="text-xs font-bold font-mono text-slate-200">{option.title}</span>
                      <span className="text-[10px] opacity-75">{option.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customização do Protocolo */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-emerald-400" />
                  <h3 className="text-sm font-display font-medium text-slate-200">Customização do Protocolo</h3>
                </div>
                
                {/* Foco de Cura */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-500 uppercase block">Foco de Cura (Intenção Direcionada)</span>
                  <p className="text-[10px] text-slate-400">Selecione as intenções que deseja reforçar durante as sessões do protocolo.</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Ansiedade', 'Autoconfiança', 'Perdão', 'Prosperidade', 'Sono Profundo', 'Disposição'].map(focus => {
                      const isSelected = (userProfile.healingFocuses || []).includes(focus);
                      return (
                        <button
                          key={focus}
                          onClick={() => {
                            const current = userProfile.healingFocuses || [];
                            const updated = isSelected
                              ? current.filter(f => f !== focus)
                              : [...current, focus];
                            saveProfile({ ...userProfile, healingFocuses: updated });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                              : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          {focus}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duração das Pausas */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono text-slate-500 uppercase block">Duração das Pausas Silenciosas</span>
                  <p className="text-[10px] text-slate-400">Ajuste o tempo de silêncio (em segundos) entre as etapas guiadas de cada sessão para reflexão e absorção.</p>
                  <div className="flex items-center gap-2 pt-1">
                    {[0, 5, 10, 15, 20, 30].map(duration => {
                      const currentPause = userProfile.pauseDuration ?? 5; // default 5 seconds
                      return (
                        <button
                          key={duration}
                          onClick={() => saveProfile({ ...userProfile, pauseDuration: duration })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer border ${
                            currentPause === duration
                              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                              : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          {duration}s
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Play/Pause and Volume control inside Settings */}
              {userProfile.bgMusicType !== 'none' && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-slate-500 uppercase block">Música de Fundo Global</span>
                      <p className="text-xs text-slate-400">Ative ou pause a reprodução contínua da trilha de cura.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        saveProfile({
                          ...userProfile,
                          audioEnabled: !userProfile.audioEnabled
                        });
                      }}
                      className={`px-4 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${
                        userProfile.audioEnabled
                          ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {userProfile.audioEnabled ? 'Ativada (Tocando)' : 'Pausada'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-slate-500 uppercase">Volume da Música de Fundo</span>
                      <span className="text-indigo-400 font-mono font-semibold">{Math.round((userProfile.bgMusicVolume ?? 0.5) * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <VolumeX size={15} className="text-slate-500" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={userProfile.bgMusicVolume ?? 0.5}
                        onChange={(e) => {
                          saveProfile({
                            ...userProfile,
                            bgMusicVolume: parseFloat(e.target.value)
                          });
                        }}
                        className="flex-1 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none border border-slate-850"
                      />
                      <Volume2 size={15} className="text-indigo-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Idioma do Aplicativo e Áudios */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-display font-medium text-slate-200 flex items-center gap-1.5">
                      <Globe size={15} className="text-indigo-400" />
                      Idioma das Meditações e Tradução
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Selecione o idioma para as meditações guiadas, textos e síntese de voz.
                    </p>
                  </div>
                  <select
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value as AppLanguage)}
                    className="bg-slate-950 border border-slate-800 text-indigo-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold cursor-pointer outline-none focus:border-indigo-500"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-200">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fale Conosco */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-display font-medium text-emerald-400 flex items-center gap-1.5">
                      <MessageCircle size={15} className="text-emerald-400" />
                      Fale Conosco
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tire dúvidas sobre o protocolo ou peça amparo energético com o terapeuta.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/20 shrink-0"
                  >
                    <MessageCircle size={14} />
                    <span>Fale Conosco</span>
                  </button>
                </div>
              </div>

              {/* Tratamentos Específicos Adquiridos */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-display font-medium text-emerald-400">Tratamento Específico Individual (7 Dias / 21 Dias por R$ 59,90)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Canalização energética personalizada de 7 ou 21 dias para sua queixa ou dor física específica.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSpecificTreatmentModal(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition shrink-0"
                  >
                    Solicitar Novo
                  </button>
                </div>

                {userProfile.specificTreatments && userProfile.specificTreatments.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Tratamentos Registrados:</span>
                    {userProfile.specificTreatments.map((t) => (
                      <div key={t.id} className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-300">{t.category}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(t.requestedAt).toLocaleDateString('pt-BR')} • {t.prescribedFrequency.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] italic">"{t.userCaseDescription}"</p>
                        <div className="pt-1 border-t border-slate-900 flex justify-between items-center text-[10px] text-indigo-300">
                          <span>Decreto: {t.customDecree}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Atalhos Rápidos & Extras em Ajustes */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <span className="text-xs font-mono text-slate-500 uppercase block font-bold">Ferramentas & Acesso Especial</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowAchievementsModal(true);
                    }}
                    className="p-3 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 rounded-xl text-left flex items-center justify-between text-xs text-amber-200 font-semibold cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <Award size={14} className="text-amber-400" />
                      <span>Meus Emblemas & Conquistas</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">Ver Badges</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setSystemicModalDay(currentDay);
                      setShowSystemicQuestionsModal(true);
                    }}
                    className="p-3 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-xl text-left flex items-center justify-between text-xs text-emerald-200 font-semibold cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <Heart size={14} className="text-emerald-400" />
                      <span>Perguntas Sistêmicas (21 Dias)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Ordens do Amor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setDailyDiaryModalDay(currentDay);
                      setShowDailyDiaryModal(true);
                    }}
                    className="p-3 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 rounded-xl text-left flex items-center justify-between text-xs text-indigo-200 font-semibold cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen size={14} className="text-indigo-400" />
                      <span>Diário & O que se espera do Tratamento</span>
                    </span>
                    <Sparkles size={12} className="text-indigo-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowAudioSettingsModal(true);
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-left flex items-center justify-between text-xs text-indigo-300 font-semibold cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <Sliders size={14} className="text-indigo-400" />
                      <span>Ajustes de Áudio & Frequências</span>
                    </span>
                    <Sparkles size={12} className="text-indigo-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowArchangelModal(true);
                    }}
                    className="p-3 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 rounded-xl text-left flex items-center justify-between text-xs text-blue-200 font-semibold cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={14} className="text-blue-400" />
                      <span>Oração do Arcanjo Miguel (21d)</span>
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">100% Grátis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowCoursesModal(true);
                    }}
                    className="p-3 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 rounded-xl text-left flex items-center justify-between text-xs text-purple-200 font-semibold cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <Award size={14} className="text-purple-400" />
                      <span>Cursos & Formações Energéticas</span>
                    </span>
                    <Sparkles size={12} className="text-amber-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowAdminModal(true);
                    }}
                    className="p-3 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 rounded-xl text-left flex items-center justify-between text-xs text-amber-200 font-semibold cursor-pointer transition"
                  >
                    <span className="flex items-center gap-2">
                      <Crown size={14} className="text-amber-400" />
                      <span>Painel do Terapeuta / Admin</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">Login Admin</span>
                  </button>
                </div>
              </div>

              {/* Botão Sair da Conta */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-display font-medium text-slate-200 flex items-center gap-1.5">
                      <LogOut size={15} className="text-rose-400" />
                      Encerrar Sessão
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Desconecte sua conta com segurança para trocar de usuário ou entrar mais tarde.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Sair da Conta
                  </button>
                </div>
              </div>

              {/* Reset Database Trigger */}
              <div className="pt-6 border-t border-slate-950 space-y-3">
                <h3 className="text-sm font-display font-medium text-rose-400">Zona de Perigo</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Se você deseja reiniciar o ciclo completo de cura de 21 dias do zero, eliminando o diário de bordo e a contagem de dias ativos, clique no botão abaixo.
                </p>
                <button
                  onClick={handleResetProgram}
                  className="bg-rose-950/40 hover:bg-rose-950 border border-rose-900/50 hover:border-rose-500 text-rose-300 text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Reiniciar Todo o Protocolo (21 Dias)
                </button>
              </div>
            </div>
          </div>
        ) : isJournalOpen ? (
          /* Journal listing view */
          <JournalLog
            progress={progress}
            onClose={() => setIsJournalOpen(false)}
          />
        ) : (
          /* Default Dashboard Grid */
          <TrackerGrid
            progress={progress}
            currentDay={currentDay}
            streak={userProfile.currentStreak}
            longestStreak={userProfile.longestStreak}
            userName={userProfile.name}
            userPlan={userProfile.plan}
            subscriptionPlan={userProfile.subscriptionPlan}
            anamnesis={userProfile.anamnesis}
            specificTreatments={userProfile.specificTreatments}
            selectedJourney={userProfile.selectedJourney || '21d'}
            onSelectJourney={(journey) => {
              saveProfile({
                ...userProfile,
                selectedJourney: journey
              });
            }}
            onSelectDay={(dayNum) => setSelectedDayDetail(dayNum)}
            onStartSession={(dayNum) => setActiveSessionDay(dayNum)}
            onOpenJournal={() => setIsJournalOpen(true)}
            onOpenAnamnesis={() => setShowAnamnesisModal(true)}
            onOpenAstralMap={() => setShowAstralMapModal(true)}
            onOpenNumerology={() => setShowNumerologyModal(true)}
            onOpenProModal={() => setShowProModal(true)}
            onOpenSpecificTreatment={() => setShowSpecificTreatmentModal(true)}
            onOpenChakrasGuide={() => setShowChakrasModal(true)}
            onOpenHerbalBaths={() => setShowHerbalBathsModal(true)}
            onOpenPlansValuesGuide={() => setShowPlansGuideModal(true)}
            onOpenArchangelPrayer={() => setShowArchangelModal(true)}
            onOpenHooponopono={() => setShowHooponoponoModal(true)}
            onOpenCourses={() => setShowCoursesModal(true)}
            onOpenAudioSettings={() => setShowAudioSettingsModal(true)}
            onOpenAdminPanel={() => setShowAdminModal(true)}
            onOpenWelcome={() => setShowWelcomeModal(true)}
            onOpenAchievements={() => setShowAchievementsModal(true)}
            onOpenSystemicQuestions={(day) => {
              setSystemicModalDay(day || currentDay);
              setShowSystemicQuestionsModal(true);
            }}
            onOpenDailyDiary={(day) => {
              setDailyDiaryModalDay(day || currentDay);
              setShowDailyDiaryModal(true);
            }}
            onOpenContact={() => setShowContactModal(true)}
            onOpenPromoVideo={() => setShowPromoVideoModal(true)}
            astralMap={userProfile.astralMap || (userProfile.birthDate ? calculateAstralMap(userProfile.birthDate, userProfile.birthTime, userProfile.birthCity) : undefined)}
          />
        )}
      </main>

      {/* Bottom Floating Action Dock (Always neatly accessible, prevents header overflow) */}
      <aside className="fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none" id="bottom-action-dock">
        <div className="max-w-5xl mx-auto bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-2 shadow-2xl shadow-slate-950/80 pointer-events-auto flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          
          {/* Vídeo Apresentação do App */}
          <button
            onClick={() => setShowPromoVideoModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-gradient-to-r from-amber-500/20 to-indigo-950/60 hover:from-amber-500/30 border border-amber-500/40 text-amber-200 shadow-sm"
            title="Assistir Vídeo de Apresentação e Propaganda do Protocolo"
            id="bottom-btn-promo-video"
          >
            <Play size={14} fill="currentColor" className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Apresentação</span>
            <span className="sm:hidden">Vídeo</span>
          </button>

          {/* Conquistas / Emblemas */}
          <button
            onClick={() => setShowAchievementsModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-amber-950/60 hover:bg-amber-900/70 border border-amber-500/40 text-amber-200 shadow-sm"
            title="Ver Emblemas e Conquistas de Meditação"
            id="bottom-btn-achievements"
          >
            <Award size={14} className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Emblemas</span>
            <span className="sm:hidden">Badges</span>
          </button>

          {/* Perguntas Sistêmicas */}
          <button
            onClick={() => {
              setSystemicModalDay(currentDay);
              setShowSystemicQuestionsModal(true);
            }}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 shadow-sm"
            title="Perguntas Sistêmicas do Dia (Ordens do Amor)"
            id="bottom-btn-systemic"
          >
            <Heart size={14} className="text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Sistêmica</span>
            <span className="sm:hidden">Sistêmica</span>
          </button>

          {/* Oração Arcanjo Miguel */}
          <button
            onClick={() => setShowArchangelModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-blue-950/60 hover:bg-blue-900/70 border border-blue-500/40 text-blue-200 shadow-sm"
            title="Oração de 21 Dias do Arcanjo Miguel (100% Grátis)"
            id="bottom-btn-archangel"
          >
            <Sparkles size={14} className="text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Arcanjo Miguel</span>
            <span className="sm:hidden">Miguel</span>
          </button>

          {/* Oração Sagrada Ho'oponopono */}
          <button
            onClick={() => setShowHooponoponoModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-teal-950/60 hover:bg-teal-900/70 border border-teal-500/40 text-teal-200 shadow-sm"
            title="Oração Sagrada Ho'oponopono & Japamala 108x (100% Grátis)"
            id="bottom-btn-hooponopono"
          >
            <Heart size={14} className="text-teal-400 shrink-0" />
            <span className="hidden sm:inline">Ho'oponopono</span>
            <span className="sm:hidden">Ho'oponopono</span>
          </button>

          {/* Mapa Astral */}
          <button
            onClick={() => setShowAstralMapModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 shadow-sm"
            title="Ver Meu Mapa Astral & Energético Quântico"
            id="bottom-btn-astral-map"
          >
            <Compass size={14} className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Mapa Astral</span>
            <span className="sm:hidden">Astral</span>
          </button>

          {/* Numerologia Quântica */}
          <button
            onClick={() => setShowNumerologyModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 shadow-sm"
            title="Ver Minha Numerologia Pitagórica & Quântica"
            id="bottom-btn-numerology"
          >
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Numerologia</span>
            <span className="sm:hidden">Números</span>
          </button>

          {/* Tratamento Específico */}
          <button
            onClick={() => setShowSpecificTreatmentModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-gradient-to-r from-emerald-950/90 to-teal-950/90 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/10"
            title="Solicitar Tratamento Específico de 7 ou 21 dias"
            id="bottom-btn-specific-treatment"
          >
            <Heart size={14} className="text-emerald-400 shrink-0" />
            <span className="font-sans font-bold">Tratamento</span>
            <span className="hidden sm:inline font-mono text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">7d/21d</span>
          </button>

          {/* Cursos Energéticos */}
          <button
            onClick={() => setShowCoursesModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 shadow-sm"
            title="Cursos e Sabedorias Energéticas com Éverton Piceni"
            id="bottom-btn-courses"
          >
            <Award size={14} className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Cursos</span>
            <span className="sm:hidden">Cursos</span>
          </button>

          {/* Guia dos 7 Chakras */}
          <button
            onClick={() => setShowChakrasModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 text-indigo-300 shadow-sm"
            title="Abrir Guia Completo dos 7 Chakras e Centros Energéticos"
            id="bottom-btn-chakras"
          >
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span>7 Chakras</span>
          </button>

          {/* Guia Sagrado de Banhos de Ervas */}
          <button
            onClick={() => setShowHerbalBathsModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 shadow-sm"
            title="Guia Sagrado de Banhos de Ervas Medicinais e Energéticas"
            id="bottom-btn-herbal-baths"
          >
            <Leaf size={14} className="text-emerald-400 shrink-0" />
            <span>Banhos 🌿</span>
          </button>

          {/* Guia de Valores e Planos */}
          <button
            onClick={() => setShowPlansGuideModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/40 text-amber-300 shadow-sm"
            title="Ver Opções de Valores e O que Cada Um Compreende"
            id="bottom-btn-values-guide"
          >
            <Crown size={14} className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Valores</span>
            <span className="sm:hidden">Valores</span>
          </button>

          {/* Diário de Bordo */}
          <button
            onClick={() => setIsJournalOpen(!isJournalOpen)}
            className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
              isJournalOpen
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            id="bottom-btn-journal"
            title="Diário de Bordo e Anotações Quânticas"
          >
            <BookOpen size={14} className="shrink-0" />
            <span>Diário</span>
          </button>

          {/* Ajustar Som */}
          <button
            onClick={() => setShowAudioSettingsModal(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border bg-slate-900/90 border-slate-800 text-indigo-300 hover:text-white hover:border-indigo-500/50 shrink-0"
            id="bottom-btn-audio"
            title="Ajuste do Som e Voz"
          >
            <Sliders size={14} className="text-indigo-400 shrink-0" />
            <span className="hidden sm:inline">Som</span>
          </button>

          {/* Sair */}
          <button
            onClick={handleLogout}
            className="px-2 sm:px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer border bg-slate-900/90 border-slate-800 text-rose-400 hover:bg-rose-950/30 hover:border-rose-900/50 shrink-0"
            id="bottom-btn-logout"
            title="Sair da conta"
          >
            <LogOut size={14} className="shrink-0" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </aside>

      {/* Footer Branding credits */}
      <footer className="border-t border-slate-900 py-6 px-4 pb-20 bg-slate-950 relative z-20 text-center" id="main-footer">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-sm sm:text-left">
            O Protocolo de Cura Integrada de 21 dias é canalizado energeticamente por <strong>Éverton Rodrigo Piceni</strong> para purificação física, mental e áurica.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-slate-500 hover:text-amber-400 transition cursor-pointer underline text-[11px]"
            >
              Área do Terapeuta / Admin
            </button>
            <span>•</span>
            <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
              Eu Sou Livre • Eu Sou Cura • Eu Estou em Paz
            </span>
          </div>
        </div>
      </footer>

      {/* 21-Day Detail Modal Overlays */}
      {selectedDayDetail !== null && selectedInsight && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" id="day-detail-modal">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded uppercase">
                  Dia {selectedDayDetail.toString().padStart(2, '0')}
                </span>
                <h3 className="text-sm font-display font-medium text-slate-200 uppercase">
                  Foco Espiritual
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="p-1.5 bg-slate-950 border border-slate-850 text-slate-500 hover:text-slate-300 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Daily insight content */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-medium text-slate-100">
                {selectedInsight.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {selectedInsight.description}
              </p>

              {/* Motivational Quote for the selected day */}
              {selectedInsight.quote && (
                <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/30 border border-indigo-500/30 p-4 rounded-xl space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-mono text-indigo-400 tracking-wider uppercase flex items-center gap-1.5 font-bold">
                    <Sparkles size={11} className="shrink-0" />
                    Frase Motivacional do Dia:
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 italic font-serif leading-relaxed">
                    "{selectedInsight.quote}"
                  </p>
                  <p className="text-[11px] text-indigo-300/80 font-mono font-medium">
                    — {selectedInsight.quoteAuthor || 'Éverton Rodrigo Piceni'}
                  </p>
                </div>
              )}

              {/* Anchor daily focus */}
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono text-indigo-400 tracking-wider uppercase block">
                  Recomendação de Prática:
                </span>
                <p className="text-xs text-slate-300 leading-normal">
                  {selectedInsight.focus}
                </p>
              </div>

              {/* Completed state metrics */}
              {selectedProgress?.completed ? (
                <div className="border-t border-slate-850/60 pt-4 space-y-3.5" id="detail-completed-log">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">SESSÃO REALIZADA</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Smile size={12} />
                      Estado: {getMoodLabel(selectedProgress.mood)}
                    </span>
                  </div>

                  {/* Before vs After comparison in Day details */}
                  {selectedProgress.beforeFeeling ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-850">
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">1. Antes do Tratamento:</span>
                        <p className="text-slate-300 font-medium text-xs">
                          {selectedProgress.beforeFeeling.stateTitle || getMoodLabel(selectedProgress.beforeFeeling.mood)} (Nota {selectedProgress.beforeFeeling.mood}/5)
                        </p>
                        {selectedProgress.beforeFeeling.notes && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-850">
                            "{selectedProgress.beforeFeeling.notes}"
                          </p>
                        )}
                      </div>
                      <div className="space-y-1 text-xs border-t sm:border-t-0 sm:border-l border-slate-850 pt-2 sm:pt-0 sm:pl-2.5">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase block">2. Após o Tratamento:</span>
                        <p className="text-emerald-300 font-medium text-xs">
                          {selectedProgress.afterFeeling?.stateTitle || getMoodLabel(selectedProgress.mood)} (Nota {selectedProgress.afterFeeling?.mood || selectedProgress.mood || 5}/5)
                        </p>
                        <p className="text-[11px] text-slate-200 leading-relaxed bg-emerald-950/20 p-2 rounded border border-emerald-500/20">
                          {selectedProgress.afterFeeling?.notes || selectedProgress.journalText || "Sessão concluída e selada no DNA."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Sua anotação diária:</span>
                      <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/80 p-3 rounded-lg border border-slate-850 whitespace-pre-wrap">
                        {selectedProgress.journalText || "Sessão concluída e selada sem anotações adicionais."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t border-slate-850/60 pt-4" id="detail-uncompleted-log">
                  <div className="flex items-center gap-1.5 text-xs text-amber-500/85">
                    <Clock size={14} />
                    <span>Esta sessão está aguardando você hoje.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl transition text-xs cursor-pointer border-none"
              >
                Fechar Detalhes
              </button>
              <button
                onClick={() => {
                  setSelectedDayDetail(null);
                  setActiveSessionDay(selectedDayDetail);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                <Play size={12} fill="currentColor" />
                {selectedProgress?.completed ? "Refazer Sessão" : "Iniciar Sessão"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pro Upgrade VIP Modal */}
      {showProModal && (
        <ProUpgradeModal
          isOpen={showProModal}
          onClose={() => setShowProModal(false)}
          userProfile={userProfile}
          onUpgradeSuccess={(plan) => {
            const upgradedProfile: UserProfile = {
              ...userProfile,
              plan: 'pro',
              subscriptionPlan: plan,
              proActiveSince: new Date().toISOString()
            };
            saveProfile(upgradedProfile);
            setShowProModal(false);
            setShowCertificateModal(true);
          }}
          onOpenContact={() => {
            setShowProModal(false);
            setShowContactModal(true);
          }}
        />
      )}

      {/* Pro Certificate & Quantum Alignment Report Modal */}
      {showCertificateModal && (
        <ProReportCertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          userProfile={userProfile}
          progress={progress}
        />
      )}

      {/* Holistic Anamnesis & Diagnosis Assessment Modal */}
      {showAnamnesisModal && userProfile && (
        <AnamnesisModal
          isOpen={showAnamnesisModal}
          onClose={() => setShowAnamnesisModal(false)}
          userProfile={userProfile}
          onSaveAnamnesis={handleSaveAnamnesis}
          onOpenSpecificTreatment={(_category) => {
            setShowAnamnesisModal(false);
            setShowSpecificTreatmentModal(true);
          }}
          onOpenContact={() => setShowContactModal(true)}
          onApplyFrequency={(freq) => {
            if (freq && userProfile) {
              saveProfile({
                ...userProfile,
                bgMusicType: freq,
                audioEnabled: true
              });
            }
          }}
        />
      )}

      {/* Specific Individualized Treatment Modal (R$ 70,00) */}
      {showSpecificTreatmentModal && userProfile && (
        <SpecificTreatmentModal
          isOpen={showSpecificTreatmentModal}
          onClose={() => setShowSpecificTreatmentModal(false)}
          userProfile={userProfile}
          onConfirmTreatment={handleConfirmSpecificTreatment}
        />
      )}

      {/* 7 Chakras & Energy Centers Complete Spiritual Guide Modal */}
      {showChakrasModal && (
        <ChakrasGuideModal
          isOpen={showChakrasModal}
          onClose={() => setShowChakrasModal(false)}
          onOpenProModal={() => {
            setShowChakrasModal(false);
            setShowProModal(true);
          }}
        />
      )}

      {/* Detailed Values & All Subscription Plans Guide Modal */}
      {showPlansGuideModal && (
        <PlansValuesGuideModal
          isOpen={showPlansGuideModal}
          onClose={() => setShowPlansGuideModal(false)}
          onOpenProModal={() => {
            setShowPlansGuideModal(false);
            setShowProModal(true);
          }}
          onOpenSpecificTreatment={() => {
            setShowPlansGuideModal(false);
            setShowSpecificTreatmentModal(true);
          }}
        />
      )}

      {/* Astral Map & Energetic Quantum Balance Modal */}
      {showAstralMapModal && userProfile && (
        <AstralMapModal
          isOpen={showAstralMapModal}
          onClose={() => setShowAstralMapModal(false)}
          userProfile={userProfile}
          onSaveProfile={saveProfile}
          onOpenProModal={() => {
            setShowAstralMapModal(false);
            setShowProModal(true);
          }}
        />
      )}

      {/* Numerologia Quântica & Pitagórica Modal */}
      {showNumerologyModal && userProfile && (
        <NumerologyModal
          isOpen={showNumerologyModal}
          onClose={() => setShowNumerologyModal(false)}
          userProfile={userProfile}
          onSaveProfile={saveProfile}
          onOpenProModal={() => {
            setShowNumerologyModal(false);
            setShowProModal(true);
          }}
          onOpenContact={() => {
            setShowNumerologyModal(false);
            setShowContactModal(true);
          }}
        />
      )}

      {/* Google Play / Android PWA Installation Modal */}
      {showMobileInstallModal && (
        <MobileInstallModal
          onClose={() => setShowMobileInstallModal(false)}
          deferredPrompt={deferredInstallPrompt}
        />
      )}

      {/* Onboarding Flow Substitution */}
      {showWelcomeModal && userProfile && (
        <OnboardingFlow
          onComplete={() => {
            localStorage.setItem('cura_integrada_welcome_seen_v1', 'true');
            setShowWelcomeModal(false);
          }}
        />
      )}

      {/* Oração de 21 Dias do Arcanjo Miguel (100% Grátis) */}
      {showArchangelModal && (
        <ArchangelMichaelPrayerModal
          isOpen={showArchangelModal}
          onClose={() => setShowArchangelModal(false)}
          userName={userProfile?.name}
        />
      )}

      {/* Guia Sagrado de Banhos de Ervas */}
      {showHerbalBathsModal && (
        <HerbalBathsModal
          isOpen={showHerbalBathsModal}
          onClose={() => setShowHerbalBathsModal(false)}
          userName={userProfile?.name}
        />
      )}

      {/* Oração Sagrada Ho'oponopono & Japamala 108x (100% Grátis) */}
      {showHooponoponoModal && (
        <HooponoponoModal
          isOpen={showHooponoponoModal}
          onClose={() => setShowHooponoponoModal(false)}
          userName={userProfile?.name}
          userProfile={userProfile || undefined}
        />
      )}

      {/* Ajustes Avançados de Áudio e Voz */}
      {showAudioSettingsModal && userProfile && (
        <AudioSettingsModal
          isOpen={showAudioSettingsModal}
          onClose={() => setShowAudioSettingsModal(false)}
          userProfile={userProfile}
          onSaveProfile={saveProfile}
          availableVoices={availableVoices}
          onOpenProModal={() => {
            setShowAudioSettingsModal(false);
            setShowProModal(true);
          }}
        />
      )}

      {/* Cursos & Formações Energéticas */}
      {showCoursesModal && (
        <CoursesModal
          isOpen={showCoursesModal}
          onClose={() => setShowCoursesModal(false)}
          userProfile={userProfile || undefined}
        />
      )}

      {/* Painel do Administrador & Terapeuta Éverton Piceni */}
      {showAdminModal && (
        <AdminPanelModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {/* Achievements & Emblems Modal */}
      {showAchievementsModal && userProfile && (
        <AchievementsModal
          isOpen={showAchievementsModal}
          onClose={() => setShowAchievementsModal(false)}
          userProfile={userProfile}
          progress={progress}
        />
      )}

      {/* 21-Day Systemic Questions (Ordens do Amor) Modal */}
      {showSystemicQuestionsModal && (
        <SystemicQuestionsModal
          isOpen={showSystemicQuestionsModal}
          onClose={() => setShowSystemicQuestionsModal(false)}
          currentDay={systemicModalDay}
          progress={progress}
          userName={userProfile?.name}
          onSaveAnswer={handleSaveSystemicAnswer}
        />
      )}

      {/* Daily Diary & Treatment Expectations Modal */}
      {showDailyDiaryModal && userProfile && (
        <DailyDiaryModal
          isOpen={showDailyDiaryModal}
          onClose={() => setShowDailyDiaryModal(false)}
          currentDay={dailyDiaryModalDay}
          progress={progress}
          userProfile={userProfile}
          onSaveEntry={handleSaveDiaryDay}
          onSaveExpectations={handleSaveTreatmentExpectations}
        />
      )}

      {/* Floating Fale Conosco Button */}
      <button
        type="button"
        onClick={() => setShowContactModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2 group transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-300/40"
        title="Fale Conosco"
        id="floating-whatsapp-btn"
      >
        <MessageCircle size={22} className="fill-slate-950 text-slate-950" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold text-slate-950">
          Fale Conosco
        </span>
      </button>

      {/* Centralized Fale Conosco Modal */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          userProfile={userProfile || undefined}
        />
      )}

      {/* Vídeo Apresentação & Propaganda do Protocolo */}
      {showPromoVideoModal && (
        <PromoVideoModal
          isOpen={showPromoVideoModal}
          onClose={() => setShowPromoVideoModal(false)}
          onOpenProModal={() => {
            setShowPromoVideoModal(false);
            setShowProModal(true);
          }}
          onOpenContact={() => {
            setShowPromoVideoModal(false);
            setShowContactModal(true);
          }}
        />
      )}

      {/* Celebração de Marcos Sagrados (Dias 8, 15 e 21 - Régua de Comunicação) */}
      {showMilestoneModal && userProfile && (
        <MilestoneCelebrationModal
          isOpen={showMilestoneModal}
          onClose={() => setShowMilestoneModal(false)}
          dayNumber={milestoneModalDay}
          userProfile={userProfile}
          onOpenCertificate={() => setShowCertificateModal(true)}
        />
      )}

      {/* Notificação / Toast Diário em Tempo Real */}
      {inAppToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-amber-500/50 shadow-2xl animate-fade-in flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold text-slate-100">{inAppToast.title}</h4>
            <p className="text-[11px] text-slate-300 leading-snug">{inAppToast.body}</p>
          </div>
          <button
            onClick={() => setInAppToast(null)}
            className="text-slate-400 hover:text-slate-200 text-xs p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}
        </div>
      )}
    </>
  );
}
