import re

with open('server.ts', 'r') as f:
    content = f.read()

admin_routes = """  app.get("/api/admin/status", authenticate, authenticateAdmin, (_req, res) => {
    res.json({ 
      geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "SUA_CHAVE_AQUI",
      elevenlabsConfigured: !!process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== "SUA_CHAVE_ELEVENLABS"
    });
  });

  app.get("/api/admin/users", authenticate, authenticateAdmin, (_req, res) => {
    const db = getDb();
    const usersList = db.users.map(u => ({
      login: u.login,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      plan: u.plan,
      profile: u.profile,
      progress: u.progress
    }));
    res.json({ users: usersList });
  });

  app.post("/api/admin/users/:login/plan", authenticate, authenticateAdmin, (req: any, res: any) => {
    const db = getDb();
    const { login } = req.params;
    const { plan, subscriptionPlan } = req.body;
    
    const user = db.users.find(u => u.login === login);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    
    user.plan = plan;
    user.profile.plan = plan;
    if (subscriptionPlan) user.profile.subscriptionPlan = subscriptionPlan;
    
    saveDb();
    res.json({ success: true });
  });"""

content = content.replace('  app.get("/api/admin/status", authenticate, authenticateAdmin, (_req, res) => {\n    res.json({ \n      geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "SUA_CHAVE_AQUI",\n      elevenlabsConfigured: !!process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== "SUA_CHAVE_ELEVENLABS"\n    });\n  });', admin_routes)

with open('server.ts', 'w') as f:
    f.write(content)

with open('src/components/AdminPanelModal.tsx', 'r') as f:
    content_admin = f.read()

new_admin_load = """  useEffect(() => {
    if (isOpen) {
      try {
        const savedAudios = localStorage.getItem(ADMIN_STORAGE_KEY_AUDIOS);
        if (savedAudios) setCustomAudios(JSON.parse(savedAudios));

        const savedCoupons = localStorage.getItem(ADMIN_STORAGE_KEY_COUPONS);
        if (savedCoupons) {
          setCoupons(JSON.parse(savedCoupons));
        } else {
          // Initialize default coupons
          const initialCoupons: CouponItem[] = [
            { code: 'VIP7', discountPercentage: 100, description: 'Acesso VIP 7 Dias Grátis', active: true, createdAt: new Date().toISOString() },
            { code: 'PICENI50', discountPercentage: 50, description: 'Desconto de 50% em qualquer plano', active: true, createdAt: new Date().toISOString() }
          ];
          setCoupons(initialCoupons);
          localStorage.setItem(ADMIN_STORAGE_KEY_COUPONS, JSON.stringify(initialCoupons));
        }

        // Fetch users from backend
        fetch('/api/admin/users')
          .then(res => res.json())
          .then(data => {
            if (data.users) {
              setAllAccounts(data.users);
            }
          })
          .catch(console.error);
          
      } catch (e) {
        console.error("Error loading admin data:", e);
      }
    }
  }, [isOpen]);"""

content_admin = re.sub(r'  useEffect\(\(\) => \{\n    if \(isOpen\) \{\n      try \{.*?\n      \} catch \(e\) \{\n        console\.error\("Error loading admin data:", e\);\n      \}\n    \}\n  \}, \[isOpen\]\);', new_admin_load, content_admin, flags=re.DOTALL)

with open('src/components/AdminPanelModal.tsx', 'w') as f:
    f.write(content_admin)
