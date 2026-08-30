import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if "import ArcanjoProtocolView" not in content:
    content = content.replace("import SystemicQuestionsModal from './components/SystemicQuestionsModal';", "import SystemicQuestionsModal from './components/SystemicQuestionsModal';\nimport ArcanjoProtocolView from './components/ArcanjoProtocolView';")

# Conditionally render main view
replacement = """    <>

      <AnimatePresence>
        {showSimpleProtocol && (
          <SimpleProtocol onClose={() => setShowSimpleProtocol(false)} />
        )}
      </AnimatePresence>
      
      {userProfile.subscriptionPlan === 'arcanjo_7d' ? (
        <ArcanjoProtocolView 
          userProfile={userProfile}
          onLogout={handleLogout}
        />
      ) : activeSessionDay !== null ? ("""

content = re.sub(r'    <>\n\n      <AnimatePresence>\n        \{showSimpleProtocol && \(\n          <SimpleProtocol onClose=\{[^}]+\} />\n        \)\}\n      </AnimatePresence>\n\n      \{activeSessionDay !== null \? \(', replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
