# Auditoria — Estilo 4 Místico Moderno
Data: 07/11/2026
Base: `main` em `d9f60054a2efd4146e9f816274df6c385a858b62`
Branch: `fix/mistico-moderno-mainline-run11-2026-11-07`

## Corrigido nesta rodada
- Voz do Estilo 4 unificada em Marianne — Meditação (`OFFICIAL_PROTOCOL_VOICE_ID`) no player, Home, Ajustes, prévias e Arcanjo. O patch global força o ID oficial e desativa fallback para SpeechSynthesis; em falha, a reprodução termina com erro em vez de trocar para voz robótica.
- Arcanjo/Solfeggio recebeu tratamento noturno isolado: fundo azul-noturno/índigo, painéis escuros, violeta discreto, dourado/âmbar e texto marfim. Os indicadores de dias não ativos usam índigo; as cores semânticas dos chakras ativos/concluídos permanecem.
- Player principal recebeu tema próprio do Místico Moderno: violeta, dourado, marfim e verde-esmeralda apenas em brilho secundário discreto.
- Tokens do Estilo 4 agora distinguem índigo, esmeralda, violeta, âmbar e verde natural; o dourado claro foi suavizado para âmbar `#E2B96B`.
- Corrigido o checkout do Mapa Numerológico Completo: o backend agora aceita `numerology_full`, calcula R$ 90,00 no servidor, cria ordem InfinitePay e só marca a compra após confirmação server-side do valor exato. A confirmação é idempotente e não altera o plano PRO.
- O payload da Numerologia deixou de enviar preço confiável pelo cliente. A Prática Específica e a Numerologia não mantêm cópia manual de chave PIX.

## Preservado
- Seletor dos quatro estilos: confirmação explícita continua obrigatória; preferência salva não é aplicada sem confirmação na sessão. A prévia do Estilo 4 agora apresenta índigo, esmeralda e violeta; a prancha original permanece pendente.
- Conteúdo terapêutico, roteiros, duração e lógica do player.
- Diário e Diário de Reconexão, sem abrir automaticamente; estados iniciais fechados e respeito a `prefers-reduced-motion` no canvas de energia.
- Política de ownership do áudio global durante Arcanjo e Reintegração.
- Checkout InfinitePay, confirmação do provedor, proteção contra transação repetida, PROMO15/PROMO20 e VIP7.
- Logo oficial como assinatura: opacidade de 30% em desktop e 26% em mobile.
- Os 22 módulos CSS existentes do Estilo 4 permaneceram isolados por `:root[data-layout="mistico-moderno"]`; a nova camada Arcanjo também usa esse escopo exclusivo.

## Varredura por área
- Entrada / seletor / prévia dos quatro estilos: escolha explícita confirmada; card Místico ainda não usa a prancha original.
- Home / dashboard / navegação: módulos específicos preservados; voz neural fixada.
- Diário / Diário de Reconexão: módulos específicos preservados; estado inicial fechado.
- Player / sessões / animações: tema próprio aplicado; política de áudio e roteiros preservados.
- Arcanjo / Solfeggio: camada visual noturna aplicada; voz fixa e sem fallback; áudio global permanece suspenso durante a tela.
- Cursos / guias / mapas / numerologia / conquistas: CSS isolado; checkout da Numerologia corrigido.
- Banhos / Ho'oponopono / prática específica / promoções / contato / vídeo / certificados / navegação mobile: CSS isolado e conteúdo preservado.
- Pagamentos: checkout e confirmação InfinitePay preservados; corrigido o tipo de produto numerologia.

## Pendente / limites desta execução
1. O arquivo original `1001196522.png` / `file_000000009978820eb49581883ae6340d` não foi encontrado na conversa nem na Biblioteca acessível desta execução. Não usei a derivação reduzida nem criei uma prancha substituta; o card do Estilo 4 permanece sem a referência oficial até recuperar o original.
2. A inspeção visual renderizada em desktop e celular e a audição real da voz exigem um preview funcional e credenciais ativas. Os testes de código não substituem essa homologação.
3. O preview/deploy da Vercel precisa ser revalidado após a CI desta branch; não foi feito deploy de produção.
4. A auditoria de dependências deve ser conferida pela CI atual; nenhuma atualização de pacote/lockfile foi feita nesta correção.

## Segurança de entrega
- Nenhuma alteração foi mesclada na `main`.
- Nenhum deploy de produção foi realizado.
- A correção fica isolada em branch/PR para revisão e homologação.
