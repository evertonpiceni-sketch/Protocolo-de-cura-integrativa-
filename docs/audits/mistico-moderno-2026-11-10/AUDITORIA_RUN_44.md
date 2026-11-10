# Auditoria Estilo 4 — Místico Moderno — Run 44

**Data:** 10/11/2026, 07:39 (America/Sao_Paulo)  
**PR:** #77 — `fix/mistico-moderno-run15-mainline-2026-11-09`  
**HEAD auditado:** `24d29243bc1fcb81c7848d05b0d83cd73a2b3961`  
**Base:** `main` — `783aacc8210d92f35037a0d06309806b89a96973`  
**Comparação:** 127 commits à frente, 0 atrás; 55 arquivos no PR.  
**Escopo:** auditoria do Estilo 4 sem recuperar referências rejeitadas, sem alterar os Estilos 1–3 e sem merge/publicação.

## Resultado desta rodada

Não foi encontrada uma nova regressão de produto que justificasse outro patch de código. A decisão foi preservar o código aprovado e registrar as verificações e pendências reais, evitando alterações cosméticas ou repetição de correções já cobertas por testes.

## Corrigido / revalidado

- **Escolha explícita:** `LayoutChoiceModal` começa com `selectedLayout = null`; o CTA fica desabilitado até uma escolha; a preferência é aguardada/persistida antes de o fluxo confirmar a sessão. O shell permanece neutro antes da escolha.
- **Abertura automática:** `isArcanjoViewActive` depende de `showArcanjoView`; a assinatura `arcanjo_7d` sozinha não reabre o protocolo em todo login. O acesso continua pela navegação explícita ou pelo fluxo de checkout.
- **Anamnese/áudio global:** `handleSaveAnamnesis` preserva `audioEnabled=false` no Místico Moderno. O callback separado `onApplyFrequency` só ativa o áudio após a ação explícita “Sintonizar”, não durante o salvamento passivo.
- **Player:** `MeditationSession` recebe a preferência global `audioEnabled`; a política impede ambiência de fundo quando o áudio global está desligado e exclui Solfeggio da trilha de fundo da sessão.
- **Voz neural:** Anamnese, Reflexões Sistêmicas, Arcanjo, Ho'oponopono, Oração de São Miguel, Ajustes e player exigem ID ElevenLabs válido no Estilo 4. Na Anamnese, a ramificação Místico Moderno usa `fallbackToSpeechSynthesis: false` e retorna antes do fallback legado. No Arcanjo, erro de narração neural encerra com aviso, sem chamar a voz nativa.
- **Solfeggio:** 639 Hz é interrompido durante a narração nas telas de Anamnese/Reflexões e respeita o áudio global desligado. No Arcanjo, o callback HTMLAudio `onplay` também ocorre após retomada; a frequência própria acompanha os eventos reais de reprodução/pausa.
- **Paleta/heranças:** a camada compartilhada `approved-theme.css` aplica um gradiente genérico aos heróis, mas `mistico-moderno-approved-overrides.css`, importada depois dela, substitui o hero do Estilo 4 por superfícies azul-noturno/índigo/violeta. A prévia de boas-vindas também possui override noturno específico. A camada final do Místico mantém o logo em 30% no desktop e 26% no mobile, com wrapper transparente.
- **Camadas CSS:** as 25 folhas do Místico Moderno permanecem importadas; não houve alteração CSS nesta rodada. As camadas finais específicas continuam posteriores às regras compartilhadas.
- **Diário/movimento:** Diário fechado por padrão, persistência preservada e `prefers-reduced-motion` respeitado.
- **Pagamento:** nenhum arquivo de rota/API financeira foi alterado no PR. As verificações CI de endpoints fail-closed continuam aprovadas.

## Varredura estrutural das 12 superfícies

