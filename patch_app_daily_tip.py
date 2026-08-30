import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import DailyTipModal from './components/DailyTipModal';\n"
if "import DailyTipModal" not in content:
    content = re.sub(r"(import .*? from '\.\/components\/MilestoneCelebrationModal';)", r"\1\n" + import_stmt, content)

# Add state
state_stmt = "  const [showDailyTip, setShowDailyTip] = useState<boolean>(false);\n"
if "setShowDailyTip" not in content:
    content = re.sub(r"(const \[showDashboardCura, setShowDashboardCura\] = useState<boolean>\(false\);)", r"\1\n" + state_stmt, content)

# Add logic
logic_patch = """          setUserProfile(profile);
          
          // Check if daily tip was seen today
          const todayStr = new Date().toISOString().split('T')[0];
          const lastTipDate = localStorage.getItem('cura_integrada_last_tip_date');
          if (lastTipDate !== todayStr) {
            setShowDailyTip(true);
            localStorage.setItem('cura_integrada_last_tip_date', todayStr);
          }
"""
content = content.replace("          setUserProfile(profile);", logic_patch)

# Add component rendering
modal_rendering = """
      {/* Daily Tip Modal (Tip of the Day) */}
      {showDailyTip && (
        <DailyTipModal 
          onClose={() => setShowDailyTip(false)} 
          userName={userProfile?.name} 
        />
      )}
"""
content = re.sub(r"(\{/\* Dashboard Analítico \*/\})", modal_rendering + r"\n      \1", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
