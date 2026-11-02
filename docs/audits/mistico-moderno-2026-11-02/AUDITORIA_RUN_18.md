# Auditoria — Estilo 4 Místico Moderno — Run 18

## Referência e regra de precedência
- Referência visual oficial: prancha Estilo 4 `1001196522.png` / `file_000000009978820eb49581883ae6340d`.
- Decisões posteriores aprovadas prevalecem.
- Aprovado permanece congelado; antigo, reprovado, substituído ou marcado como não usar permanece descartado.
- Logo oficial na Reintegração da Vida: assinatura visual sutil/transparente, nunca elemento dominante.

## Reauditoria da árvore atual

### Preservado
- Camadas visuais exclusivas do Místico Moderno já implantadas permanecem isoladas por `data-layout="mistico-moderno"`.
- Identidade: fundo noturno sofisticado, índigo/azul-noturno/violeta, esmeralda controlada, dourado/âmbar como acento e marfim para leitura.
- Reintegração da Vida continua interrompendo fala e áudio global ao abrir.
- Pagamento continua exigindo confirmação server-side (`/api/payment/confirm` com `status === 'paid'`) antes de atualizar o perfil.
- Não foi feita recoloração global nem alteração nos Estilos 1–3.

### Pendências funcionais confirmadas na origem
1. **Escolha explícita dos quatro estilos na entrada**
   - `src/App.tsx` ainda monta `LayoutChoiceModal` somente quando `!userProfile.visualLayout`.
   - Uma preferência persistida continua podendo pular a escolha explícita.
   - Correção necessária: preferência salva deve servir apenas como pré-seleção; a sessão precisa de confirmação explícita antes da aplicação.

2. **Ajustes > Aparência aplica antes de confirmar**
   - Os cards de `OFFICIAL_LAYOUTS` ainda chamam `saveProfile({ ...userProfile, visualLayout: layout.id })` diretamente no clique.
   - Correção necessária: clique altera somente estado temporário de prévia; persistência ocorre apenas no CTA de confirmação.

3. **Áudio global durante Arcanjo**
   - O efeito global pausa para `activeSessionDay` e `showPersonalJourney`, mas ainda não inclui `showArcanjoView`; o desbloqueio por gesto repete a mesma condição.
   - Correção necessária: incluir `!showArcanjoView` no `shouldPlay` e `showArcanjoView` nas dependências, preservando o dono local do synth/Solfeggio e a proteção já aprovada da Reintegração.

4. **Pagamento / Prática Individual — herança de PIX manual**
   - `src/components/SpecificTreatmentModal.tsx` ainda possui `handleCopyPix()` que copia `evertonpiceni@gmail.com` e é disparado ao selecionar PIX.
   - Isso contradiz a decisão vigente de usar checkout InfinitePay para Práticas Específicas.
   - Correção necessária: remover a cópia/chave PIX manual; selecionar PIX deve apenas definir o método e seguir para `/api/payment/create-checkout`.

5. **Voz**
   - O repositório possui `OFFICIAL_PROTOCOL_VOICE_ID = mJqP14JQFEK0PojR5lfV` identificado tecnicamente como Marianne — Meditação, enquanto há caminhos legados com aliases antigos.
   - Não substituir automaticamente enquanto não houver comprovação de que esse ID corresponde à decisão de voz aprovada mais recente. Evitar reintroduzir voz robótica/fallback legado.

## Correção segura nesta rodada
Nenhuma alteração de comportamento foi gravada em `src/App.tsx` porque a ação de escrita disponível substitui o arquivo inteiro e a leitura integral do arquivo central é truncada. Uma escrita parcial arriscaria apagar código aprovado. Também não foi aplicado workaround por CSS/DOM para mascarar estado React.

A herança de PIX manual foi localizada e registrada como correção prioritária; a mesma limitação de substituição integral impede editar com segurança o arquivo completo retornado de forma truncada nesta execução.

## Próxima intervenção atômica
1. Corrigir confirmação de estilo na entrada.
2. Corrigir prévia + CTA em Ajustes > Aparência.
3. Incluir Arcanjo na exclusão do áudio global.
4. Remover `handleCopyPix()` e qualquer cópia de chave manual da Prática Individual, mantendo checkout InfinitePay.
5. Rodar build/testes e validar desktop/mobile: seletor, header, Diário, player, Solfeggio, Arcanjo, Reintegração, animações e checkout.

## Estado da rodada
- **Corrigido/documentado:** escopo e causa das quatro regressões estruturais prioritárias estão consolidados sem alterar áreas congeladas.
- **Preservado:** identidade Místico Moderno, logo sutil, Reintegração, pagamento server-side e isolamento dos demais estilos.
- **Pendente:** alterações atômicas de origem listadas acima + build/validação executada.