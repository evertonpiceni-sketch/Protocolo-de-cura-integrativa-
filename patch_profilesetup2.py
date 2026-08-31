import re

with open('src/components/ProfileSetup.tsx', 'r') as f:
    content = f.read()

# Replace handleLogin logic to use backend
old_handlelogin = """  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!logLogin || !logPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    const cleanLogin = logLogin.trim().toLowerCase();
    
    const savedAccounts = localStorage.getItem('cura_integrada_accounts_v1');
    if (!savedAccounts) {
      setError('Nenhuma conta encontrada. Por favor, cadastre-se primeiro.');
      return;
    }
    
    try {
      const accounts: UserAccount[] = JSON.parse(savedAccounts);
      const account = accounts.find(acc => (acc.login === cleanLogin || acc.email.toLowerCase() === cleanLogin) && acc.password === logPassword);
      
      if (!account) {
        setError('Credenciais inválidas. Verifique seu login/e-mail e senha.');
        return;
      }
      
      // Update last active
      account.lastActive = new Date().toISOString();
      const updatedAccounts = accounts.map(acc => acc.login === account.login ? account : acc);
      localStorage.setItem('cura_integrada_accounts_v1', JSON.stringify(updatedAccounts));
      
      onComplete(account);
    } catch (err) {
      console.error(err);
      setError('Erro ao processar o login.');
    }
  };"""

new_handlelogin = """  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!logLogin || !logPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    const cleanLogin = logLogin.trim().toLowerCase();
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: cleanLogin, password: logPassword })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Erro ao realizar login.');
        return;
      }
      
      // Create a compatible UserAccount object for onComplete
      const account: UserAccount = {
        login: data.user.login,
        email: data.user.email || '',
        password: '', // Hidden
        fullName: data.user.fullName || '',
        profile: data.user.profile,
        progress: data.user.progress || [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        role: data.user.role || 'user'
      };
      
      onComplete(account);
    } catch (err) {
      console.error(err);
      setError('Erro de conexão ao processar o login.');
    }
  };"""

content = content.replace(old_handlelogin, new_handlelogin)

with open('src/components/ProfileSetup.tsx', 'w') as f:
    f.write(content)
