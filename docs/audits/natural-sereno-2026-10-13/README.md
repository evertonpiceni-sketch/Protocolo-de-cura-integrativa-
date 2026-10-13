# Auditoria completa — Estilo 1 | Natural Sereno

Data: 2026-10-13
Branch: `audit/natural-sereno-infinitepay-2026-10-13`
PR: #36

## Regra aplicada

O Natural Sereno aprovado foi preservado. Esta auditoria não redesenha o produto, não substitui o layout por versões antigas e não promove a branch para produção antes da validação.

## Inconsistências encontradas

1. O checkout do servidor permanecia desativado com resposta 503 e a interface ainda não usava InfinitePay.
2. O acesso avulso de 7 dias aparecia por R$ 15,00, divergindo da decisão vigente de R$ 25,00.
3. O acesso avulso de 21 dias por R$ 50,00 não estava disponível na tela principal de planos.
4. Numerologia, guia de valores e prática individual ainda exibiam/copiavam `evertonpiceni@gmail.com` como chave PIX pessoal.
5. A prática individual ainda apresentava rótulo/preço fixo antigo de R$ 70,00 em trechos da interface/traduções, apesar de possuir ciclos com valores diferentes.
6. Cupons pagos do modal PRO eram calculados apenas no cliente; isso poderia apresentar um valor diferente do que o servidor deveria aceitar.
7. O retorno do navegador não possuía uma etapa dedicada para revalidar o pagamento antes da liberação.

## Correções realizadas

- InfinitePay configurada com o identificador oficial `evertonterapeutareiki`.
- Acesso avulso de 7 dias definido no servidor e interface como R$ 25,00.
- Acesso avulso de 21 dias definido no servidor e interface como R$ 50,00.
- O servidor passou a criar e persistir um pedido pendente com `order_nsu` próprio antes do checkout.
- O valor da assinatura é calculado no servidor; o preço enviado pela interface não é utilizado como fonte de verdade.
- A confirmação usa `payment_check` e compara o valor pago com o valor esperado antes de liberar acesso.
- O webhook também revalida a transação com a InfinitePay; seu payload não é aceito isoladamente como prova de pagamento.
- Pagamento pendente, inválido ou retorno incompleto permanece sem liberação.
- Foi criada uma tela de retorno que só apresenta sucesso após confirmação do servidor.
- O período de acesso passa a ter expiração conforme o produto adquirido.
- Chaves PIX pessoais foram removidas das telas alteradas; PIX/cartão são encaminhados ao checkout do provedor.
- Numerologia e prática individual passaram a usar o mesmo fluxo de confirmação segura.
- O preço fixo antigo da prática individual foi neutralizado nos rótulos exibidos.
- Cupons pagos que existiam apenas no cliente foram removidos do modal PRO; descontos da prática individual são recalculados e validados no servidor.

## Reauditoria executada

A branch foi implantada somente como preview da Vercel. O build de preview terminou com estado READY e a raiz respondeu HTTP 200, com `noindex`.

O GitHub Actions `Security Audit` concluiu com sucesso, incluindo:

- instalação de dependências;
- `npm audit`;
- TypeScript check;
- testes de regressão;
- build;
- verificação dos entrypoints Express/Vercel;
- busca por padrões comuns de segredos;
- validação fail-closed do JWT;
- validação de criação de administrador;
- smoke test de health/registro;
- verificação fail-closed dos endpoints de pagamento.

## Pendências reais antes de produção

1. **Pagamento real InfinitePay:** não foi efetuada cobrança real nesta auditoria. É necessário validar no ambiente da conta o checkout, PIX, cartão, eventual parcelamento/taxas, webhook e `payment_check` com uma transação real antes do merge para produção.
2. **Taxas/parcelamento:** a regra de que as taxas ficam com o cliente deve ser conferida no checkout/configuração da conta InfinitePay; o código não deve inventar ou simular taxas.
3. **CTA do guia de valores:** os cards avulsos abrem corretamente o seletor de planos, mas o callback atual do `App.tsx` não preserva o plano clicado como pré-seleção. O usuário ainda pode escolher 7/21 dias no seletor. Não é falha de cobrança, porém o texto do botão pode sugerir pré-seleção mais direta do que a ação atual.
4. **Servidor local de desenvolvimento:** o `server.ts` continua fail-closed (503) para pagamentos; a implementação InfinitePay está no entrypoint Vercel `api/index.ts`. Produção/preview utilizam este entrypoint. Se for desejada paridade total em `npm run dev`, a lógica deve ser extraída para módulo comum antes de substituir o bloqueio local.

## Estado de publicação

Nenhuma alteração desta auditoria foi mesclada ao `main` ou promovida para produção. A PR #36 permanece em rascunho enquanto as pendências externas acima não forem validadas.
