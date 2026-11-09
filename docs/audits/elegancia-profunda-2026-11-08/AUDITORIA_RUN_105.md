# Auditoria RUN 105 — Estilo 2: Elegância Profunda

**Data:** 08/11/2026  
**Branch:** `main`  
**HEAD auditado:** `36ca2cad51a78c34151819a1410a02661bae4899`

## Resultado executivo

- Nenhuma regressão nova do Estilo 2 foi introduzida desde a RUN 103.
- Não foi necessário alterar código funcional: as duas alterações posteriores no intervalo auditado pertencem à documentação e ao teste da Essência Luminosa.
- As 21 folhas CSS ativas do Estilo 2 foram recuperadas e examinadas. Nenhum bloco de regra apresentou seletor sem escopo `data-layout="elegancia-profunda"`; o teste de regressão existente também percorre os seletores extraídos de todas as 21 folhas.
- CI do HEAD atual concluída com sucesso: 153/153 testes, zero vulnerabilidades e build aprovado.
- A publicação da versão atual permanece pendente: não existe deployment Vercel para o HEAD auditado.

## Corrigido nesta rodada

- Nenhum patch funcional foi aplicado porque não foi encontrada regressão nova que justificasse alterar componentes ou estilos aprovados.
- Registrada esta auditoria com evidências atualizadas do repositório, CI, ativos visuais e implantação.

## Varredura página por página

Foram examinadas as folhas ativas correspondentes a:

1. Modais compartilhados.
2. Anamnese.
3. Oração de São Miguel.
4. Contato.
5. Banhos de Ervas.
6. Mapa Astral e Numerologia.
7. Diário.
8. Diário do Dia.
9. Detalhamento dos dias.
10. Ho'oponopono.
11. Promoção.
12. Ajustes de Áudio — acabamento principal.
13. Ajustes de Áudio — semântica.
14. Cursos.
15. Conquistas.
16. Navegação inferior.
17. Instalação mobile.
18. Cabeçalho.
19. Dashboard.
20. Player e sessão.
21. Camada final de decisões aprovadas.

As 21 folhas permanecem importadas em `src/main.tsx`. Todos os blocos de regra verificados nesta rodada estão escopados para a Elegância Profunda. O teste `todas as folhas CSS do Estilo 2 permanecem isoladas do restante do sistema` percorre os seletores extraídos de cada uma das 21 folhas e passou na CI do HEAD atual.

A camada `elegancia-profunda-approved-overrides.css` continua depois das folhas de auditoria do Estilo 2. A camada final da Essência Luminosa é carregada depois, mas seu próprio escopo é independente. Não há alteração de código do Estilo 2 no intervalo comparado.

## Preservado e revalidado

### Referência visual e logo

- Card oficial: `/brand/elegancia-profunda/prancha-oficial.svg`.
- O SVG contém derivação WebP de **300 × 225 px**, `viewBox="0 0 300 225"`, sem recorte.
- O comentário do ativo identifica a fonte oficial `1001194194.png`, 1536 × 1152, e a redução proporcional Lanczos.
- Hash SHA-256 da derivação WebP registrado no ativo/teste: `92f716e9268e51845c19171307f959e00ce60a381704f02fe01f2dd03a3437d5`.
- A pasta `public/brand/elegancia-profunda` contém apenas a prancha; não há fotografia independente de natureza exclusiva do Estilo 2.
- Logo oficial permanece com 30% de opacidade e wrapper transparente, sem moldura ou sombra dominante.

A prancha orienta atmosfera e composição. Mockups antigos de 12 dias e representação corporal masculina não são recuperados: prevalecem a jornada aprovada de 21 dias e o corpo neutro.

### Identidade e seletor

- Paleta do Estilo 2 preservada: verde profundo intencional, ouro nobre/champagne/bronze e marfim.
- Tipografia: Playfair Display e Montserrat.
- `LayoutChoiceModal` continua sendo o seletor React ativo, com seleção inicial nula e confirmação desabilitada até escolha explícita.
- `App.tsx` não define `data-layout` antes da confirmação da sessão; logout reinicia a confirmação.
- Cadastro permanece neutro antes da escolha.
- `OnboardingFlow` permanece ativo; `WelcomeModal` e mecanismos DOM antigos continuam fora do fluxo.

