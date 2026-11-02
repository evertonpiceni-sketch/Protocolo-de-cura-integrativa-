# Auditoria — Estilo 3 · Essência Luminosa — Run 30

Referência visual oficial: prancha Estilo 3 (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), sempre subordinada às decisões aprovadas posteriores. Aprovado = congelado; reprovado/substituído/não usar = descartado.

## Corrigido / consolidado nesta passagem
- Reauditoria da tela **Instalar no celular**: a estrutura-base já está compatível com a linguagem clara do Estilo 3 (marfim/champagne, ouro suave e sálvia), e o verde `emerald` restante está restrito ao estado semântico de instalação concluída. Não foi feita recoloração desnecessária.
- Confirmado que o botão Google Play do cabeçalho já está neutralizado pela camada final do Essência Luminosa e não deve receber nova sobreposição.
- Mantidas todas as correções anteriores de header/logo, boas-vindas, Diário, Mapa Astral, Numerologia visual, Contato, Apresentação, Prática Individual, barra de ações e canvas global.

## Achado funcional novo — pagamento
A varredura ampliada encontrou uma segunda herança de PIX manual além da Prática Individual: `src/components/NumerologyModal.tsx` ainda define `handleCopyPix()` com `navigator.clipboard.writeText('evertonpiceni@gmail.com')`. O mesmo componente já cria checkout por `/api/payment/create-checkout`, portanto a chave copiada manualmente é fluxo legado e incompatível com a decisão vigente de pagamento pelo checkout InfinitePay.

Também permanece em `src/components/SpecificTreatmentModal.tsx` a herança já comprovada: `handleCopyPix()` copia `evertonpiceni@gmail.com` e é chamado ao selecionar PIX, apesar de o pedido seguir para `/api/payment/create-checkout`.

## Preservado
- Logo oficial discreto/transparente como assinatura, sem protagonismo.
- Essência Luminosa clara, leve e expansiva; sem reintroduzir verdão/amarelão estrutural.
- Estados verdes estritamente semânticos podem permanecer quando comunicam sucesso/conclusão e não definem a identidade visual.
- Confirmação server-side e redirecionamento de checkout existentes não foram alterados.
- Conteúdo terapêutico, preços e demais estilos não foram modificados nesta passagem.

## Pendente comprovado
1. Remover na origem o PIX manual de `SpecificTreatmentModal.tsx`, mantendo PIX apenas como método solicitado ao checkout InfinitePay.
2. Remover na origem o PIX manual de `NumerologyModal.tsx`, pelo mesmo motivo.
3. Corrigir a condição de montagem do seletor dos quatro estilos em `App.tsx` para exigir confirmação explícita antes da aplicação, inclusive quando há preferência persistida.
4. Voz: não substituir por identificador presumido; validar somente o ID oficial aprovado.
5. Solfeggio/player/animações: executar validação desktop/mobile para confirmar interrupção correta do áudio de fundo e ausência de regressões.

## Critério de continuidade
Seguir página por página e corrigir apenas ocorrências comprovadamente incompatíveis. Não aplicar substituição cromática global; distinguir herança estrutural de estados semânticos antes de alterar.