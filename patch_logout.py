import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_logout = """  const handleLogout = async () => {
    audioEngine.stopBG();
    await fetch('/api/auth/logout', { method: 'POST' });
    setUserProfile(null);
    setProgress([]);
    setCurrentDay(1);
    setIsJournalOpen(false);
    setSelectedDayDetail(null);
    setShowSettings(false);
    setIsLoggedIn(false);
  };"""

content = re.sub(r'  const handleLogout = \(\) => \{.*?\n  \};', new_logout, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
