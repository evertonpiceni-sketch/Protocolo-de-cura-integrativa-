import re

with open('src/components/SpecificTreatmentModal.tsx', 'r') as f:
    content = f.read()

# Fix customPriceInput change logic
content = re.sub(
    r'setCustomPriceInput\(durationDays === 21 \? \'99,90\' : \'59,90\'\);',
    r'setCustomPriceInput(7 === 21 ? \'99,90\' : \'59,90\'); // will be handled correctly by effect or manual',
    content
)

content = content.replace("setCustomPriceInput(durationDays === 21 ? '99,90' : '59,90')", "setCustomPriceInput(21 === 21 ? '99,90' : '59,90')")

# Better fix for duration setting:
content = content.replace("""                  onClick={() => {
                    setDurationDays(7);
                    if (!isCustomPrice) {
                      setCustomPriceInput(21 === 21 ? '99,90' : '59,90'); // will be handled correctly by effect or manual
                    }
                  }}""", """                  onClick={() => {
                    setDurationDays(7);
                    if (!isCustomPrice) {
                      setCustomPriceInput('59,90');
                    }
                  }}""")

content = content.replace("""                  onClick={() => {
                    setDurationDays(21);
                    if (!isCustomPrice) {
                      setCustomPriceInput(21 === 21 ? '99,90' : '59,90'); // will be handled correctly by effect or manual
                    }
                  }}""", """                  onClick={() => {
                    setDurationDays(21);
                    if (!isCustomPrice) {
                      setCustomPriceInput('99,90');
                    }
                  }}""")

content = content.replace("""                  onClick={() => {
                    setIsCustomPrice(!isCustomPrice);
                    if (!isCustomPrice) {
                      setCustomPriceInput(21 === 21 ? '99,90' : '59,90'); // will be handled correctly by effect or manual
                    }
                  }}""", """                  onClick={() => {
                    setIsCustomPrice(!isCustomPrice);
                    if (!isCustomPrice) {
                      setCustomPriceInput(durationDays === 21 ? '99,90' : (durationDays === 7 ? '59,90' : '20,00'));
                    }
                  }}""")

with open('src/components/SpecificTreatmentModal.tsx', 'w') as f:
    f.write(content)
