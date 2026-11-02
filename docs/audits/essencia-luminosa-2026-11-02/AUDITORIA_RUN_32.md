# Auditoria — Estilo 3 Essência Luminosa — Run 32

Referência visual oficial: prancha Estilo 3 (`1001196521.png` / `file_0000000019d0820eb7a70b6c982619d6`), subordinada às decisões aprovadas posteriores. Aprovado = congelado; reprovado/substituído/não usar = descartado.

## Corrigido
- A varredura página por página avançou para **Instalar no celular** (`#mobile-install-modal`).
- Criada `src/essencia-luminosa-mobile-install-audit.css`, isolada por `data-layout="essencia-luminosa"` e carregada em `src/main.tsx` depois das camadas gerais do Estilo 3.
- Palco, cartão, superfícies, bordas e CTA foram alinhados a marfim/champagne, sálvia/oliva clara e ouro suave, com sombra leve e tipografia nítida.
- O estado de instalação concluída continua semanticamente distinto, mas deixa de introduzir emerald estrutural no tema.

## Preservado
- Logo oficial permanece sutil/transparente como assinatura.
- Header, boas-vindas, Diário, Diário de Reconexão, Mapa Astral, Numerologia, Contato, Apresentação, Prática Individual, Perguntas Sistêmicas e canvas luminoso permanecem congelados.
- Nenhuma regra terapêutica, conteúdo aprovado, outro estilo ou confirmação server-side de pagamento foi alterada.

## Pendente comprovado
1. **Pagamento / Prática Individual:** `SpecificTreatmentModal.tsx` ainda contém `handleCopyPix()` com `evertonpiceni@gmail.com` e auto-copy ao selecionar PIX; deve ser removido na origem para deixar PIX somente como método do checkout InfinitePay.
2. **Pagamento / Prática Individual:** comentário de preço está desatualizado e a tela precisa continuar usando os valores calculados, sem preço visual fixo divergente.
3. **Seletor dos quatro estilos:** permanece necessária escolha/confirmação explícita antes da aplicação, inclusive quando existe preferência persistida.
4. **Solfeggio / Arcanjo:** o controle global em `App.tsx` ainda não inclui `showArcanjoView` em `shouldPlay`; há risco de trilha global coexistir com o áudio local do protocolo. A correção correta é atômica no dono global do áudio.
5. **Voz:** não substituir por identificador presumido; manter pendente até comprovação do ID oficial aprovado.
6. **Player/animações:** validar em execução desktop/mobile após as correções funcionais, sem mascarar falhas por CSS.

## Reauditoria
- A nova camada está estritamente limitada a `:root[data-layout="essencia-luminosa"] #mobile-install-modal`.
- O emerald remanescente no componente-base representa apenas sucesso de instalação e é convertido visualmente para os tokens de sálvia do Estilo 3.
- Não houve recoloração global nem alteração dos Estilos 1, 2 ou 4.
