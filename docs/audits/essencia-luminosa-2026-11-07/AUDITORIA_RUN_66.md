# Auditoria Run 66 — Estilo 3 · Essência Luminosa

**Data:** 7 de novembro de 2026, 12h42 (America/Sao_Paulo)  
**Branch:** `main`  
**Base auditada:** `9cbf2f3ec5f909efea88bc5eb5bd2f35cd55c6d9`  
**Correções:** `d764f9c81b78fe98acd66212c6564ecd52982817`, `e8be1f7fac58c8f44bdcd52eb65ae7fc1653e492`, `ab83b69f57cc5ea8aa0f604e6f82305b91a47ad7`

## Corrigido

- Encontrada uma regressão funcional na página de Configurações: embora o catálogo ElevenLabs já fosse carregado para Elegância Profunda e Essência Luminosa, o seletor de voz e a ação de teste dessa página verificavam somente Elegância Profunda. No Estilo 3, isso expunha vozes do dispositivo e chamava `audioEngine.previewVoice`, permitindo a voz robótica do navegador.
- O seletor e o teste de voz agora usam `usesNeuralVoiceCatalog`, que cobre os Estilos 2 e 3. O teste chama ElevenLabs com `fallbackToSpeechSynthesis: false`; se o ID salvo não for um ID neural válido, informa o problema e não troca silenciosamente para a voz do dispositivo.
- A mensagem de validação agora identifica os dois estilos neurais.
- O botão de teste recebeu um identificador estável e tratamento exclusivo do Estilo 3: gradiente champagne/ouro suave, texto e ícone escuros, foco visível e hover discreto. O índigo legado do componente-base não define mais a aparência desse CTA na Essência Luminosa.
- Acrescentados dois testes de regressão para impedir o retorno da seleção de voz do dispositivo e do CTA índigo nesse fluxo.

## Preservado

- Paleta vigente: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B` e texto escuro de alto contraste.
- Seletor React dos quatro estilos com seleção inicialmente vazia e confirmação explícita antes de definir `data-layout`.
- Card da Essência Luminosa continua usando o ativo versionado `public/brand/essencia-luminosa/prancha-oficial.webp`; nenhum outro estilo foi usado como substituto.
- Logo oficial permanece como assinatura discreta, com opacidade reduzida.
- Voz neural salva, fallback oficial para identificadores legados no player, Diário e Diário de Reconexão, conteúdo, player, animações e política de áudio.
- Durante a narração do protocolo, frequências Solfeggio tonais permanecem bloqueadas como trilha de fundo; ambiência não tonal, como ondas, continua permitida.
- Preços, cupons, checkout InfinitePay, confirmação server-side, endpoints e regras comerciais.
- Identidades dos Estilos 1, 2 e 4; nenhuma alteração nesses estilos.

## Varredura estática por página/fluxo

Foram conferidos o tema neutro sem `data-layout`, o bloco de tokens da Essência Luminosa, imports CSS do Estilo 3, seletor, acesso/cadastro, Home, onboarding, cabeçalho, navegação, Anamnese, Guia dos Chakras, Banhos de Ervas, Numerologia, Mapa Astral, Ho'oponopono, Cursos/Biblioteca, Diário, Diário de Reconexão, Conquistas, Contato, ajustes de áudio, player/canvas, vídeo promocional, planos e pagamentos.

A revisão foi estática por arquivos, imports, seletores e testes. Não houve captura visual real em navegador desktop/celular nem homologação de hardware.

## Referência e natureza — limitações verificadas

- A busca nesta execução pelo nome `1001196521.png` e pelo ID `file_0000000019d0820eb7a70b6c982619d6` não encontrou o PNG original como arquivo acessível na conversa ou na Biblioteca. Portanto, não afirmo comparação pixel a pixel nesta rodada.
- O WebP já versionado foi preservado no card de prévia. Não foi substituído nem convertido novamente.
- A pasta `public/brand/essencia-luminosa/` contém somente `prancha-oficial.webp`; não há fotografia independente de natureza nessa pasta.
- A Home ainda declara `--ep-scene: none`. Não importei fotografias do Natural Sereno nem da Reintegração da Vida e não inventei um ativo aprovado.

## Validação CI

GitHub Actions — Security Audit run `42388017694`, commit `ab83b69f57cc5ea8aa0f604e6f82305b91a47ad7`:

- TypeScript: aprovado.
- Testes: **92/92 aprovados**, incluindo os dois testes novos.
- Build Vite/Express: aprovado.
- Verificação de entrypoints Express, padrões de segredos, JWT fail-closed, proteção de criação de admin, smoke test de saúde/registro e endpoints de pagamento: aprovados.
- `npm audit`: identificou **9 vulnerabilidades (3 moderadas e 6 altas)**. A etapa final de enforcement falhou por esse resultado; não foram feitas atualizações indiscriminadas de dependências nesta intervenção.
- Status Vercel do commit: falha com `build-rate-limit`. Não há deploy de produção homologado.

## Pendente

1. Obter novamente o PNG original da prancha para comparação visual direta; manter o WebP atual até então.
2. Integrar fotografias realistas próprias e aprovadas à Home e às páginas que pedem natureza, sem reutilizar ativos de outros estilos.
3. Capturar e homologar todas as páginas em desktop e celular.
4. Testar reprodução real da voz ElevenLabs escolhida, transições Solfeggio, pausa/retomada e animações em dispositivos.
5. Testar checkout, retorno e webhook InfinitePay em sandbox.
6. Resolver as vulnerabilidades de dependências e liberar a implantação Vercel.

**Status:** corrigido o uso indevido de voz do dispositivo na página de Configurações do Estilo 3 e refinado o CTA de teste neural. Os testes e o build passaram; o workflow geral continua bloqueado pelo enforcement de segurança. A homologação visual, os testes reais de integração e a publicação permanecem pendentes.
