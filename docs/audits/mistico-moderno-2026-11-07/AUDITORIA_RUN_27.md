# Auditoria — Estilo 4 Místico Moderno — 07/11/2026

## Escopo e regra de precedência

O Estilo 4 foi auditado com a identidade Místico Moderno: noite sofisticada, azul-noturno/índigo/violeta, esmeralda como acento integrado à natureza, dourado/âmbar como destaque e marfim para leitura. A prancha visual do projeto é usada como referência estética; decisões posteriores aprovadas continuam prevalecendo sobre qualquer texto, fluxo ou componente retratado nela.

## Corrigido nesta rodada

- **Seletor:** o cartão do Estilo 4 agora mostra a prancha visual oficial já registrada no repositório, em fundo noturno, com foco/seleção dourados. A legenda deixa explícito que fluxos e conteúdos seguem decisões aprovadas posteriores.
- **Escolha explícita:** preservada a confirmação obrigatória dos quatro estilos; nenhum tema é aplicado apenas por abrir a prévia.
- **Home e navegação:** aplicada fotografia real compartilhada do protocolo no hero, com overlay noturno; removidos fundos/bordas claros dos wrappers de assinatura; logo oficial em 30% (26% em telas pequenas); logout do Estilo 4 alinhado à paleta noturna/dourada.
- **Modais de Contato e Cursos:** a imagem oficial passou a usar as classes de assinatura, evitando badges claros e opacidade duplicada.
- **Player:** a sessão usa paleta própria de dourado/violeta no canvas, fotografia real discreta sob a animação e overlay índigo. O canvas continua absoluto, preservando seu dimensionamento.
- **Arcanjo/Solfeggio:** criada folha CSS escopada para a superfície noturna, imagem do corpo, legenda, controles e movimento reduzido. Dias não concluídos usam índigo no Estilo 4; cores dos chakras ativos continuam semânticas.
- **Voz:** criado alias interno do Estilo 4. Home, Ajustes, player e Arcanjo enviam o alias; o servidor resolve o ID configurado, rejeita IDs legados conhecidos e não permite fallback para a voz robótica do navegador. A tela de Ajustes consulta um booleano de configuração e não exibe o ID/chave; o endpoint mantém o campo legado `defaultVoice` para compatibilidade dos outros estilos.
- **Áudio e animações:** preservada a política global que interrompe frequências Solfeggio durante narração de protocolo; ondas não tonais podem continuar. O Arcanjo mantém seu oscilador próprio enquanto a tela é proprietária do áudio. O canvas e a tela Arcanjo respeitam movimento reduzido.
- **Componentes antigos:** o seletor React continua sendo a implementação ativa. Os patches antigos de entrada/confirmacão não foram reativados.
- **Regressão:** adicionado `tests/mistico-moderno-audit.test.ts` cobrindo seletor, voz, player, Solfeggio, Diário, assinatura, escopo CSS e InfinitePay.

## Varredura por superfície

| Superfície | Resultado |
|---|---|
| Entrada e seletor | Prancha no cartão do Estilo 4; seleção explícita preservada. |
| Home e boas-vindas | Fotografia natural escurecida; voz oficial pelo servidor, sem fallback local. |
| Cabeçalho e navegação | Assinatura transparente; logout noturno/dourado. |
| Jornada e cartões de dias | Regras específicas do Estilo 4 preservadas; estados semânticos mantidos. |
| Player e sessão | Paleta índigo/violeta/dourado; foto discreta; progresso recebido do motor de áudio. |
| Arcanjo e Solfeggio | Fundo noturno; imagem real; dias não concluídos em índigo; oscilador próprio. |
| Diário e Journal | Estados iniciais permanecem fechados; abertura somente por ação explícita. |
| Cursos e Contato | Logo oficial com classe de assinatura; wrappers sem badge claro. |
| Mapas, tratamentos e demais modais | Regras escopadas existentes preservadas; sem alteração de conteúdo aprovado. |
| Ajustes de áudio | Voz do Estilo 4 é resolvida no servidor e validada por status/teste. |
| Planos e checkout | InfinitePay, preços e cupons aprovados preservados; sem PIX manual. |

## Preservado

- Os quatro estilos oficiais e a confirmação explícita antes da aplicação.
- Conteúdo terapêutico, roteiros, frequências, etapas e regras de chakra.
- Preços de R$ 59,90/7 dias e R$ 99,90/21 dias; PROMO15/PROMO20 e regra VIP7.
- Checkout InfinitePay, validação de host e retorno por `PUBLIC_APP_URL`.
- Diário fechado por padrão; nenhuma abertura automática foi introduzida.
- Relógio do player alimentado pelo progresso real reportado pelo motor de áudio.
- Logo oficial como assinatura, sem competir com a arte.

## Pendente / limites desta rodada

1. O upload original `1001196522.png` / `file_000000009978820eb49581883ae6340d` não foi retornado pela busca de arquivos. Foi integrada a prancha visual já existente no repositório (`public/brand/mistico-moderno/prancha-oficial.svg`); a correspondência com o upload original não pôde ser comparada pixel a pixel.
2. O ID real da voz não foi exposto nem ouvido. O ambiente Vercel contém as variáveis de ElevenLabs em Preview e Production; o novo status verifica formato/legado, mas a audição humana da voz escolhida continua necessária.
3. A última implantação Production consultada está em `ERROR` com `Resource provisioning failed`. O estado indica falha de provisionamento da plataforma; não há log que permita atribuí-la a este conjunto de alterações.
4. Build, testes e preview deste branch aguardam execução do CI/Vercel. Não houve merge na `main` nem deploy de produção.

## Próxima validação

Executar no PR: `npm test` e `npm run build`; depois abrir o preview em desktop e celular, ouvir a voz oficial em Home/player/Arcanjo, confirmar a interrupção do Solfeggio global durante a narração, testar Diário sem abertura automática e concluir um checkout de teste InfinitePay. Só então homologar o Estilo 4.
