# Auditoria — Estilo 1: Natural Sereno
**Data:** 07/11/2026  
**Base auditada:** `main` em `dfd9f0b3555df186866ba171c9848e6d558efebd`  
**Branch de correção:** `fix/natural-sereno-visual-audit-2026-11-07`

## Corrigido
- Acrescentada uma camada final, restrita a `data-layout="natural-sereno"`, para retirar verde-floresta residual dos ícones de Mapa Astral/Numerologia, filtro ativo de Banhos, abas ativas de Ho'oponopono/Instalação/Conquistas e ações do painel administrativo. As superfícies passam a usar creme/marfim e dourado refinado; os demais estilos não são afetados.
- Mantida a paisagem realista da Home. A camada responsiva existente conserva `cover` e enquadramentos distintos: desktop a 52% e mobile a 54%, com alturas fluidas por viewport.
- Adicionado `tests/natural-sereno-audit.test.ts` para proteger seletor, referência visual, responsividade, assinatura do logo, Diário, política de voz/Solfeggio, animação e checkout.

## Preservado
- O seletor React continua sendo o único seletor oficial. A escolha começa sem opção pré-selecionada, exige confirmação e o tema só é aplicado depois da confirmação. As quatro opções permanecem disponíveis.
- A prévia Natural Sereno continua apontando para a prancha arquivada em `docs/visual-qa/natural-sereno/reference.jpg`; nenhuma arte aprovada foi substituída.
- Paleta creme/marfim, café, dourado refinado e verde-sálvia como acento; logo oficial discreto (opacidade de 30%, reduzida no mobile).
- Diário, player, cadência respiratória 4–3–5 e animação de seis etapas com respeito a `prefers-reduced-motion`.
- Solfeggio exato permanece impedido como trilha simultânea à fala do protocolo; a ambiência não tonal continua permitida.
- Fluxos de Numerologia e Prática Específica continuam no checkout InfinitePay, com confirmação de pagamento no servidor. Nenhuma transação real foi iniciada.

## Pendente
- **Voz escolhida:** o fluxo principal exige voz neural no Natural Sereno e não usa síntese do navegador. Ainda não há comprovação do identificador exato da voz escolhida pelo Everton. O preview feminino pré-login em `ProfileSetup.tsx` ainda usa o alias `Rachel` e fallback do navegador; não foi substituído por um ID presumido.
- **Validação visual real:** as regras desktop/mobile foram auditadas no código, mas falta captura de navegador nas duas larguras para homologar recorte, nitidez e alinhamento em cada página.
- **Validação de mídia e pagamento:** falta teste de reprodução real da voz/Solfeggio e teste de checkout em ambiente de teste, sem cobrança real.
- O patch `naturalSerenoHomeApprovedModel.ts` continua carregado por conter lógica de estado da jornada; as regras visuais antigas são neutralizadas pelas folhas aprovadas carregadas depois. Separar lógica e CSS exige uma refatoração própria, não necessária para esta correção pontual.

**Status:** correções visuais pontuais registradas; homologação integral permanece aberta até concluir os testes pendentes.
