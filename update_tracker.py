with open('src/components/TrackerGrid.tsx', 'r') as f:
    content = f.read()

import re

# Find the grid section
start_pattern = r'\{\/\* Grid Header \*\/\}.*?id="calendar-days-grid">'
end_pattern = r'\}\)\}\n\s*<\/div>\n\s*<\/div>\n\s*\);\n\}'

match = re.search(start_pattern + r'(.*?)' + end_pattern, content, re.DOTALL)
if match:
    print("Found section to replace")
else:
    print("Could not find section")
