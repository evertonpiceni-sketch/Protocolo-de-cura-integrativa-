import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fail closed: never use a known JWT fallback secret.
content = content.replace(
    'const JWT_SECRET = process.env.JWT_SECRET || "super-secret-cura-21-dias-dev-key";',
    '''const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured and contain at least 32 characters.");
}'''
)

# Public registration must never create an administrator.
content = content.replace(
    'const role = db.users.length === 0 ? "admin" : "user";',
    'const role = "user";'
)
content = content.replace(
    '// Determine if it\'s first user to make them admin (optional, for safety we just set user)\n      const role = "user";',
    '// Public registration can never create an administrator.\n      const role = "user";'
)

# Do not let client synchronization overwrite server-controlled subscription fields.
old_sync = '''db.users[userIndex].profile = {
        ...profile,
        plan: db.users[userIndex].plan,
        subscriptionPlan: db.users[userIndex].profile.subscriptionPlan,
        subscriptionExpiresAt: db.users[userIndex].profile.subscriptionExpiresAt,
      };'''
new_sync = '''const currentProfile = db.users[userIndex].profile;
      db.users[userIndex].profile = {
        ...currentProfile,
        ...profile,
        plan: db.users[userIndex].plan,
        subscriptionPlan: currentProfile.subscriptionPlan,
        subscriptionExpiresAt: currentProfile.subscriptionExpiresAt,
        proActiveSince: currentProfile.proActiveSince,
      };'''
content = content.replace(old_sync, new_sync)

# Payment activation must fail closed until a real gateway is configured and verified.
start = content.find('  // Arquitetura de Pagamentos / Webhook (Conformidade Comercial)')
end = content.find('  app.post("/api/anamnese"', start)
if start != -1 and end != -1:
    payment_block = '''  // Payment endpoints are fail-closed until a real gateway and signed webhook are configured.
  app.post("/api/payment/create-checkout", authenticate, apiLimiter, (_req: any, res: any) => {
    if (!process.env.PAYMENT_PROVIDER) {
      return res.status(503).json({ error: "Pagamento ainda não está configurado." });
    }
    return res.status(501).json({ error: "Integração de checkout do gateway ainda precisa ser configurada." });
  });

  app.post("/api/webhooks/payment", express.raw({ type: 'application/json' }), (_req: any, res: any) => {
    return res.status(503).json({ error: "Webhook de pagamento ainda não está configurado." });
  });

  // /api/user/upgrade was intentionally removed. PRO access must only be granted
  // after a verified payment webhook updates the server-side subscription state.

'''
    content = content[:start] + payment_block + content[end:]

# Harden cookie handling consistently.
content = content.replace(
    'const PORT = 3000;',
    'const PORT = Number(process.env.PORT || 3000);\n  const isProduction = process.env.NODE_ENV === "production";'
)
content = content.replace(
    'contentSecurityPolicy: false, // Disabled for dev compatibility (Vite WebSocket, iframes)',
    'contentSecurityPolicy: isProduction ? undefined : false,'
)
content = content.replace(
    'secure: process.env.NODE_ENV === "production", sameSite: "lax"',
    'secure: isProduction, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000, path: "/"'
)

# Clear auth cookies with the same attributes used when setting them.
content = content.replace(
    'res.clearCookie("token");\n    res.json({ success: true });',
    'res.clearCookie("token", { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/" });\n    res.json({ success: true });'
)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Security hardening applied to server.ts')
