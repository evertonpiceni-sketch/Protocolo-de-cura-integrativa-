import re

with open('server.ts', 'r') as f:
    content = f.read()

global_error = """
  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Erro interno:", err.message);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
  });

  app.listen(PORT, "0.0.0.0", () => {"""

content = content.replace('  app.listen(PORT, "0.0.0.0", () => {', global_error)

with open('server.ts', 'w') as f:
    f.write(content)
