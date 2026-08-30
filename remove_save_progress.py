import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the second saveProgress
content = re.sub(r'  // Save progress state whenever it changes\n  const saveProgress = \(newProgress: DayProgress\[\]\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
