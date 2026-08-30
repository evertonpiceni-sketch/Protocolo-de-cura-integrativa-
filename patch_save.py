import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_save = """  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    if (isLoggedIn) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: newProfile, progress })
      }).catch(console.error);
    }
  };

  const saveProgress = (newProgress: DayProgress[]) => {
    setProgress(newProgress);
    if (isLoggedIn) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProfile, progress: newProgress })
      }).catch(console.error);
    }
  };"""

content = re.sub(r'  const saveProfile = \(newProfile: UserProfile\) => \{.*?\n  \};', new_save, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
