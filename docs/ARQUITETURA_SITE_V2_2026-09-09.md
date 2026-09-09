# PROTOCOLO DA TRANSFORMAÇÃO — ARQUITETURA DO SITE V2

**Status:** especificação de implementação aprovada para branch de trabalho  
**Data:** 2026-09-09  
**Base:** BRIEFING-MÃE + decisões de produto consolidadas em 09/09/2026

## 1. Regra-mãe

O site deve funcionar como uma jornada personalizada, não como um catálogo frio de técnicas.

**ACOLHER → COMPREENDER → PERSONALIZAR → VIVENCIAR → INTEGRAR → COMPARAR → CONTINUAR**

A tecnologia organiza a experiência; a matriz energética e integrativa cruza as informações compartilhadas pela pessoa com possibilidades do acervo de Everton.

Não reduzir a matriz a Reiki. Ela pode combinar, quando coerente com a proposta e com a formação/acervo disponível, múltiplos sistemas e práticas: Reiki e sistemas derivados, empoderamentos, sistemas canalizados, práticas devocionais, arquétipos, mantras, visualizações, decretos, frequências, chakras, cristais, florais, aromaterapia, banhos energéticos, práticas xamânicas, perguntas e movimentos sistêmicos, respiração, meditação, oração e demais práticas documentadas na biblioteca.

Não impor limite arbitrário de quantidade de sistemas em um atendimento/protocolo. A regra é **coerência de função**, não quantidade. Cada sistema usado deve ter finalidade identificável dentro do movimento da jornada.

## 2. Fluxo principal

**ENTRAR**  
↓  
**AMBIENTAÇÃO SONORA PERSONALIZADA**  
↓  
**ANAMNESE ENERGÉTICA**  
↓  
**SEU MAPA ENERGÉTICO**  
↓  
**DIÁRIO DAS EMOÇÕES — ANTES**  
↓  
**RELATÓRIO ENERGÉTICO INICIAL — TELA + PDF**  
↓  
**JORNADA/PROTOCOLO PERSONALIZADO**  
↓  
**DIÁRIO DURANTE A JORNADA**  
↓  
**DIÁRIO DAS EMOÇÕES — DEPOIS**  
↓  
**ANAMNESE ENERGÉTICA DE INTEGRAÇÃO**  
↓  
**ANTES × DEPOIS**  
↓  
**RELATÓRIO DE TRANSFORMAÇÃO — TELA + PDF**  
↓  
**HISTÓRICO DA TRANSFORMAÇÃO / CONTINUIDADE**

## 3. Entrada e identidade

Visual oficial:
- verde floresta/profundo + dourado;
- natureza, luz, folhas, montanhas, nascer/pôr do sol;
- serif sofisticada + sans-serif legível;
- estética premium, natural, espiritual e integrativa;
- usar exclusivamente o logo oficial Everton Piceni aprovado; não gerar substitutos por IA.

Ao entrar, a experiência deve usar a frequência/Solfeggio indicada para a pessoa quando esse resultado já existir. Em primeiro acesso, o áudio só pode ser iniciado após gesto válido do usuário quando o navegador bloquear autoplay.

CTA principal: **Começar minha jornada** / **Continuar minha jornada**.

## 4. Anamnese Energética

Não simplificar a anamnese existente. Preservar perguntas e mecanismos úteis e ampliar a arquitetura para contemplar:

- momento atual e intenção;
- dimensões emocionais;
- percepção energética/chakras;
- rotina e contexto;
- espiritualidade/práticas preferidas quando pertinente;
- perguntas sistêmicas;
- movimentos sistêmicos originais;
- relação entre dar e receber;
- pertencimento e lealdades familiares;
- crenças herdadas;
- culpa/merecimento;
- padrões de repetição;
- trabalho, dinheiro e prosperidade quando o eixo for pertinente;
- diário emocional inicial;
- dados estáveis necessários a Numerologia/Mapa Astral.

As perguntas sistêmicas são **variáveis de personalização**, e não apenas textos reflexivos.

### Dados estáveis × evolutivos

Separar tecnicamente:

**Estáveis:** nascimento e demais dados natais; base de Mapa Astral/Numerologia.  
**Evolutivos:** respostas da anamnese, diário, percepções, focos, indicadores, protocolo realizado e reavaliações.

