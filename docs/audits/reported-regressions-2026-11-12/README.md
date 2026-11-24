# Correções das capturas de 12/11/2026

Esta revisão continua na PR de rascunho #88. Não substitui a homologação visual das quatro pranchas nem publica alterações em produção.

- Home: retirada a arte da Reintegração dos fundos compartilhados. As quatro pranchas reais continuam no seletor.
- Protocolo 21 dias: reutilizado o componente da figura humana aprovada da Reintegração. A iluminação acompanha a etapa e o progresso do áudio, preservando o roteiro próprio do protocolo e os controles de respiração.
- Numerologia: corrigidos os cartões de Ano Pessoal e Maturidade nos quatro estilos; retirado o truncamento de textos. Acrescentadas leituras por Caminho de Vida, Alma, Expressão e Ano Pessoal, com relações, trabalho, perguntas, integração em sete dias e explicação do método. As seções aprofundadas preservam o benefício contratado.
- Astrologia: acrescentadas leituras por signo solar, cotidiano, relações e roteiro de reflexão. Retirada a afirmação de cálculo rigoroso do Ascendente. A interface explica que Lua, Ascendente, planetas e casas são estimativas e que cidade, fuso e efemérides ainda não compõem um cálculo natal preciso. Esse limite permanece aberto; não apresentar como mapa astronômico exato.
- Planos: botões primários dourados com texto escuro e contraste medido acima de 4,5:1 nos quatro estilos. Benefícios recebem texto legível, sem as faixas amarelas. O observador limita os avisos aos cartões e ao resumo de checkout, evitando inserções em contêineres intermediários.
- Reintegração: avisos de falha de música e voz, carregamento e nova tentativa aparecem dentro do player; falhas de música suspendem o estado de reprodução. Requisições têm prazo de 25 segundos e descarte de respostas canceladas. A rota de voz existente também foi registrada no servidor Express local.
- Reiki: o histórico registra a inclusão do modelo humano com chakras como aprovado no commit `31b5515`. Não foram encontradas três artes separadas para Miguel, Rafael e Chama Violeta nos caminhos de marca do histórico. A arte existente foi preservada; os atalhos identificam as três práticas, que permanecem no mesmo percurso. A correspondência a eventuais três modelos diferentes permanece pendente.

## Verificação

`modals-verification.json`: 7 estados por estilo (28 capturas), leitura introdutória e completa, benefícios, planos e checkout. Contas sintéticas, APIs interceptadas. Mede contraste de botões e do cartão de Ano Pessoal.

`playback-verification.json`: nos quatro estilos, simula falha de música, falha HTTP 503 da voz, nova tentativa bem-sucedida, pausa e saída. HTMLMediaElement simulado para testar estados; não valida qualidade acústica ou disponibilidade real da ElevenLabs.

A navegação geral foi verificada em mais 17 estados por estilo, incluindo o corpo compartilhado no player. TypeScript, 172 testes e build passaram.

## Falha real de produção ainda aberta

Uma chamada com o primeiro trecho público original do Dia 1 retornou HTTP **503**, com `Voz neural temporariamente indisponível.` e voz do dispositivo desativada. O handler atual devolve essa resposta quando a ElevenLabs responde **402 ou 429**, compatível com indisponibilidade por cota/créditos ou limite de requisições/concorrência. Sem os registros autenticados do projeto correto, não se distinguiu qual desses códigos ocorreu. Não foram comprados créditos, alteradas credenciais ou substituída a voz aprovada. Os avisos locais corrigidos não resolvem, por si só, essa indisponibilidade do provedor.

Detalhes sanitizados em `production-voice-check.json`. Nenhum pagamento real foi iniciado nos testes de interface.
