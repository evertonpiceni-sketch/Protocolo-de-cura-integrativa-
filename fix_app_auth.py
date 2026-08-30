import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# I will find the whole useEffect block starting with:
#  // Initialize and load saved state from localStorage on mount
# down to its closing }, []);

new_useeffect = """  // Initialize and load saved state from backend on mount
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
          // Set some default state if not logged in
          const defaultProgress: DayProgress[] = Array.from({ length: 21 }, (_, index) => ({
            dayNumber: index + 1,
            completed: false
          }));
          setProgress(defaultProgress);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);"""

content = re.sub(r'  // Initialize and load saved state from localStorage on mount\n  useEffect\(\(\) => \{.*?\n  \}, \[\]\);', new_useeffect, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