Reavaliações nunca sobrescrevem o retrato inicial.

## 5. Seu Mapa Energético

O resultado deve apresentar possibilidades personalizadas, sem transformar a pessoa em um rótulo.

Campos previstos:
- foco predominante;
- chakra/foco energético;
- Solfeggio/frequência sugerida;
- leitura sistêmica relevante;
- floral sugerido, quando houver correspondência validada na biblioteca;
- aromaterapia sugerida, quando houver correspondência validada;
- banho energético sugerido, quando houver formulação validada e segura;
- protocolo/jornada sugerido;
- práticas complementares;
- Mini Mapa Astral e Numerologia conforme plano;
- Mapa Astral e Numerologia completos a partir do plano semestral, conforme regra comercial vigente.

Não usar lógica rígida `problema X = tratamento Y`. A matriz deve ponderar múltiplos sinais e oferecer contexto.

## 6. Matriz Energética e Integrativa

Criar estrutura de dados para cada recurso do acervo:

```ts
type IntegrativeResource = {
  id: string;
  name: string;
  family: 'reiki' | 'empoderamento' | 'sistema_canalizado' | 'devocional' | 'sistemico' | 'meditacao' | 'frequencia' | 'cristal' | 'floral' | 'aromaterapia' | 'banho' | 'xamanico' | 'respiracao' | 'outro';
  intentions: string[];
  functions: string[];
  sourceRef?: string;
  practitionerInitiated?: boolean;
  supportsDistance?: boolean;
  supportsProgramming?: boolean;
  supportsGroup?: boolean;
  consentRequired?: boolean;
  cautions?: string[];
};
```

A seleção de sistemas para um protocolo deve registrar **por que cada recurso está ali**.

Exemplo conceitual de composição:

`movimento da jornada → intenção → sistema(s) principal(is) → sistemas complementares → prática digital → integração → diário`.

A composição pode usar vários sistemas simultaneamente quando isso fizer sentido dentro da metodologia de Everton.

## 7. Programação energética × experiência digital

Separar duas camadas.

### A. Programação Energética do Protocolo

Registro interno/admin:
- protocolo;
- duração;
- sistemas/energias utilizados;
- função pretendida de cada sistema;
- dias/fases em que atua;
- sistemas que permanecem durante toda a jornada;
- intenção/programação registrada por Everton;
- versão da programação;
- data de preparação.

### B. Experiência Digital Diária

Fluxo:

**DIA → PREPARAÇÃO → ACEITE → PLAY → EXPERIÊNCIA DO DIA → MEDITAÇÃO/ANIMAÇÃO → PRÁTICA DE INTEGRAÇÃO → DIÁRIO → CONCLUSÃO**

O aceite e o Play funcionam como marco digital de início da experiência programada segundo a metodologia espiritual adotada pelo projeto.

## 8. Protocolos — pesquisa antes de composição

Não fechar protocolos usando apenas os sistemas mais conhecidos. Antes de definir uma jornada, pesquisar a biblioteca por **função e conteúdo**, não apenas por título.

### Prosperidade, Caminhos e Merecimento

Pesquisar e indexar todos os materiais relacionados a:
- prosperidade;
- dinheiro;
- abundância;
- receber;
- merecimento;
- escassez;
- trabalho;
- negócios;
- vendas/clientes;
- oportunidades;
- realização;
- abertura de caminhos;
- padrões familiares/sistêmicos relacionados a dinheiro.

Sistemas já identificados como candidatos de pesquisa, sem limitar a estes:
- Money Reiki;
- Soragimik Astral Money Reiki;
- Diamante da Prosperidade;
- Empoderamentos de Ganesha;
- Empoderamento da Liberdade do Dinheiro;
- demais sistemas encontrados na biblioteca.

A jornada de prosperidade deve poder combinar sistemas energéticos com perguntas sistêmicas, práticas de integração, meditação, diário e ações conscientes no mundo real.

### Limpeza, Proteção e Reequilíbrio Energético

Pesquisar o acervo completo antes de fechar a combinação. Eixos preliminares:
`limpeza → transmutação → proteção → aterramento → reorganização → fortalecimento → selamento`.

