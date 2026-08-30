import re

with open('src/components/ProUpgradeModal.tsx', 'r') as f:
    content = f.read()

new_plan = """{
    id: 'arcanjo_7d',
    title: 'Protocolo São Miguel, Rafael e Chama Violeta',
    badge: '7 Chakras Divinos',
    badgeColor: 'bg-violet-500 text-white font-bold',
    priceFormatted: 'R$ 29,90',
    priceNumber: 29.90,
    periodText: 'acesso 7 dias',
    description: 'Protocolo de Cura Arcanjo São Miguel, Raio de Ouro de São Rafael e Chama Violeta.',
    compreende: [
      'Alinhamento exato de 1 Chakra por dia (Cores, Nomes e Frequências)',
      'Limpeza com Raio de Ouro de São Rafael',
      'Transmutação profunda com a Chama Violeta',
      'Proteção Divina de São Miguel Arcanjo'
    ]
  },
  {"""

content = content.replace("  {", new_plan, 1)

with open('src/components/ProUpgradeModal.tsx', 'w') as f:
    f.write(content)
