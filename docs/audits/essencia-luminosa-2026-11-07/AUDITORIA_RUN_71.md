# Auditoria — Estilo 3: Essência Luminosa — Run 71

**Data:** 7 de novembro de 2026  
**Branch:** `main`  
**HEAD registrado:** `27112745bba4a133e8fdc5a1b288de6888963e85`  
**Base observada antes das correções desta rodada:** `5f505133ec9018b6b373b666ef2bf7165edc6a8c`

**Referência visual:** prancha enviada pelo Everton (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), subordinada às decisões posteriores. O seletor continua usando o derivado versionado `public/brand/essencia-luminosa/prancha-oficial.webp`.

## Corrigido

1. **Prática Individual — selo recomendado:** o selo “Completo (Recomendado)” ainda usava `bg-amber-400`, amarelo saturado, sem override específico do Estilo 3. Foi criado um seletor limitado a `data-layout="essencia-luminosa" + #specific-treatment-modal`, com champagne/ouro suave, texto ouro-escuro e sombra discreta. O significado e a posição do selo foram preservados.
2. **Cena herdada na origem:** `approved-theme.css` ainda declarava a imagem `/brand/reintegracao-presenca-arte.png` no bloco-base da Essência Luminosa, embora a folha final já anulasse a cena. A declaração de origem foi removida e substituída por `--ep-scene: none`, evitando que a arte da Reintegração reapareça por mudança de ordem ou falha de carregamento de CSS.
3. **Regressão:** acrescentado teste que protege o isolamento da cena e o acabamento do selo recomendado.

## Preservado

- Paleta vigente: marfim `#FFFFF8`, champagne `#F7F3E8`, ouro suave `#C6A46A`, sálvia `#A6B49B`, com areia/oliva clara como acentos.
- Logo oficial como assinatura discreta; não foi aumentado nem recebeu contraste dominante.
- Seletor React dos quatro estilos: seleção inicial vazia, confirmação obrigatória e aplicação de `data-layout` somente após a escolha.
- Card do Estilo 3 continua apontando para `/brand/essencia-luminosa/prancha-oficial.webp`.
- Preferência de voz salva: IDs ElevenLabs válidos são preservados; o fluxo do Estilo 3 não cai silenciosamente em SpeechSynthesis.
- Solfeggio: frequências tonais não são reiniciadas como trilha durante a narração; ambiência não tonal continua permitida.
- Diário, histórico, salvamento e exportação; player, respiração e canvas; conteúdo terapêutico e callbacks.
- Checkout InfinitePay, criação pelo endpoint `/api/payment/create-checkout`, confirmação server-side e ausência de cópia manual de chave PIX nas telas verificadas.
- Estilos 1, 2 e 4: nenhuma regra visual deles foi modificada nesta rodada.

## Varredura estática por área

| Área | Resultado da revisão de código |
|---|---|
| Acesso/cadastro | Estado neutro antes da escolha; preferência de timbre é registrada sem tocar amostra de outro estilo ou voz do navegador. |
| Seletor/prévia | Quatro cards; prancha própria do Estilo 3; confirmação explícita. |
| Home/cabeçalho | Tokens e assinatura do Estilo 3; cena própria permanece desativada até existir fotografia aprovada. |
| Configurações/voz | Catálogo ElevenLabs para o Estilo 3; prévia neural sem fallback para voz do dispositivo. |
| Diário/Diário de Reconexão | Camadas de estilo carregadas; callbacks e persistência não foram alterados. |
| Player/animações | Tema do canvas usa ouro suave/sálvia; relógio de áudio controla a progressão e respeita movimento reduzido. A validação visual em execução continua pendente. |
| Anamnese/Chakras/Banhos | Camadas específicas do Estilo 3; cores simbólicas/semânticas foram preservadas. |
| Numerologia/Mapa Astral/Ho'oponopono | Camadas próprias verificadas; conteúdo e cálculos não foram alterados. |
| Cursos/Contato/Conquistas/Instalação/Vídeo | Folhas específicas ou overrides escopados; sem alteração de conteúdo nesta rodada. |
| Prática Individual/Pagamento | Selo recomendado corrigido; checkout e validação de pagamento preservados. |

A revisão acima é estática, por arquivos, imports e testes existentes. Não equivale a homologação visual em navegador.

## Pendente

1. **Prancha PNG original:** a busca por nome e identificador na conversa/Biblioteca não disponibilizou o PNG nesta execução. O WebP versionado foi mantido; não foi possível fazer comparação pixel a pixel nesta rodada.
2. **Natureza realista própria:** a pasta do Estilo 3 contém a prancha do seletor, mas não um conjunto fotográfico próprio aprovado. `--ep-scene` permanece `none`; nenhuma imagem do Natural Sereno ou da Reintegração foi reutilizada. A abundância de natureza na Home ainda não está concluída.
3. **Homologação visual:** faltam capturas atuais de todas as páginas em desktop e celular, com conferência de alinhamento, hierarquia, tipografia, imagens e responsividade.
4. **Runtime:** ainda faltam testes reais da voz escolhida, pausa/retomada, Solfeggio, animações, Diário e checkout/webhook InfinitePay em sandbox.
5. **Build/testes:** foi acrescentada proteção automatizada, mas a suíte completa e o build não foram executados nesta rodada. Não declarar aprovação de testes.
6. **Deploy:** o status disponível do commit permanece em falha Vercel por `build-rate-limit`; não há publicação de produção homologada.

## Commits desta rodada

- `6ca718e588a4052a1f8facdde403b65d1d17d518` — suaviza o selo recomendado da Prática Individual.
- `b3d9a8e9aa24a5be561c6ce20bc4b49a38e3c031` — remove a cena da Reintegração da declaração-base do Estilo 3.
- `d8f018680aadc43e19eb08e8575d7832cf587a6b` — adiciona testes de regressão.
- `27112745bba4a133e8fdc5a1b288de6888963e85` — simplifica a asserção de isolamento da cena para manter o teste legível.

**Conclusão:** duas heranças concretas foram corrigidas na origem e protegidas por teste. O que já está aprovado permanece preservado. A Essência Luminosa ainda não deve ser considerada concluída enquanto faltarem fotografias próprias, homologação visual em desktop/mobile, testes em runtime e publicação validada.
