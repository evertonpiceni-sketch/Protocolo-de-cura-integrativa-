# Auditoria completa — Estilo 1 | Natural Sereno

Data: 2026-10-13
Branch: `audit/natural-sereno-infinitepay-2026-10-13`
PR: #36

## Regra aplicada

O Natural Sereno aprovado foi preservado. Esta auditoria não redesenha o produto, não substitui o layout por versões antigas e não promove a branch para produção antes da validação.

## Inconsistências encontradas e tratadas

1. Checkout do servidor desativado com 503 e interface sem InfinitePay.
2. Acesso avulso de 7 dias aparecendo por R$ 15,00 em vez de R$ 25,00.
3. Ausência do acesso avulso de 21 dias por R$ 50,00 na tela principal de planos.
4. Chave PIX pessoal exposta/copiável em planos, Numerologia e prática individual.
5. Preço fixo antigo de R$ 70,00 na prática individual apesar de ciclos com valores diferentes.
6. Cupons pagos do PRO calculados apenas no cliente.
7. Retorno do navegador sem revalidação dedicada do pagamento.
8. Card 7/21 dias não preservando o plano escolhido ao abrir o checkout.
9. Preview podendo usar a URL de produção como retorno/webhook na ausência de `PUBLIC_APP_URL` específico.
10. Preview e produção compartilhando o mesmo namespace Redis padrão (`cura_integrada:database:v1`), o que permitiria que um teste na branch gravasse pedido/usuário no conjunto de produção.

## Correções realizadas

- InfinitePay configurada com o identificador oficial `evertonterapeutareiki`.
- 7 dias = R$ 25,00; 21 dias = R$ 50,00.
- Valor da assinatura definido no servidor, não confiado ao valor enviado pela interface.
- Pedido pendente com `order_nsu` próprio persistido antes do checkout.
- `payment_check` obrigatório e comparação do `amount` recebido com o valor esperado antes da liberação.
- Webhook revalidado com a InfinitePay; payload recebido sozinho não é considerado prova de pagamento.
- Retorno incompleto, pagamento inválido ou pendente não libera acesso.
- Tela de retorno dedicada criada para confirmação segura.
- Expiração de acesso conforme período comprado.
- Chaves PIX pessoais removidas das telas alteradas.
- Numerologia e prática individual encaminhadas ao checkout seguro.
- Preço fixo antigo da prática individual neutralizado nos rótulos exibidos.
- Cupons pagos que existiam apenas no cliente removidos do modal PRO; descontos da prática individual são recalculados e validados no servidor.
- Seleção 7/21/planos do guia preservada por sessão e reaplicada ao abrir o seletor.
- `PUBLIC_APP_URL` criado somente para o target `preview` e somente para a branch desta auditoria, apontando para o alias estável da própria branch.
- `UPSTASH_DB_KEY` criado somente para o target `preview` e somente para a branch desta auditoria, usando namespace separado: `cura_integrada:database:audit-natural-sereno-2026-10-13`.
- Nenhuma variável de produção foi alterada.

## Reauditoria executada

Validações em sandbox isolado:

- TypeScript (`npm run lint`): aprovado;
- testes (`npm test`): 32/32 aprovados, 0 falhas;
- build de produção (`npm run build`): aprovado;
- `git diff --check`: aprovado;
- servidor local `/api/health`: HTTP 200;
- endpoint local de checkout sem autenticação: HTTP 401, fail-closed.

GitHub Actions `Security Audit` executado novamente após a correção de seleção de plano e concluído com sucesso, incluindo `npm audit`, TypeScript, regressão, build, verificação dos entrypoints, padrões de segredos, JWT fail-closed, criação de administrador, smoke tests e pagamentos fail-closed.

Vercel:

- preview da correção: READY;
- redeploy posterior ao `PUBLIC_APP_URL`: READY;
- redeploy posterior ao namespace Redis isolado: READY;
- alias estável da branch: `protocolodecuraintegrativa-git-audi-2509fc-evertonpiceni-sketch.vercel.app`;
- home no alias: HTTP 200 / `noindex`;
- `payment-return.html`: HTTP 200 / `noindex`;
- `/api/health`: HTTP 200.

A documentação oficial atual da InfinitePay confirma que preços e `amount` são expressos em centavos e que `payment_check` retorna `amount` no mesmo padrão, coerente com a validação implantada.

## Novos achados de robustez — ainda não fechados

1. **Seleção PIX/cartão na interface:** a documentação do Checkout Integrado indica que o comprador escolhe Pix ou cartão dentro da própria InfinitePay. O payload documentado de criação do link não oferece parâmetro de pré-seleção. Os botões atuais do app registram uma preferência interna, mas não controlam o método final do checkout. A interface deve ser ajustada para não sugerir que controla essa escolha.
2. **Valor personalizado da prática individual:** a tela ainda permite habilitar valor personalizado, porém o servidor aceita somente os valores canônicos do ciclo menos cupons reconhecidos. Hoje uma tentativa de valor livre termina em rejeição do servidor. É necessário remover/adequar esse controle ou criar um fluxo seguro de valor previamente autorizado; não se deve confiar em preço arbitrário enviado pelo cliente.
3. **Rate limiting do pagamento na Vercel:** os endpoints tratados diretamente por `api/index.ts` não passam pelo `apiLimiter` do Express local. Uma conta autenticada pode tentar criar muitos pedidos/links. Deve existir limitação específica antes da liberação em produção.
4. **Pedidos pendentes após falha externa:** o pedido é salvo como `pending` antes da chamada de criação de link. Se a InfinitePay falhar, o registro pode permanecer pendente indefinidamente. Deve ser marcado como falha/expirado ou limpo por política explícita.
5. **Servidor local:** `server.ts` continua deliberadamente fail-closed para pagamento após autenticação, enquanto a implementação real está no entrypoint Vercel `api/index.ts`. É dívida de paridade de desenvolvimento, não bypass de pagamento.

## Pendências externas antes de produção

1. **Criação de checkout real sem pagamento:** a tentativa automatizada desta auditoria foi bloqueada pela política de segurança da ferramenta antes de enviar credenciais descartáveis; portanto, não registrar como testado.
2. **Transação real InfinitePay:** não foi efetuada cobrança. Ainda é necessário validar PIX, cartão, retorno, webhook e `payment_check` em ambiente controlado.
3. **Taxas/parcelamento:** a configuração da conta InfinitePay deve estar em “Repassar taxas” se esta for a regra comercial escolhida. A documentação atual informa que essa configuração é feita nos meios de pagamento da InfinitePay; o código não deve inventar taxas.

## Estado de publicação

Nenhuma alteração desta auditoria foi mesclada ao `main` ou promovida para produção. A PR #36 permanece em rascunho. Os novos achados de robustez acima devem ser resolvidos antes do merge, além da validação externa do checkout.
