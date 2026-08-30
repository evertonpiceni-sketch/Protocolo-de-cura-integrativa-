import re

with open('src/components/ProfileSetup.tsx', 'r') as f:
    content = f.read()
content = content.replace("acc.subscriptionPlan ===", "acc.profile.subscriptionPlan ===")
with open('src/components/ProfileSetup.tsx', 'w') as f:
    f.write(content)

with open('src/components/ProUpgradeModal.tsx', 'r') as f:
    content = f.read()
content = content.replace("acc.subscriptionPlan ===", "acc.profile.subscriptionPlan ===")
with open('src/components/ProUpgradeModal.tsx', 'w') as f:
    f.write(content)
