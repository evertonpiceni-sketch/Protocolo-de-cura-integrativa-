import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import DashboardCura from './components/DashboardCura';\n"
if "import DashboardCura" not in content:
    content = re.sub(r"(import .*? from '\.\/components\/MilestoneCelebrationModal';)", r"\1\n" + import_stmt, content)

# Add state
state_stmt = "  const [showDashboardCura, setShowDashboardCura] = useState<boolean>(false);\n"
if "setShowDashboardCura" not in content:
    content = re.sub(r"(const \[showMilestoneModal, setShowMilestoneModal\] = useState<boolean>\(false\);)", r"\1\n" + state_stmt, content)

# Add modal rendering
modal_rendering = """
      {/* Dashboard Analítico */}
      {showDashboardCura && (
        <DashboardCura onClose={() => setShowDashboardCura(false)} />
      )}
"""
if "DashboardCura onClose" not in content:
    content = re.sub(r"(\{/\* Notificação / Toast Diário em Tempo Real \*/\})", modal_rendering + r"\n      \1", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