### Voz, Solfeggio, Diário e player

- Caminhos gerais do Estilo 2 exigem ID ElevenLabs válido e não usam SpeechSynthesis como fallback silencioso.
- O identificador exato da voz geral escolhida anteriormente não foi recuperado com segurança; nenhuma voz substituta foi inventada.
- A voz neural dedicada da Reintegração é separada e não deve substituir a voz geral do Estilo 2.
- Osciladores Solfeggio permanecem em frequências nominais exatas; prévia neural bloqueia reprodução tonal simultânea. Ambiências não tonais permanecem separadas.
- Diário mantém callbacks de salvamento.
- Player mantém Wake Lock e Media Session condicionados ao estado de reprodução.
- Animações preservam o comportamento de redução de movimento.
- Jornada de 21 dias e corpo neutro permanecem preservados.

### InfinitePay

- Checkout e confirmação server-side preservados.
- Validação do valor efetivamente pago em centavos preservada.
- Proteção contra reutilização de `transaction_nsu` preservada.
- Nenhum preço, cupom ou regra comercial foi alterado.
- Transação sandbox e homologação do webhook permanecem pendentes.

## Alterações de outros estilos no intervalo

Comparação entre o HEAD da RUN 103 (`ccc34672b719f178250f569923de02872c0c9f2e`) e o HEAD atual encontrou somente dois commits posteriores:
- documentação da auditoria da Essência Luminosa;
- ajuste de uma asserção de teste da Essência Luminosa.

Nenhuma folha CSS, componente ou teste específico da Elegância Profunda foi alterado nesse intervalo. As camadas da Essência Luminosa permanecem escopadas ao Estilo 3.

## Validação técnica do HEAD

GitHub Actions **#42537328831** — concluída com sucesso no commit auditado:
- `npm audit --audit-level=moderate`: **0 vulnerabilidades**.
- Testes automatizados: **153 aprovados, 0 falhas**.
- Build Vite e bundle do servidor: aprovados.
- Verificações de segurança, entrypoints e endpoints de pagamento: aprovadas.

Evidência: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42537328831

## Pendente

1. Fotografia real de natureza exclusiva da Elegância Profunda, com origem/licença registrada e aprovação visual. `--ep-scene:none` permanece intencional; não reutilizar ativos de outros estilos nem transformar a prancha em falso fundo fotográfico.
2. Comparação visual renderizada, página por página, em desktop e celular. A inspeção estática de CSS e os testes não substituem homologação no navegador.
3. Homologação física da voz neural escolhida, frequências, ambiências, Diário, player, Media Session e animações em dispositivos.
4. Recuperar/confirmar o ID exato da voz geral escolhida, sem substituição automática.
5. Transação InfinitePay em sandbox e validação do webhook.
6. Publicação Vercel do HEAD atual.

## Situação Vercel

- Não foi encontrado deployment para o HEAD atual `36ca2cad51a78c34151819a1410a02661bae4899`.
- Último deployment de produção associado à branch `main`: commit `f2bff9f0a2e0d7b6cf2271f77262337037089eda`.
- Deployment: `dpl_3o3ayVGcgMazXBFcP5xRQ5FG8mfA`.
- Estado: `ERROR`, código `BUILD_FAILED`, mensagem `Resource provisioning failed`.
- Eventos detalhados de build retornaram vazios; não há evidência suficiente para atribuir uma causa mais específica.
- A tentativa mais recente de deployment do projeto pertence a uma branch de PR, não ao HEAD de produção. O projeto informa `live: false`.

Links:
- Deployment de produção com erro: https://vercel.com/evertonpiceni-sketch/protocolodecuraintegrativa/3o3ayVGcgMazXBFcP5xRQ5FG8mfA
- Check Vercel no HEAD: https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/commit/36ca2cad51a78c34151819a1410a02661bae4899/checks

**Conclusão:** a Elegância Profunda permanece tecnicamente preservada e a CI do HEAD está verde. Não havia correção funcional nova a aplicar. A homologação final continua aberta até a fotografia exclusiva aprovada, comparação visual renderizada, testes físicos, sandbox e publicação Vercel.
