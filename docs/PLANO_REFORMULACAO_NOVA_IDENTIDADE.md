# PLANO DE REFORMULAÇÃO INTEGRAL — PROTOCOLO DA TRANSFORMAÇÃO

## Objetivo

Reformular a aplicação existente sem destruir funcionalidades válidas, integrando a identidade aprovada do **Protocolo da Transformação — Um lugar para voltar para si** e preservando o núcleo energético original.

## Regra de migração

Não realizar substituição cega de termos. Separar:
1. identidade visível e textos ao usuário;
2. nomes técnicos/IDs/localStorage/cache/endpoints que precisam permanecer temporariamente por compatibilidade;
3. conteúdo energético válido que deve ser preservado;
4. linguagem clínica, determinista ou comercialmente coercitiva que deve ser reformulada.

Não renomear o repositório ou URL de produção até a validação funcional da nova identidade.

## Fase 1 — Identidade e linguagem

Aplicar em todas as superfícies visíveis:
- Everton Piceni — Terapias Holísticas e Bem-Estar;
- Protocolo da Transformação;
- Um lugar para voltar para si.;
- @terapiamorevida;
- logo oficial aprovado, sem recriação por IA;
- verde natural + dourado delicado + luz acolhedora;
- sem emojis como identidade do produto.

Revisar ocorrências visíveis de “Cura Integrada”, “Protocolo de Cura”, “diagnóstico”, “prescrição”, “tratamento”, “paciente”, “quântico” e promessas deterministas. Preservar nomes técnicos quando sua alteração puder quebrar compatibilidade.

## Fase 2 — Entrada e acolhimento

Fluxo prioritário:
1. marca/logo oficial;
2. “Aqui, ninguém precisa estar bem para ser bem-vindo.”;
3. história/propósito de Everton em medida adequada;
4. transição “Agora é sobre você”;
5. pergunta-chave “Como você está, de verdade?”;
6. possibilidade de “Não sei explicar agora”;
7. oferecer caminhos sem impor.

## Fase 3 — Home / Dashboard

Reestruturar a home para destacar:
- Meu Momento;
- Como estou hoje;
- continuar jornada ativa;
- Leque de Cuidados;
- Diário de Reconexão;
- progresso real por conclusão;
- sete chakras como linguagem energética visual quando pertinente;
- acesso ao Entre Nós quando liberado;
- acesso a PRO/VIP sem pressão comercial.

Remover lógica visual de culpa, streak punitivo ou linguagem de “cura concluída”.

## Fase 4 — Matriz Energética e Integrativa

Criar arquitetura de dados que permita associar intenções e temas relatados a múltiplas possibilidades, sem diagnóstico automático.

Categorias iniciais:
- Reiki/sistemas energéticos;
- chakras;
- Solfeggios/frequências;
- meditações energizadas;
- São Miguel;
- Chama Violeta;
- Raio de Ouro do Arcanjo Rafael;
- aromaterapia;
- florais;
- cristais;
- banhos;
- Ho'oponopono;
- orações/mantras/decretos;
- perguntas sistêmicas;
- presença/respiração/práticas corporais;
- Numerologia e Astrologia como autoconhecimento;
- Diário.

A matriz oferece possibilidades; a pessoa escolhe.

## Fase 5 — Jornadas

Preparar como coleção fundadora:
- Voltar para Mim — 5 minutos — gratuito;
- Acolher o que Sinto — 7 dias;
- Recomeçar — 7 dias;
- Ainda Há Algo em Mim — 7 dias;
- Proteção e Presença — São Miguel;
- Transmutar e Recomeçar — Chama Violeta;
- Raio de Ouro — Arcanjo Rafael;
- 21 Dias para Voltar para Mim.

Cada jornada deve declarar duração, proposta, práticas incluídas e tempo aproximado, permitindo escolha consciente.

## Fase 6 — Autoconhecimento

Criar/organizar:
- Vamos nos Transformar? — 20 perguntas autorais;
- Mapa do Momento, sem resultado dominante que rotule a pessoa;
- perguntas sistêmicas;
- Numerologia simplificada e completa PRO;
- Mapa Astral simplificado e completo PRO.

## Fase 7 — Diário de Reconexão

Migrar nomenclatura visível de Diário de Cura/Diário de Sensações para **Diário de Reconexão** onde apropriado.

Registrar percepção antes/depois e permitir histórico. Privado por padrão.

## Fase 8 — Entre Nós

Implementar atrás de feature flag até políticas, moderação e segurança estarem prontas.

Fluxo:
`escrever → privacidade/PII → segurança/moderação → revisão → publicação com iniciais`.

Antes da primeira publicação, exigir aceite das Diretrizes da Comunidade, Termos de Uso e Política de Privacidade, com versão e timestamp.

## Fase 9 — Comercial

Simplificar arquitetura:
- Gratuito — acolhimento;
- PRO — aprofundamento;
- VIP — cuidado humano.

Acessos especiais:
- TERAPEUTAVIP;
- VIP7;
- VIP21.

Cupons/permissões devem ser reconhecidos e validados no backend. Terapeuta convidado não recebe privilégios Admin.

Reformular ProUpgradeModal para não vender “receita”, “diagnóstico” ou “tratamento”. PRO vende amplitude e profundidade do ecossistema.

## Fase 10 — Notificações

Unificar o sistema de notificações. Remover o segundo `useEffect` legado do App que cria notificação “Hora da sua Cura Integrada”.

Passar ao `startDailyChecker` o estado real de conclusão do momento atual para impedir lembrete quando já concluído.

Mensagem preferencial: **Seu momento está esperando por você. Alguns minutos também são cuidado.**

## Fase 11 — Segurança e autorização

Preservar hardening existente. Não reintroduzir `usuario_premium` como fonte de autorização. Planos, papéis, convites e permissões devem ser validados server-side pela fonte autorizada de perfil.

Dados sensíveis da comunidade não devem ser enviados integralmente por WhatsApp. Alertas humanos devem usar o mínimo de informação necessário.

## Fase 12 — Compatibilidade técnica

Manter inicialmente, quando necessário:
- chaves `cura_integrada_*` de localStorage;
- cache/service worker legado enquanto a migração não estiver validada;
- endpoints existentes que servem clientes atuais;
- IDs internos usados por dados persistidos.

Esses nomes não definem a identidade pública e podem ser migrados posteriormente com estratégia de compatibilidade.

## Fase 13 — Auditoria final

Antes de declarar a reformulação concluída:
- build e lint sem erros;
- autenticação e autorização testadas;
- progresso somente por conclusão;
- lembretes respeitam conclusão;
- Gratuito/PRO/VIP testados;
- jornadas testadas;
- logo oficial presente;
- mobile/responsividade testados;
- busca final por textos legados visíveis;
- revisão de privacidade/LGPD e documentos legais;
- testes de acessibilidade essenciais;
- nenhum fluxo crítico quebrado.

## Critério de aceite

A reformulação está concluída quando alguém que nunca viu o projeto antigo consegue utilizar a aplicação e reconhecer, de ponta a ponta, a mesma promessa:

> **Aqui, ninguém precisa estar bem para ser bem-vindo.**

> **Como você está, de verdade?**

> **A energia é o coração. O acolhimento é a forma como recebemos. A tecnologia organiza os caminhos. E a pessoa continua sendo dona da própria jornada.**
