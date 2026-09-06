# Experiência Refinada — implementação e testes

## Norte

**Que bom que você se ouviu e está aqui.**

A nova experiência não substitui a essência existente. Ela reduz ruído, acolhe antes de oferecer conteúdo e preserva a identidade visual e espiritual do projeto.

## Identidade preservada

- Marca Everton Piceni — Terapias Holísticas e Bem-Estar.
- Figura central com sete chakras, mandala e elementos dourados/naturais como referência da identidade original.
- Protocolo de 7 Dias, Protocolo de 21 Dias e Protocolos de São Miguel permanecem como práticas espirituais já existentes e podem receber o selo `Prática Energizada`, acompanhado de explicação transparente de que o termo descreve a proposta espiritual e não eficácia médica comprovada.
- Progresso, diário, práticas, conteúdos e demais funcionalidades úteis existentes devem ser refinados, não apagados.

## Linguagem visual

Mesclar a força da identidade original com leveza contemporânea:

- verde profundo e dourado para identidade, destaques e momentos espirituais;
- creme, branco quente e verde suave nas áreas funcionais;
- natureza e luz realistas como apoio visual;
- bastante espaço negativo;
- tipografia elegante e legível;
- cards arredondados, hierarquia clara e poucas decisões por tela;
- evitar emojis como mecanismo principal de escolha emocional;
- evitar aparência de painel administrativo na experiência inicial.

## Fluxo principal

### 1. Splash

Exibir a identidade oficial de forma limpa. Não sobrecarregar com menus ou chamadas comerciais.

### 2. Boas-vindas

Título:

> Que bom que você se ouviu e está aqui.

Apoio:

> Este é um espaço para você cuidar de si, no seu tempo.

Ação principal: `Entrar`.

### 3. Chegada

Pergunta:

> Como você chega até aqui hoje?

Não usar emojis. Usar cartões visuais humanos/natureza, com alternativas não diagnósticas:

- Estou em paz
- Preciso desacelerar
- Meu coração está apertado
- Hoje está pesado
- Quero recomeçar
- Só quero um momento para mim

Nenhuma escolha é tratada como nota, diagnóstico ou classificação clínica.

### 4. Resposta acolhedora

A interface responde antes de recomendar conteúdo.

Exemplo para `Hoje está pesado`:

> Então, vamos respirar juntos. Você não precisa fazer mais nada agora. Apenas estar aqui já é um passo importante.

Mostrar no máximo duas ações imediatas, como uma pausa curta e a opção de explorar depois.

### 5. Home

Em vez de `Olá`, usar linguagem de pertencimento, por exemplo:

> [Nome], este momento é seu.

Elementos prioritários:

1. continuar o caminho atual;
2. destaque do dia;
3. acesso simples a Diário, Práticas e Protocolos;
4. progresso sem pressão ou gamificação punitiva.

Academia permanece escondida enquanto `FEATURES.academy === false`.

### 6. Protocolos

Preservar:

- Protocolo de 7 Dias;
- Protocolo de 21 Dias;
- Protocolos de São Miguel.

Não transformar esses conteúdos em novas jornadas genéricas. Jornadas e Protocolos são categorias diferentes.

### 7. Jornadas de autocuidado

Necessidades humanas, não diagnósticos:

- Acolhimento em Dias Difíceis
- Reconexão
- Regulação e Rotina
- Autocompaixão
- Recomeço
- Presença
- Limites e Autocuidado

### 8. Pausa Consciente

Área futura para contribuições revisadas pelo profissional da Educação, com práticas de 2, 5 e 10 minutos e adaptações de acessibilidade.

### 9. Saúde emocional

Conteúdos psicoeducativos e a Jornada de Reflexão deverão passar por revisão profissional antes da publicação. O aplicativo não realiza psicoterapia, diagnóstico ou prescrição clínica.

### 10. Diário e progresso

Diário com linguagem livre e sem avaliação automática obrigatória. Progresso deve representar continuidade, não culpa por interrupções.

## Regra de segurança

Se houver sinais explícitos de risco ou crise, a experiência normal deve ceder espaço a orientação de segurança e busca de apoio humano/profissional apropriado.

Nunca sugerir alteração de medicação ou substituir atendimento profissional por práticas espirituais/integrativas.

## Critérios de aceite do redesign

- A primeira tela útil acolhe antes de perguntar.
- `Olá, [nome]` não é a saudação principal.
- Emojis não são usados como seletor emocional principal.
- A escolha emocional não gera diagnóstico.
- Protocolos existentes continuam acessíveis.
- Academia continua invisível na Etapa 1.
- O fluxo funciona em largura móvel de 320 px sem rolagem horizontal.
- Controles interativos possuem nome acessível e foco visível.
- Texto mantém contraste adequado e zoom do navegador não quebra o fluxo principal.
- Nenhuma mudança de design remove dados/progresso do usuário.

## Plano de testes

### Funcionais

1. Usuário novo: splash → boas-vindas → chegada → acolhimento → home.
2. Usuário recorrente: autenticação → home sem repetir onboarding indevidamente.
3. Cada uma das seis opções de chegada produz resposta acolhedora, nunca diagnóstico.
4. Protocolo 7 Dias abre e preserva progresso.
5. Protocolo 21 Dias abre e preserva progresso.
6. São Miguel abre sem ser convertido em jornada genérica.
7. Diário salva e recarrega corretamente.
8. Logout/login não perde dados sincronizados.
9. Feature flag de Academia desativada impede acesso público.

### Responsividade

Testar 320x568, 360x800, 390x844, 412x915, tablet e desktop.

### Acessibilidade

- navegação por teclado;
- foco visível;
- rótulos de botões/ícones;
- imagens decorativas ignoradas por leitor de tela;
- imagens informativas com texto alternativo;
- `prefers-reduced-motion` respeitado;
- contraste e zoom de 200%.

### Segurança de conteúdo

Buscar e revisar termos de alto risco, incluindo `diagnóstico`, `prescrição`, `cura depressão`, `trata bipolaridade`, `borderline`, `substitui terapia` e associações diretas entre condições clínicas e produtos/práticas.

## Estratégia de entrega

Implementar incrementalmente nesta branch. Primeiro fluxo de entrada e home; depois Protocolos/Jornadas/Práticas; depois Diário/Progresso; por último conteúdos ainda dependentes de revisão profissional. Não ativar Academia ou Jornada de Reflexão apenas porque a infraestrutura foi criada.
