# Auditoria completa do Layout 1 — Natural Sereno

Data de referência: 12/10/2026, America/Sao_Paulo. Base: `ab5b280`. Método fornecido pelo Everton: **varredura completa → revisão de um item por vez → correção mínima → reauditoria → relatório breve**. A skill pessoal não estava disponível como arquivo nesta sessão; o roteiro informado pelo usuário foi aplicado diretamente.

## Resultado local

63 telas e estados, 189 verificações em 320×568, 390×844 e 1365×768. Conferência visual por capturas reais do Chromium, incluindo rolagem das páginas longas e acessos das Configurações. Zero erros JavaScript, zero transbordamento horizontal e zero controles interativos sem nome acessível nas amostras finais. Nos 38 estados com diálogo, foco inicial, Tab e Escape passaram.

[Inventário página por página](coverage.md) · [Resultados completos](results.json) · [Resumo das verificações](summary.json)

A cobertura foi construída em lotes: varredura geral, caminhos públicos das ferramentas/Configurações e reauditoria específica após cada correção. Imagens antigas e verificações que falharam foram substituídas pelas evidências da reauditoria dos respectivos itens.

## Falhas comprovadas e correções mínimas

| Item | Falha observada | Correção e conferência |
| --- | --- | --- |
| Home | A camada da saudação interceptava o toque no menu | Corrigido somente o empilhamento do botão; navegação testada por toque |
| Carregamento | Suspense sem fallback deixava a tela vazia ao carregar um modal lento | Reutilizada a tela de carregamento já aprovada; atraso de chunk simulado |
| Prática individual | Card alto centrado cortava o topo no mobile | Altura limitada ao viewport e rolagem interna; topo/final conferidos |
| Diálogos | Foco saía da janela e Escape não fechava diversos modais | Aplicado o hook existente no Natural Sereno; teste de diálogo aninhado verifica que somente o superior fecha |
| Controles | Botões de cenas, navegação do diário e campos sem identificação acessível | Incluídos nomes/associações de labels, sem mudar textos visíveis |
| Formulários por etapas | Foco se perdia ao refazer a anamnese, abrir a anotação ou trocar reflexões | Foco levado ao título/campo correspondente; todas as etapas conferidas |
| Diário detalhado | Névoa dourada, selos ilegíveis e título próximo ao botão de fechar | Corrigidos halo, contraste local e espaço reservado no header |
| Configurações | Selo e descrição sempre diziam anual; painel escuro destoava do Layout 1 | Selo e descrição refletem a assinatura já existente; cores locais Natural Sereno |
| Fale conosco | Névoa encobria leitura; copiar podia anunciar sucesso após rejeição | Halo atenuado; sucesso somente após clipboard resolver; rejeição testada |
| Mapa Astral / Sistêmicas | Texto escuro no botão verde; botão fechar fora da posição | Contraste pontual e posição/área de toque corrigidos |
| Admin / páginas legais | Botões laranja e páginas na paleta escura antiga | Aplicada a paleta aprovada nos seletores locais e estilos legais; corpos dos dois documentos idênticos à base |
| Imagens | PNG do painel incompleto; JPG de notificações inválido | Referências apontam à cópia íntegra da mesma cena (`human-chakra-model.jpg`) e ao ícone oficial (`icon-192.svg`), já existentes |

A varredura de arquivos verificou 65 imagens raster. Os dois arquivos corrompidos foram preservados para não destruir materiais antigos, e suas referências ativas foram corrigidas. O navegador decodificou a cena íntegra (1229×1536) e o ícone oficial (192×192).

## Player e áudio

O player restaurado foi reauditado com WAV local real e resposta atrasada: seis etapas, animação visível, barra/tempos, seek ±15s, pausa/retomada, volume, roteiro, descarte de resposta antiga, ausência de áudio sobreposto, Media Session e liberação do Wake Lock. A página foi realmente ocultada por outra aba; áudio e transição de etapa continuaram, e pausa intencional permaneceu respeitada. Ação de seek não suportada também foi testada.

Viewports do player: 320×568, 360×740, 390×844, 430×932, 390×460, 844×390 e 1365×768. Preferência por movimento reduzido desativa a animação ambiental. Fontes aprovadas carregadas com verificação TLS ativa.

[Player mobile](player-after-390.png) · [Roteiro](player-after-script.png) · [Verificações do áudio](player-checks.json)

## Validação e preservação

- `npm run lint`: aprovado.
- `npm test`: 32 aprovados, nenhum falhou ou foi pulado.
- `npm run build`: aprovado; permanece o aviso preexistente de chunk principal acima de 500 kB.
- `node scripts/test-dialog-focus.cjs`: aprovado, com Escape aninhado, restauração de foco e ciclos Tab/Shift+Tab.
- `scripts/audit-layout1.cjs`: navegação, APIs sintéticas, capturas, overflow, nomes acessíveis, foco/Tab/Escape e rolagem. Retorna falha diante de problema confirmado.

Textos e roteiros dos dias, preços, seleção de protocolo, progresso, serviços de áudio, dependências e lockfile foram preservados. Cursos continuam em preparação; o catálogo reprovado não foi reativado. Oração nas Configurações foi auditada como acesso existente, distinto da antiga rota de catálogo Proteção e Presença. O painel analítico existente mantém seu escopo de sete dias; não houve alteração de regras ou totais.

## Limites da evidência

Esta auditoria cobre a interface, estados listados e testes de regressão existentes. Não certifica todas as combinações de dados possíveis ou integrações externas. Login de conta real, criação real de cadastro, pagamento, envio de mensagens, execução administrativa real e provedores ElevenLabs/Gemini não foram acionados pelas fixtures. A recuperação de acesso conserva a orientação atual de suporte; não foi criado reset automático.

Teclado virtual, notch/safe-area físicos, instalação PWA real e bloqueio de tela em Android/iPhone precisam de aparelho. Teste de página oculta e viewport reduzido não equivale a bloqueio físico. O fallback Web Speech continua sujeito à suspensão do sistema; não há promessa de reprodução ininterrupta nesse modo.

## Publicação

Correções enviadas ao `main` e implantadas. A versão final `9173f4d` foi identificada pelos assets `index-MkxuPuBF.js` / `index-BRN1mmNx.css`. A abertura real sem autenticação e a API de saúde passaram; 21 estados distintos e o player foram conferidos no site publicado, com fixtures para os estados autenticados. [Conferência de produção](production.md).
