with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import SimpleProtocol from './components/SimpleProtocol';\n"
if "SimpleProtocol" not in content:
    content = content.replace("import { localNotificationManager", import_stmt + "import { localNotificationManager")

# Add state
state_stmt = "  const [showSimpleProtocol, setShowSimpleProtocol] = useState(false);\n"
if "showSimpleProtocol" not in content:
    content = content.replace("  const [activeSessionDay, setActiveSessionDay] = useState<number | null>(null);", state_stmt + "  const [activeSessionDay, setActiveSessionDay] = useState<number | null>(null);")

# Add button
btn_code = """
            <button
              onClick={() => setShowSimpleProtocol(true)}
              className="mt-4 w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium py-3 rounded-2xl transition flex items-center justify-center gap-2"
            >
              <Headphones size={18} className="text-indigo-400" />
              Modo Simples (Player Clássico)
            </button>
"""
if "Modo Simples (Player Clássico)" not in content:
    content = content.replace("          {/* Secondary Action - Specific Treatment */}", btn_code + "\n          {/* Secondary Action - Specific Treatment */}")

# Add component render
render_code = """
      <AnimatePresence>
        {showSimpleProtocol && (
          <SimpleProtocol onClose={() => setShowSimpleProtocol(false)} />
        )}
      </AnimatePresence>
"""
if "showSimpleProtocol &&" not in content:
    content = content.replace("      {activeSessionDay !== null ? (", render_code + "\n      {activeSessionDay !== null ? (")

with open('src/App.tsx', 'w') as f:
    f.write(content)
