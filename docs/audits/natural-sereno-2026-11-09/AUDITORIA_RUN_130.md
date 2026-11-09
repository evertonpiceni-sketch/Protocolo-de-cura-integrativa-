# Auditoria RUN 130 — Estilo 1: Natural Sereno

**Data:** 09/11/2026  
**Branch:** `fix/natural-sereno-mainline-run111-2026-11-09`  
**PR:** #79 — aberta, em rascunho  
**Correção de código/teste:** `9b45418555e0dc09fe3578999cf9914d971a2777`

## Corrigido

- O card do Natural Sereno usava a prancha oficial como miniatura `object-cover object-top`, recortando quase toda a prancha e deixando visível apenas a faixa superior.
- Recuperado o arquivo original da Biblioteca pelo identificador exato `file_00000000317c820ebaad657dc3680de5` (`1001196520(2).png`). A arte foi inspecionada e comparada visualmente com `docs/visual-qa/natural-sereno/reference.jpg`: a cópia do repositório é visualmente correspondente, embora seja JPEG e não uma cópia binária do PNG.
- O card agora mostra a prancha inteira com `object-contain`, sem recorte, mantendo a prévia da identidade atualmente aprovada e a nota de que decisões posteriores prevalecem.
- Adicionado `tests/natural-sereno-layout-reference.test.ts` para proteger a referência integral e a confirmação explícita do seletor. O teste isola a imagem da prancha, permitindo que a fotografia principal da prévia continue usando `object-cover` sem mascarar o enquadramento integral da referência.

## Preservado

- A prancha original é referência de composição; seus antigos blocos verdes, corpo/chakras e logo de alto contraste não substituem decisões posteriores.
- Paleta atual: creme/marfim, café/marrom, dourado refinado e sálvia somente como acento.
- Paisagens realistas e enquadramentos responsivos existentes.
- Logo oficial como assinatura discreta.
- Seletor React sem pré-seleção: `selectedLayout` começa `null`; o tema só é aplicado após confirmação e persistência da escolha.
- Telas NaturalSerenoHome: acolhimento, Home, menu, jornada, recursos, ferramentas, perfil, resultado e comunidade.
- Voz neural, política Solfeggio, Diário, player neutro, animações e regras InfinitePay foram mantidos sem alteração nesta rodada.
- Estilos 2, 3 e 4 não foram redesenhados.

## Varredura e bloqueio de integração

A inspeção estática cobriu a ordem de importação das folhas CSS, o fluxo do seletor, as superfícies próprias do Natural Sereno e os componentes compartilhados de Anamnese, Perguntas Sistêmicas, Diário, Ho'oponopono, oração, Arcanjo, Ajustes de Áudio, player, Mapa Astral, Numerologia, Banhos, Prática Individual, planos/checkout e contato.

**A reconciliação com `main` não deve ser feita por atualização cega.** A branch está **100 commits à frente e 9 atrás** de `main` após os commits de correção e documentação desta rodada. Os nove commits posteriores de `main` incluem mudanças compartilhadas em `App.tsx` e `ArcanjoProtocolView.tsx`:
- `main` remove os guardas de sincronização por conta presentes nesta branch (`authSession`, `userSync`, `pendingProfileSync`).
- A versão de `main` do Arcanjo volta a montar `ChakraBody` e deixa de exigir voz neural para Natural Sereno; esta branch preserva corpo neutro e voz neural sem fallback para o Estilo 1.

Essas mudanças podem pertencer à evolução da Elegância Profunda, mas precisam ser portadas de forma condicional, sem reintroduzir chakras nem voz robótica no Natural Sereno. PR permanece `mergeable=false`; nenhum merge foi feito.

## Validação e pendências

- Não há execução GitHub Actions associada ao HEAD atual `dd85e6d`. A última CI bem-sucedida conhecida nesta linha é anterior às alterações atuais e **não valida** esta rodada. Não declarar a nova versão aprovada em CI.
- O status combinado atual mostra o check Vercel em falha por `build-rate-limit`; não há preview READY. A inspeção visual renderizada desktop/mobile permanece pendente.
- Escuta real de Marianne, Solfeggio, ambiência, pausa e retomada permanece pendente.
- InfinitePay: sandbox, checkout, confirmação e webhook permanecem pendentes; nenhuma cobrança foi realizada.
- A prancha original foi recuperada e comparada; não é mais pendência de localização.

**Sem merge, publicação em produção ou cobrança real.**
