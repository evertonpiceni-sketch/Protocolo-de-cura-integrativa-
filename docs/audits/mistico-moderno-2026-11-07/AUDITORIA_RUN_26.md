# Auditoria Run 26 — Estilo 4: Místico Moderno

**Data:** 07/11/2026  
**Base:** `main` — revisão `cbb68335f80fc64580c68d2722f6b1ead95f5159`  
**Branch de correção:** `fix/mistico-moderno-mainline-2026-11-07`  
**Referência visual:** prancha original do Everton, arquivo `1001196522.png` (`file_000000009978820eb49581883ae6340d`).

## Critério de precedência

A prancha original foi recuperada da Biblioteca e inspecionada. O arquivo tem conteúdo JPEG apesar da extensão `.png`; para o cartão do seletor foi gerada uma versão WebP 4:3, preservando a composição completa. A prancha orienta a linguagem visual; decisões posteriores aprovadas prevalecem sobre textos, fluxos ou elementos antigos que apareçam nela.

Foram mantidos: conteúdo atual do Protocolo, jornadas de 7/21 dias, escolha explícita do estilo, separação da Reintegração da Vida e assinatura do logo oficial com baixa opacidade. Não foram reintroduzidos fluxos antigos de menu, biblioteca pública ou comunidade que não pertencem à rota aprovada atual.

## Corrigido

- **Seletor:** cartão do Místico Moderno ligado à prancha original em proporção 4:3; paleta de oito amostras (azul noturno, índigo, esmeralda, violeta, dourado, âmbar, marfim e verde natural); prévia continua em `object-contain`, sem recortar a referência.
- **Escolha explícita:** preservado o estado inicial sem estilo selecionado, botão de confirmação desabilitado até a escolha e aplicação somente após salvar. Logout continua limpando a confirmação da sessão e o tema do documento.
- **Voz oficial:** normalizados Home/acolhimento, Ajustes de áudio, Player e Arcanjo para **Marianne — Meditação**, usando `OFFICIAL_PROTOCOL_VOICE_ID`. Em Ajustes, a voz fica identificada como fixa neste estilo; não é oferecido seletor de vozes instaladas no dispositivo.
- **Sem fallback robótico:** a guarda global do Estilo 4 força a voz neural aprovada, `preferElevenLabs` e `fallbackToSpeechSynthesis: false`; o Arcanjo exige ID explícito. Se o serviço falhar, a narração é interrompida e o erro é mostrado, sem troca silenciosa para Web Speech.
- **Solfeggio:** preservada a política que mantém frequências Solfeggio desligadas durante a fala do protocolo; o erro de voz no Arcanjo também interrompe o sintetizador.
- **Player/animação:** tema explícito do Místico Moderno no `SacredEnergyCanvas` (dourado/violeta sobre base noturna), partículas com cores próprias e respeito a `prefers-reduced-motion`. Camadas do player foram reorganizadas para evitar brilho excessivo e preservar contraste.
- **Logo:** wrappers de assinatura transparentes, sem fundo, borda ou sombra concorrentes; imagem com opacidade de 30% (26% em telas pequenas), sem filtro de contraste/saturação.
- **Home e modais:** aplicado tratamento noturno e imagem realista existente na Home; Contacto/Cursos usam as classes de assinatura oficiais para não destacar o logo.

## Varredura das 12 superfícies da prancha

| Superfície | Componente/área atual | Resultado |
|---|---|---|
| 1. Abertura/carregamento | Inicialização e autenticação | Mantida; o tema não é aplicado antes da confirmação. |
| 2. Acolhimento com áudio | `TransformationHome` | Voz Marianne fixa, sem fallback do navegador; assinatura discreta. |
| 3. Home | `TransformationHome` + CSS de dashboard | Fundo noturno, imagem realista, marfim para leitura e acentos dourados/violetas. |
| 4. Menu | Cabeçalho e navegação atual | Mantidos; não foi restaurado um menu legado separado. |
| 5. Jornada/lista de dias | Dashboard, progresso e detalhe do dia | Conteúdo e progresso preservados; tratamentos do Estilo 4 continuam isolados. |
| 6. Player | `MeditationSession` + `SacredEnergyCanvas` | Paleta própria, camadas corrigidas, voz fixa e movimento reduzido respeitado. |
| 7. Anamnese | Modal de anamnese e perguntas sistêmicas | Estrutura/conteúdo preservados; CSS específico continua escopado. |
| 8. Resultado | Recomendações na Home | Conteúdo preservado; leitura noturna e voz oficial. |
| 9. Biblioteca | Cursos/recursos atuais | Não foi criada biblioteca pública antiga; a Biblioteca Integrativa privada permanece separada. |
| 10. Ferramentas | Chakras, banhos, mapas, numerologia, Ho'oponopono e práticas | Módulos específicos mantidos; sem importar cores dos outros estilos. |
| 11. Comunidade | Rota atual do Natural Sereno | Não pertence à rota Mística aprovada; não foi reintroduzida no Estilo 4. |
| 12. Perfil | Ajustes, áudio, conta e plano | Superfície noturna; voz oficial fixa; logout mantém reset de confirmação. |

## Preservado

- Os quatro estilos oficiais; alterações visuais limitadas ao escopo `data-layout="mistico-moderno"`.
- Roteiros, conteúdo, progresso, jornada de 7/21 dias e regras de acesso.
- Reintegração da Vida independente, sem herdar o tema do Protocolo.
- Checkout InfinitePay, confirmação server-side, valores e cupons atuais; nenhum código de pagamento foi alterado nesta rodada.
- Solfeggio, política de propriedade do áudio, Diário e componentes compartilhados, exceto os ajustes visuais/voz descritos.

## Pendente de homologação

1. **Preview visual:** ainda é necessário validar as 12 superfícies em navegador real, desktop e celular. O preview hospedado anteriormente foi bloqueado por provisionamento/rate-limit; não foi possível fazer inspeção visual renderizada nesta execução.
2. **Teste auditivo:** o código agora fixa Marianne — Meditação e não permite fallback, mas a reprodução real depende de preview funcional e credenciais ElevenLabs válidas.
3. **Checkout:** nenhuma alteração de pagamento foi feita; o fluxo completo deve ser homologado no ambiente de teste antes de produção.
4. **Dependências:** a execução anterior reportou 9 vulnerabilidades no `npm audit` (3 moderadas e 6 altas). Não foi feito upgrade de dependências nesta correção visual/voz.
5. **Produção:** branch/PR permanecem sem merge e sem deploy.

## Limite desta auditoria

A validação desta rodada é de código, referência e testes automatizados. Não equivale a homologação visual/auditiva em navegador. O Estilo 4 permanece **em homologação**, não concluído.
