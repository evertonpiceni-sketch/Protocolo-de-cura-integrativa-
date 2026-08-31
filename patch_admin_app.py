import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Update checkAuth
new_checkauth = """  // Initialize and load saved state from backend on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const account = data.user;
          const profileWithAdmin = { ...account.profile, isAdmin: account.role === 'admin' };
          setUserProfile(profileWithAdmin);
          setProgress(account.progress || []);
          
          const nextUncompleted = account.progress?.find((p: any) => !p.completed);
          setCurrentDay(nextUncompleted ? nextUncompleted.dayNumber : 21);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);"""

content = re.sub(r'  // Initialize and load saved state from backend on mount.*?  }, \[\]\);', new_checkauth, content, flags=re.DOTALL)

# Update handleOnboardingComplete
new_onboarding = """  // Profile Onboarding complete (Register or Login complete)
  const handleOnboardingComplete = (account: UserAccount) => {
    const profileWithAdmin = { ...account.profile, isAdmin: account.role === 'admin' };
    setUserProfile(profileWithAdmin);
    setProgress(account.progress || []);
    
    const nextUncompleted = account.progress?.find(p => !p.completed);
    setCurrentDay(nextUncompleted ? nextUncompleted.dayNumber : 21);
    setIsLoggedIn(true);
  };"""

content = re.sub(r'  // Profile Onboarding complete \(Register or Login complete\).*?setIsLoggedIn\(true\);\n  };', new_onboarding, content, flags=re.DOTALL)

# Hide the admin button in sidebar if not admin
new_admin_btn = """              {userProfile?.isAdmin && (
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
                    Acesso Restrito: Terapeuta
                  </span>
                </button>
              )}"""
content = re.sub(r'                  <button\n                    type="button"\n                    onClick=\{\(\) => \{\n                      setShowSettings\(false\);\n                      setShowAdminModal\(true\);\n                    \}\}.*?Acesso Restrito: Terapeuta\n                  </span>\n                </button>', new_admin_btn, content, flags=re.DOTALL)


# Hide the admin footer link if not admin
new_footer_link = """            {userProfile?.isAdmin && (
              <>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="text-slate-500 hover:text-amber-400 transition cursor-pointer underline text-[11px]"
                >
                  Área do Terapeuta / Admin
                </button>
                <span>•</span>
              </>
            )}"""
content = re.sub(r'            <button\n              onClick=\{\(\) => setShowAdminModal\(true\)\}\n              className="text-slate-500 hover:text-amber-400 transition cursor-pointer underline text-\[11px\]"\n            >\n              Área do Terapeuta / Admin\n            </button>\n            <span>•</span>', new_footer_link, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