| # | Superfície | Verificação estrutural | Homologação renderizada |
|---|---|---|---|
| 1 | Splash / carregamento | Estado neutro antes da escolha; assinatura discreta preservada | Pendente |
| 2 | Boas-vindas / áudio | Override noturno e catálogo neural preservados | Pendente |
| 3 | Página inicial / Home | Hero Místico específico vence o gradiente compartilhado; sem troca de tema automática | Pendente |
| 4 | Cabeçalho / menu | Camadas próprias e logo transparente preservados | Pendente |
| 5 | Jornada / lista de dias | Conteúdo e jornada de 21 dias preservados | Pendente |
| 6 | Player do dia | Recebe áudio global; voz neural exigida | Pendente |
| 7 | Anamnese | Salvamento não reativa áudio desligado; 639 Hz protegido; sem fallback nativo | Pendente |
| 8 | Resultados | Fluxo e dados preservados; sem alteração de conteúdo | Pendente |
| 9 | Biblioteca / cursos / mapas | Componentes e camadas existentes preservados | Pendente |
| 10 | Ferramentas / protocolos | Arcanjo, Ho'oponopono e oração com política de voz neural; imagem corporal pendente | Pendente |
| 11 | Comunidade / contato / vídeo | Camadas dedicadas preservadas | Pendente |
| 12 | Perfil / Ajustes / Diário | Escolha explícita, preferências de áudio e Diário fechado preservados | Pendente |

A tabela registra inspeção estrutural do código e do mapeamento de superfícies; não representa homologação visual em navegador.

## Preservado

- Natural Sereno, Elegância Profunda e Essência Luminosa, sem alterações nesta rodada.
- Identidade Místico Moderno: azul-noturno/índigo, violeta e esmeralda integrados, dourado/âmbar como acentos e marfim para leitura.
- Jornada de 21 dias; não reintroduzir os 12 dias da prancha.
- Corpo neutro como decisão vigente.
- Logo oficial discreto/transparente, sem competir com a composição.
- Seletor com quatro opções e confirmação explícita.
- Voz neural, ownership de áudio do Arcanjo, Diário, player e animações.
- InfinitePay, preços, cupons, checkout e webhook.

## Pendente / bloqueios

1. **Prévia visual:** o status combinado do HEAD atual registra check Vercel em falha, com destino `build-rate-limit`. Sem deployment `READY`, não é possível homologar as 12 superfícies em desktop e celular.
2. **Imagem corporal:** `/brand/human-chakra-model.jpg` continua referenciada em `DashboardCura` e `ArcanjoProtocolView`. A auditoria anterior identificou apresentação corporal feminina/ilustrada; falta fotografia realista de corpo neutro aprovada. Não substituí por material improvisado.
3. **Card original:** o seletor mantém `prancha-oficial-card.svg` com WebP incorporado válido, 384 × 288, 4:3 e sem recorte (regressão coberta desde Run 42). A Library não retornou nesta execução o PNG individual `1001196522.png`; a derivação maior e a comparação pixel a pixel permanecem pendentes.
4. **Áudio real:** falta ouvir a voz ElevenLabs escolhida e testar início, pausa, retomada, erro e encerramento do Solfeggio/player em navegador/dispositivo.
5. **Pagamento:** checkout e webhook InfinitePay ainda precisam de homologação ponta a ponta em sandbox. Nenhuma cobrança real foi realizada.

## Reauditoria CI

- GitHub Actions Security Audit run **42786965139**, associado ao HEAD auditado: **conclusion success**.
- Job `audit`: concluído com sucesso.
- 214 testes aprovados, 0 falhas.
- `npm audit`: 0 vulnerabilidades.
- TypeScript/lint, build (2.250 módulos), entrypoints, JWT/admin e endpoints financeiros fail-closed: aprovados.
- O smoke test concluiu; o log registra uma tentativa inicial de conexão recusada durante a inicialização, seguida da verificação bem-sucedida. Isso não substitui teste manual no navegador.
- Check Vercel: falha `build-rate-limit`.

**Estado de publicação:** PR permanece aberto, em rascunho e mergeable. Sem merge, sem publicação em produção e sem cobrança real. Manter as decisões aprovadas congeladas; retomar pela prévia renderizada e pelas homologações pendentes, não por novos ajustes cosméticos.
