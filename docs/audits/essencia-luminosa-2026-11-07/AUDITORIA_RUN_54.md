# Auditoria — Estilo 3 Essência Luminosa — Run 54

Referência visual oficial: prancha 1001196521.png / file_0000000019d0820eb7a70b6c982619d6. Decisões posteriores aprovadas continuam prevalecendo.

## Corrigido
- MeditationSession agora usa a voz personalizada salva no perfil também no Estilo 3; não força mais a voz oficial quando há um voiceId válido escolhido pelo usuário.
- O player não reinicia frequências Solfeggio como trilha de fundo durante a narração do protocolo. Ondas/ambiência não tonal continuam permitidas.
- A política de áudio foi isolada em protocolSessionAudioPolicy.ts e coberta por testes.
- Corrigidos dois ramos de prévia inalcançáveis em LayoutChoiceModal que causavam erro TypeScript após os retornos antecipados das pranchas oficiais.
- O teste legado de fallback foi alinhado ao comportamento aprovado do player: falha fechada com aviso, sem trocar silenciosamente para Web Speech robótica.
- O comentário do seletor foi corrigido para identificar a prancha como pertencente ao Estilo 3.

## Preservado
- Asset da prancha oficial em public/brand/essencia-luminosa/prancha-oficial.webp, exibido no seletor React com object-contain.
- Quatro estilos e escolha explícita antes da aplicação; preferência salva não equivale a confirmação.
- Paleta marfim #FFFFF8, champagne #F7F3E8, ouro suave #C6A46A e sálvia #A6B49B.
- Logo oficial como assinatura discreta (30% / 26% em telas pequenas).
- Conteúdos, seis etapas, respiração 4/3/5, player, animações, Diário, Anamnese, Numerologia, Mapa Astral, Ho'oponopono, navegação, cursos, banhos, conquistas e Reintegração da Vida.
- Checkout InfinitePay com confirmação server-side; fluxos de cópia manual de chave PIX não foram reintroduzidos.

## Validação executada
- GitHub Actions no commit b2fa36f5d38691b9ca0db1bbec451e847af28502:
  - TypeScript check: aprovado.
  - Testes: 47/47 aprovados.
  - Build Vite + servidor Express: aprovado.
  - Verificações de entrypoints, JWT, registro, pagamentos e smoke test: aprovadas.
- Reauditoria dos arquivos alterados confirmou a voz salva no Estilo 3, bloqueio de Solfeggio durante protocolo, teste da política, seletor com prancha oficial e documentação desta rodada.

## Pendente
- O workflow geral continua vermelho somente na etapa de dependências: npm audit encontrou 9 vulnerabilidades (3 moderadas e 6 altas) em body-parser, ip-address, qs, vite e zod/transitivas. Não alterei versões de dependências nesta auditoria para evitar uma atualização fora do escopo visual/funcional do Estilo 3.
- Comparação visual renderizada página por página em desktop e mobile ainda precisa ser feita; a verificação de código não substitui capturas reais.
- Testar a voz escolhida com conta real/ElevenLabs e transições de áudio em dispositivos.
- Validar checkout e confirmação InfinitePay em sandbox, sem cobrança real.
- Completar a integração de fotografias de natureza reais nas páginas somente com assets aprovados; a prancha no seletor não substitui essa etapa.
