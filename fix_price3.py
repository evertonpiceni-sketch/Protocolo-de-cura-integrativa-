import re

with open('src/components/SpecificTreatmentModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("7 === 21 ? '99,90' : '59,90'", "'59,90'")
content = content.replace("7 === 21 ? \\'99,90\\' : \\'59,90\\'", "'59,90'")
content = content.replace("const [customPriceInput, setCustomPriceInput] = useState<string>('59,90');", "const [customPriceInput, setCustomPriceInput] = useState<string>('99,90');")

with open('src/components/SpecificTreatmentModal.tsx', 'w') as f:
    f.write(content)