### Chakras — Reconexão e Equilíbrio

Não usar a fórmula rígida `1 chakra = 1 Reiki`. Cada centro pode receber uma composição coerente de sistemas e práticas.

No cardíaco, contemplar o movimento **Compaixão e Acolhimento de Si** e avaliar Karuna Reiki/Kwan Yin quando indicado pela matriz e coerente com a programação de Everton.

## 9. Prosperidade — perguntas sistêmicas

A Anamnese pode investigar, sem induzir uma resposta específica:
- Como o dinheiro era tratado na sua família de origem?
- O que você aprendeu observando quem tinha e quem não tinha dinheiro?
- Existe desconforto em ter mais do que pessoas importantes da sua família tiveram?
- Como você se sente ao receber sem precisar compensar imediatamente?
- Você associa trabalho a esforço, sacrifício, culpa, prazer, segurança ou liberdade?
- Há histórias de perdas, falências, dívidas, heranças ou conflitos financeiros que se repetem na família?
- O que acontece dentro de você quando imagina prosperar de uma forma diferente da sua família?
- É mais fácil dar ou receber?
- O que você teme que mude nas suas relações se prosperar?
- Que frase sobre dinheiro parece ter acompanhado sua família por gerações?

Essas respostas devem alimentar a personalização e ser revisitadas na integração quando fizer sentido.

## 10. Diário das Emoções

Três camadas:

### Antes
Retrato inicial do estado percebido, expectativas, emoções, corpo percebido e intenção.

### Durante
Registro leve por dia: `como cheguei → o que percebi → o que ficou comigo → como saio`.

### Depois
Revisita indicadores-chave e perguntas selecionadas para comparação.

Não fabricar porcentagem de melhora. Mostrar mudança real nas respostas e percepções.

## 11. Relatório Energético Inicial

Gerar em tela e PDF premium.

Deve preservar o snapshot inicial e reunir, conforme aplicável:
- síntese da Anamnese Energética;
- indicadores emocionais/energéticos;
- dimensões sistêmicas relevantes;
- chakra/foco;
- Solfeggio;
- floral;
- aromaterapia;
- banho energético;
- jornada/protocolo recomendado;
- Diário das Emoções inicial;
- Mapa Astral/Numerologia conforme elegibilidade.

## 12. Banhos Energéticos

Não inventar receitas. Somente usar formulações/correspondências catalogadas e revisadas.

Apresentação prevista:
- finalidade dentro do enquadramento energético;
- ingredientes e quantidades;
- preparo;
- modo de uso;
- momento/frequência quando aplicável;
- intenção/afirmação;
- cuidados de segurança.

## 13. Sessão audiovisual

A experiência deve suportar:
- frequência personalizada da Anamnese, e não obrigatoriamente frequência fixa do dia;
- voz guiada;
- som ambiente/natureza quando previsto;
- animação de yantra/lotus/elemento visual coerente;
- timer/progresso;
- play/pause;
- ±10 s quando tecnicamente aplicável;
- volume;
- fullscreen;
- respiração guiada;
- Prática de Integração após a experiência.

Não confundir a frequência personalizada com a programação energética do protocolo: são camadas complementares.

## 14. Anamnese Energética de Integração

Ao final de 7/21 dias, reaplicar indicadores-chave comparáveis, sem obrigar a pessoa a refazer desnecessariamente todos os dados estáveis.

Mostrar:
- respostas que mudaram;
- pontos que permaneceram sensíveis;
- mudanças no Diário;
- movimentos sistêmicos revisitados;
- novo foco predominante quando houver;
- novas possibilidades de frequência/floral/aroma/banho/protocolo quando pertinentes.

## 15. Relatório de Transformação

Tela + PDF contendo:
- Antes × Depois;
- Diário das Emoções;
- evolução das respostas;
- jornada concluída;
- percepções registradas;
- pontos que ainda pedem atenção;
- possibilidades de continuidade.

Linguagem: `mudanças percebidas`, `evolução das respostas`, `comparação da jornada`. Evitar fabricar eficácia clínica.

## 16. Histórico da Transformação

Persistir longitudinalmente:

