# Auditoria RUN 77 — Estilo 2: Elegância Profunda

Data: 2026-11-07  
Branch: `main`  
Commit de código validado: `c7fbc1a0932dab51f1eb9c2da8f7b76590183c70`

## Resultado desta rodada

Foi encontrada uma divergência funcional entre a política de áudio documentada e a implementação das prévias de voz. O Estilo 2 podia tocar uma frequência Solfeggio junto com a prévia neural. A correção foi aplicada sem alterar a identidade visual, a voz escolhida, os conteúdos ou os demais estilos.

## Corrigido

### Voz neural e Solfeggio

A política `shouldPlayProtocolSessionBackground` já determinava que frequências Solfeggio não tocassem junto com narração neural, permitindo que ambiências não tonais continuassem.

A implementação, porém, aplicava essa regra global somente à Essência Luminosa:

- Em `src/App.tsx`, a sincronização global e o desbloqueio por gesto verificavam apenas `isEssenciaLuminosa`.
- Em `src/components/AudioSettingsModal.tsx`, a prévia da voz iniciava o áudio de fundo para Natural Sereno e Elegância Profunda sem distinguir Solfeggio de ambiência não tonal; a restauração após a prévia também era exclusiva da Essência Luminosa.

Correções:
- O estado global agora aplica a política a todos os layouts que usam catálogo neural: Natural Sereno, Elegância Profunda e Essência Luminosa.
- A prévia neural interrompe Solfeggio em todos esses layouts.
- Ambiências não tonais podem continuar durante a prévia e são restauradas ao final quando o áudio está habilitado.
- A dependência do efeito global inclui `usesNeuralVoiceCatalog`, evitando estado obsoleto quando a conta muda entre layout neural e não neural.
- Místico Moderno e seu fluxo de voz não foram alterados.

### Testes

Criado `tests/style2-audio-preview.test.ts`:
- 396 Hz e 528 Hz permanecem suspensos durante prévia neural.
- Floresta e chuva, como ambiências não tonais, continuam permitidas.
- A sincronização global, o desbloqueio por gesto e o modal usam a política compartilhada.

O teste existente da Essência Luminosa foi atualizado para verificar a política neural compartilhada. Isso ajusta somente a expectativa do teste à regra comum; não altera a paleta ou a composição visual do Estilo 3.

## Varredura visual e estrutural

- 21 folhas CSS ativas do Estilo 2 importadas por `src/main.tsx`.
- 21/21 inspecionadas; todos os seletores verificados estão escopados por `data-layout="elegancia-profunda"`.
- Nenhuma regra global sem escopo foi encontrada nas 21 folhas ativas.
- O arquivo `elegancia-profunda-welcome-audit.css` permanece no repositório, mas não está importado pelo fluxo ativo; pertence ao componente legado `WelcomeModal`, que não é montado por `App.tsx`.
- `OnboardingFlow` continua sendo o fluxo ativo.
- O seletor React mantém seleção inicial vazia e confirmação desabilitada até escolha explícita.
- `data-layout` só é aplicado depois da confirmação e da persistência bem-sucedida.
- O logout limpa a confirmação para exigir nova escolha na próxima sessão.

## Preservado

- Identidade Elegância Profunda: verde profundo intencional, dourado nobre, champagne, bronze e marfim.
- Logo oficial como assinatura discreta, com opacidade de 30% nas regras específicas do estilo.
- Seletor e quatro opções oficiais.
- Jornada de 21 dias e corpo neutro da Reintegração.
- Voz neural sem fallback silencioso para SpeechSynthesis.
- Voz dedicada da Reintegração.
- Oscilador Solfeggio com frequência fundamental nominal exata.
- Diário, player, Wake Lock e cadência respiratória 4–3–5.
- Checkout InfinitePay e confirmação server-side, validação do valor e unicidade da transação.
- CSS, conteúdo, preços, cupons e identidade dos demais estilos.

## Referência visual e natureza — pendentes

- O seletor utiliza `/brand/elegancia-profunda/prancha-oficial.svg`, com imagem WebP incorporada de 240 × 180 px.
- O PNG original `1001194194.png` / `file_00000000121c820e931b56bb6b1467e9` não foi localizado na Biblioteca nem no repositório nesta execução. Não foi feita ampliação artificial nem substituição por prancha antiga.
- `--ep-scene:none` permanece intencional até existir fotografia de natureza exclusiva e aprovada para o Estilo 2.

## CI e publicação

GitHub Actions [run #42433302820](https://github.com/evertonpiceni-sketch/Protocolo-de-cura-integrativa-/actions/runs/42433302820), no commit `c7fbc1a`:

- `npm audit --audit-level=moderate`: 0 vulnerabilidades.
- TypeScript: aprovado.
- Testes: 110/110 aprovados.
- Build: aprovado.
- Entry points Express: aprovados.
- Verificações de segredos, JWT fail-closed e proteção administrativa: aprovadas.
- Smoke tests de saúde/cadastro: aprovados.
- Endpoints de pagamento fail-closed: aprovados.

O check da Vercel continua em falha por `build-rate-limit`. O build do GitHub Actions passou, mas não há publicação de produção homologada.

## Pendente

1. Recuperar a fonte original da prancha para gerar prévia de maior densidade sem interpolação artificial.
2. Obter e aprovar fotografia real de natureza exclusiva do Estilo 2; manter `--ep-scene:none` até lá.
3. Finalizar a comparação visual do player e da silhueta corporal neutra em desktop e celular.
4. Testar voz neural, Solfeggio e ambiências em reprodução real nos dispositivos.
5. Homologar persistência do Diário em sessão/dispositivo real.
6. Realizar transação controlada InfinitePay, conferir webhook e liberação do acesso.
7. Aguardar liberação do limite Vercel e confirmar publicação.

## Commits desta correção

- `8ff56e4` — política global de prévia neural no App.
- `5972d0e` — suspensão/restauração de Solfeggio e ambiência no modal de áudio.
- `1b544f4` — teste de regressão específico do Estilo 2.
- `c7fbc1a` — alinhamento da expectativa do teste da Essência Luminosa com a política neural compartilhada.

## Critério de continuidade

Não reabrir logo, seletor, isolamento CSS, conteúdo, jornada de 21 dias, corpo neutro, checkout ou confirmação server-side sem evidência de regressão. A próxima etapa deve avançar a referência visual original, natureza aprovada, homologação funcional real e publicação.
