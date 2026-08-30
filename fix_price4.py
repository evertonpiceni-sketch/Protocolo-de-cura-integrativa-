import re

with open('src/components/SpecificTreatmentModal.tsx', 'r') as f:
    content = f.read()

# Make sure durationDays buttons update the custom price string accordingly
content = re.sub(
    r'onClick=\{\(\) => \{\n\s*setDurationDays\(21\);\n\s*if \(\!isCustomPrice\) \{\n\s*setCustomPriceInput\([^)]*\);\s*(//.*)?\n\s*\}\n\s*\}\}',
    """onClick={() => {
                    setDurationDays(21);
                    if (!isCustomPrice) {
                      setCustomPriceInput('99,90');
                    }
                  }}""",
    content
)

content = re.sub(
    r'onClick=\{\(\) => \{\n\s*setDurationDays\(7\);\n\s*if \(\!isCustomPrice\) \{\n\s*setCustomPriceInput\([^)]*\);\s*(//.*)?\n\s*\}\n\s*\}\}',
    """onClick={() => {
                    setDurationDays(7);
                    if (!isCustomPrice) {
                      setCustomPriceInput('59,90');
                    }
                  }}""",
    content
)

with open('src/components/SpecificTreatmentModal.tsx', 'w') as f:
    f.write(content)
