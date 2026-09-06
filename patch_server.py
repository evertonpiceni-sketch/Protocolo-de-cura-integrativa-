import re
with open('server.ts', 'r') as f:
    content = f.read()
target = """if (process.env.VERCEL !== "1") {
  initializeDb().then(async () => {
    const db = getDb();
    if (!db.users.find(u => u.login === "admin")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      db.users.push({
        id: "admin-id", login: "admin", password: hashedPassword, fullName: "Administrador",
        email: "admin@cura.com", plan: "pro", role: "admin",
        profile: { name: "Administrador", email: "admin@cura.com", audioEnabled: true, bgMusicVolume: 0.5, bgMusicType: '528hz', plan: "pro" },
        progress: Array.from({ length: 21 }, (_, index) => ({ dayNumber: index + 1, completed: false }))
      });
      await saveDb();
      console.log("Admin account created: admin / admin123");
    }
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => console.log(`✨ Servidor do Protocolo de Cura Integrada rodando em http://localhost:${PORT}`));
  }).catch(err => {
    console.error("Failed to initialize database on startup:", err);
  });
}
export default app;"""
replacement = """if (process.env.VERCEL !== "1") {
  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => console.log(`✨ Servidor do Protocolo de Cura Integrada rodando em http://localhost:${PORT}`));
  initializeDb().then(async () => {
    const db = getDb();
    if (!db.users.find(u => u.login === "admin")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      db.users.push({
        id: "admin-id", login: "admin", password: hashedPassword, fullName: "Administrador",
        email: "admin@cura.com", plan: "pro", role: "admin",
        profile: { name: "Administrador", email: "admin@cura.com", audioEnabled: true, bgMusicVolume: 0.5, bgMusicType: '528hz', plan: "pro" },
        progress: Array.from({ length: 21 }, (_, index) => ({ dayNumber: index + 1, completed: false }))
      });
      await saveDb();
      console.log("Admin account created: admin / admin123");
    }
  }).catch(err => {
    console.error("Failed to initialize database on startup:", err);
  });
}
export default app;"""
content = content.replace(target, replacement)
with open('server.ts', 'w') as f:
    f.write(content)