**Início → Jornada 1 → Reavaliação → Jornada 2 → Reavaliação → ...**

O usuário deve poder revisitar relatórios anteriores sem que novas avaliações apaguem as antigas.

## 17. Navegação proposta

Navegação principal mobile-first:
- **Início**
- **Minha Jornada**
- **Mapa Energético**
- **Diário**
- **Explorar**

Área `Explorar`:
- Jornadas e Protocolos;
- Práticas;
- Banhos;
- Florais e Aromaterapia;
- Chakras;
- Orações/Mantras/Ho'oponopono;
- Numerologia;
- Mapa Astral;
- Entre Nós.

A home deve priorizar a ação mais relevante para a pessoa naquele momento, não exibir todas as ferramentas com o mesmo peso.

## 18. Componentização técnica sugerida

Evoluir o código atual progressivamente, sem reescrever tudo de uma vez:

```text
src/
  features/
    energetic-assessment/
    energetic-map/
    emotion-diary/
    protocols/
    energetic-programming/
    integration-assessment/
    transformation-history/
    reports/
  lib/
    integrative-matrix/
      resources.ts
      scoring.ts
      systemicSignals.ts
      recommendationEngine.ts
  components/
    design-system/
```

Componentes atuais úteis devem ser reaproveitados/migrados: AnamnesisModal, SystemicQuestionsModal, DailyDiaryModal, MeditationSession, ArcanjoProtocolView, HerbalBathsModal, AstralMapModal, NumerologyModal e TrackerGrid.

## 19. Modelo de snapshots

```ts
type EnergeticSnapshot = {
  id: string;
  userId: string;
  kind: 'initial' | 'integration';
  createdAt: string;
  anamnesis: unknown;
  systemicAnswers: unknown;
  emotionDiary: unknown;
  energeticMap: unknown;
  recommendations: unknown;
  reportVersion: string;
};

type JourneyHistoryEntry = {
  journeyId: string;
  initialSnapshotId: string;
  integrationSnapshotId?: string;
  startedAt: string;
  completedAt?: string;
  dailyEntries: unknown[];
};
```

## 20. Guardrails de produto

- preservar a identidade espiritual/energética sem apresentá-la como diagnóstico médico;
- não transformar práticas integrativas em substituição de atendimento necessário;
- não usar vulnerabilidade como gatilho de venda;
- não inventar receitas, correspondências ou sistemas que não estejam documentados;
- não plagiar lógica, perguntas, textos ou identidade de projetos de clientes;
- não fabricar percentuais de transformação;
- manter consentimento e autonomia;
- práticas com plantas, óleos, cristais ou ingestão exigem revisão de segurança apropriada;
- separar claramente conteúdo da tradição/material-fonte de alegações científicas.

## 21. Ordem de implementação

### Fase 1 — Fundação
1. design system verde/dourado + shell de navegação;
2. modelo de snapshots/histórico;
3. Anamnese Energética preservando estrutura existente;
4. perguntas sistêmicas como sinais da matriz;
5. Mapa Energético;
6. Diário Antes/Durante/Depois.

### Fase 2 — Experiência
7. matriz integrativa catalogada;
8. programação energética por protocolo/fase;
9. sessão audiovisual personalizada;
10. protocolos 7/21 dias;
11. banhos/florais/aromas vinculados a dados catalogados.

### Fase 3 — Fechamento longitudinal
12. Anamnese de Integração;
13. Antes × Depois;
14. Relatório Energético Inicial PDF;
15. Relatório de Transformação PDF;
16. Histórico da Transformação.

### Fase 4 — Ecossistema
17. Entre Nós;
18. planos e permissões;
19. camada VIP/cuidado humano;
20. refinamento de acessibilidade, performance, segurança e analytics ético.

## 22. Critério de aceite

A reformulação só estará pronta quando uma pessoa conseguir percorrer, sem atalhos artificiais:

**entrada → Anamnese Energética → resultado personalizado → Diário Antes → relatório inicial → protocolo → Diário Durante → Diário Depois → reavaliação → comparação → relatório final → histórico.**

E quando o sistema conseguir explicar internamente **por que** sugeriu cada elemento da composição, sem depender de uma associação simplista de uma resposta a uma única técnica.
