import fs from "node:fs";

const file = "server.ts";
let source = fs.readFileSync(file, "utf8");
const original = source;

source = source.replace(
  /const JWT_SECRET = process\.env\.JWT_SECRET \|\| [^;]+;/,
  'const JWT_SECRET = process.env.JWT_SECRET;\nif (!JWT_SECRET || JWT_SECRET.length < 32) {\n  throw new Error("JWT_SECRET must be configured and contain at least 32 characters.");\n}'
);

source = source.replace(
  /const role = db\.users\.length === 0 \? "admin" : "user";/,
  'const role = "user";'
);

source = source.replace(
  /contentSecurityPolicy: false, \/\/ Disabled for dev compatibility \(Vite WebSocket, iframes\)/,
  'contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false'
);

source = source.replace(
  /db\.users\[userIndex\]\.profile = \{\n\s*\.\.\.profile,\n\s*plan: db\.users\[userIndex\]\.plan,\n\s*subscriptionPlan: db\.users\[userIndex\]\.profile\.subscriptionPlan,\n\s*subscriptionExpiresAt: db\.users\[userIndex\]\.profile\.subscriptionExpiresAt,\n\s*\};/,
  'db.users[userIndex].profile = {\n        ...db.users[userIndex].profile,\n        ...profile,\n        plan: db.users[userIndex].plan,\n        subscriptionPlan: db.users[userIndex].profile.subscriptionPlan,\n        subscriptionExpiresAt: db.users[userIndex].profile.subscriptionExpiresAt,\n        proActiveSince: db.users[userIndex].profile.proActiveSince,\n      };'
);

source = source.replace(
  /\/\/ Endpoint para o frontend iniciar o pagamento[\s\S]*?app\.post\("\/api\/webhooks\/payment"/,
  '// Endpoint para iniciar pagamento: fail-closed until a real gateway is configured.\n  app.post("/api/payment/create-checkout", authenticate, apiLimiter, (_req: any, res: any) => {\n    return res.status(503).json({ error: "Pagamento ainda não está configurado." });\n  });\n\n  // Webhook: fail-closed until gateway signature verification is implemented.\n  app.post("/api/webhooks/payment"'
);

source = source.replace(
  /app\.post\("\/api\/webhooks\/payment"[\s\S]*?\n  \}\);\n\n  \/\/ Mantendo o endpoint legado provisoriamente[\s\S]*?\n  app\.post\("\/api\/user\/upgrade"[\s\S]*?\n  \}\);/,
  'app.post("/api/webhooks/payment", express.raw({ type: "application/json" }), (_req: any, res: any) => {\n    return res.status(503).json({ error: "Webhook de pagamento ainda não está configurado." });\n  });'
);

if (source.includes('"/api/user/upgrade"') || source.includes('"/mock-checkout"') || source.includes('mock_session_') || source.includes('super-secret-cura-21-dias-dev-key') || source.includes('db.users.length === 0 ? "admin"')) {
  throw new Error("Security hardening incomplete: unsafe payment/admin/JWT pattern remains in server.ts");
}

if (source === original) {
  throw new Error("Security hardening made no changes; source patterns may have changed.");
}

fs.writeFileSync(file, source);
console.log("Security hardening applied to server.ts");
