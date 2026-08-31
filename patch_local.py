import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace block in handleUnlockNextDay (approx line 374 to 391)
# Actually, the easiest way is to just call `if (isLoggedIn) { fetch('/api/user/sync', ... ) }`
patch_1 = """    setProgress(updatedProgress);

    // Save to backend
    if (isLoggedIn) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: updatedProfile, progress: updatedProgress })
      }).catch(console.error);
    }"""
content = re.sub(r'    setProgress\(updatedProgress\);\n\n    // Save both updatedProfile and updatedProgress to accounts.*?\n    \}', patch_1, content, flags=re.DOTALL)

patch_2 = """        };
        setUserProfile(updatedProfile);

        // Save to backend
        if (isLoggedIn) {
          fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: updatedProfile, progress: defaultProgress })
          }).catch(console.error);
        }"""
content = re.sub(r'        \};\n        setUserProfile\(updatedProfile\);\n\n        // Update in accounts array.*?\n        \}', patch_2, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
