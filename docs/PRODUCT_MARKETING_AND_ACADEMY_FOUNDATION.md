# Fundação de Produto, Marketing e Academia

## Princípio central

**Um lugar para voltar para si.**

O produto deve priorizar acolhimento, presença, autocuidado, reflexão e práticas integrativas. A comunicação não deve prometer cura, diagnóstico ou substituição de acompanhamento médico, psicológico ou psiquiátrico.

## Instrumento próprio de reflexão

O projeto poderá ter um questionário próprio de autoconhecimento/reflexão inspirado apenas no conceito genérico de uma experiência guiada de perguntas e resultado. Não copiar perguntas, textos, lógica proprietária, categorias, identidade visual, nomenclatura, resultados ou conteúdo de testes de terceiros.

### Regras
- Nome provisório interno: `Jornada de Reflexão`.
- Não chamar o resultado de diagnóstico clínico.
- Perguntas e textos serão autorais e desenvolvidos especificamente para este projeto.
- O resultado deve indicar temas de atenção e possibilidades de autocuidado, nunca doenças ou transtornos.
- Incluir aviso claro de que a experiência não substitui avaliação profissional.
- Evitar inferências clínicas automatizadas a partir das respostas.

### Estrutura futura sugerida
1. Como você chega hoje?
2. O que mais tem ocupado sua energia?
3. Como está sua relação com descanso e presença?
4. Como você percebe seus limites?
5. O que gostaria de cultivar nesta fase?
6. Resultado em linguagem de reflexão: `Seu momento pede...`
7. Recomendar uma jornada/prática disponível no aplicativo, sem prescrição médica.

## Marketing

### Posicionamento
A pessoa é o centro. Reiki, meditação, chakras e demais práticas são ferramentas da experiência, e não uma barreira de entrada.

### Pilares
- Acolhimento
- Experiência
- Educação
- Propósito

### Funil inicial
Conteúdo -> experiência/reflexão gratuita -> cadastro -> primeiros dias -> jornada -> assinatura -> retenção.

### Métricas
Acompanhar descoberta, cadastro, início da jornada, retorno, conclusão, conversão e retenção. Não otimizar apenas downloads.

## Academia — Etapa 2

A Academia deve ser preparada na arquitetura, mas permanecer oculta/desabilitada para o público durante a Etapa 1.

### Modelo
Cada formação é um curso independente. Cursos da mesma tradição podem compartilhar uma `linhagem`, sem serem fundidos.

Cada curso poderá conter:
- título e descrição;
- linhagem;
- pré-requisitos;
- módulos;
- apostila autorizada;
- materiais complementares;
- práticas;
- progressão;
- áudios;
- sintonização/iniciação, quando aplicável;
- certificação, quando prevista.

### Tipos de áudio
- `aula`
- `orientacao`
- `pratica_meditacao`
- `sintonizacao_iniciacao`

Sintonizações devem possuir acesso protegido e não aparecer em uma biblioteca pública de áudios.

### Cursos já identificados
- **Raio de Ouro do Arcanjo Rafael — Mestrado**: curso independente. A Cirurgia Astral/Espiritual do Raio de Ouro pertence a esta formação como conteúdo/prática avançada.
- **Merkabah do Arcanjo Rafael**: curso independente.
- **Cristal Mestre do Arcanjo Rafael**: curso independente.

## Feature flags propostas

A implementação deverá usar flags explícitas, com padrão seguro:

```ts
export const FEATURES = {
  academy: false,
  originalReflectionJourney: false,
} as const;
```

A Academia permanece `false` na Etapa 1. A Jornada de Reflexão só deve ser ativada após conteúdo autoral, UX, revisão de segurança e testes estarem concluídos.

## Segurança de linguagem

Termos preferidos: `reflexão`, `autoconhecimento`, `prática integrativa`, `jornada`, `bem-estar`, `autocuidado`.

Evitar como resultado automatizado: `diagnóstico`, `prescrição`, `tratamento para depressão/ansiedade/bipolaridade`, `cura garantida`, ou equivalentes.

## Próximas implementações

1. Criar camada central de feature flags.
2. Criar modelos/tabelas da Academia sem rotas públicas.
3. Catalogar cursos e ativos sem publicar apostilas ou sintonizações na Etapa 1.
4. Projetar questionário autoral da Jornada de Reflexão.
5. Revisar nomenclaturas existentes de `diagnóstico emocional` e `prescrição` para linguagem compatível com autocuidado e práticas complementares.
6. Criar eventos de analytics para cadastro, início, retorno, conclusão, conversão e retenção.
