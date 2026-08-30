import re

with open('src/components/SpecificTreatmentModal.tsx', 'r') as f:
    content = f.read()

# Replace prices
content = content.replace("const standardPrice = durationDays === 21 ? 59.9 : (durationDays === 7 ? 59.9 : 20.0);", "const standardPrice = durationDays === 21 ? 99.9 : (durationDays === 7 ? 59.9 : 20.0);")
content = content.replace("Tratamento Completo R$ 59,90", "Tratamento Completo R$ 99,90")
content = content.replace("setCustomPriceInput('59,90')", "setCustomPriceInput(durationDays === 21 ? '99,90' : '59,90')")
content = content.replace("<span className=\"text-xs font-mono font-bold text-amber-300\">R$ 59,90</span>", "<span className=\"text-xs font-mono font-bold text-amber-300\">R$ 99,90</span>")
content = content.replace("{'R$ 59,90'}", "{durationDays === 21 ? 'R$ 99,90' : 'R$ 59,90'}")

# Fix multiple mapping
content = content.replace("['30,00', '50,00', '59,90', '70,00', '150,00']", "['30,00', '59,90', '99,90', '150,00']")

with open('src/components/SpecificTreatmentModal.tsx', 'w') as f:
    f.write(content)
