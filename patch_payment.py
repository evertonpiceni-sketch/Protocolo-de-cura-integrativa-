import re

with open('server.ts', 'r') as f:
    content = f.read()

payment_architecture = """  // Arquitetura de Pagamentos / Webhook (Conformidade Comercial)
  // TODO: Integrar com Stripe/Pagar.me
  
  // Endpoint para o frontend iniciar o pagamento
  app.post("/api/payment/create-checkout", authenticate, apiLimiter, (req: any, res: any) => {
    const { planId } = req.body;
    // Em produção, isso chamaria o Stripe API para criar uma sessão
    // stripe.checkout.sessions.create({...})
    res.json({ checkoutUrl: "/mock-checkout", sessionId: "mock_session_" + Date.now() });
  });

  // Webhook seguro que realmente libera o plano (Chamado pelo gateway de pagamento)
  app.post("/api/webhooks/payment", express.raw({ type: 'application/json' }), (req: any, res: any) => {
    // 1. Validar a assinatura do webhook (ex: stripe.webhooks.constructEvent)
    // const signature = req.headers['stripe-signature'];
    
    // Simulação do payload do webhook
    const event = req.body; 
    // if (event.type === 'checkout.session.completed') { ... liberar acesso ... }

    res.json({ received: true });
  });

  // Mantendo o endpoint legado provisoriamente para manter o protótipo funcional,
  // MAS em produção ele deve ser REMOVIDO e a lógica movida para o Webhook acima.
  app.post("/api/user/upgrade", authenticate, (req: any, res: any) => {
    const { planId, paymentMethod, price } = req.body;
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === req.userId);
    if (userIndex === -1) return res.status(404).json({ error: "Usuário não encontrado." });
    
    db.users[userIndex].plan = "pro";
    db.users[userIndex].profile.plan = "pro";
    db.users[userIndex].profile.subscriptionPlan = planId;
    db.users[userIndex].profile.proActiveSince = new Date().toISOString();
    
    const expires = new Date();
    if (planId.includes('7d')) expires.setDate(expires.getDate() + 7);
    else if (planId === 'mensal') expires.setMonth(expires.getMonth() + 1);
    else if (planId === 'trimestral') expires.setMonth(expires.getMonth() + 3);
    else if (planId === 'semestral') expires.setMonth(expires.getMonth() + 6);
    else if (planId === 'anual') expires.setFullYear(expires.getFullYear() + 1);
    
    db.users[userIndex].profile.subscriptionExpiresAt = expires.toISOString();
    saveDb();
    
    res.json({ success: true, user: db.users[userIndex] });
  });"""

content = re.sub(r'  app\.post\("/api/user/upgrade", authenticate, \(req: any, res: any\) => \{.*?\n  \}\);', payment_architecture, content, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(content)
