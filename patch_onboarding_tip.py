import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

patch = """    // Check if welcome modal was seen
    const seenWelcome = localStorage.getItem('cura_integrada_welcome_seen_v1');
    if (!seenWelcome) {
      setShowWelcomeModal(true);
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastTipDate = localStorage.getItem('cura_integrada_last_tip_date');
      if (lastTipDate !== todayStr) {
        setShowDailyTip(true);
        localStorage.setItem('cura_integrada_last_tip_date', todayStr);
      }
    }"""

content = re.sub(
    r"// Check if welcome modal was seen[\s\S]*?setShowWelcomeModal\(true\);\n    \}",
    patch,
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
