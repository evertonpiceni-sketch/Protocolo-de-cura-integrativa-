import re

with open('src/components/ProfileSetup.tsx', 'r') as f:
    content = f.read()

old_func = """  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanLogin = logLogin.trim().toLowerCase();
    if (!cleanLogin) {
      setError('Por favor, preencha o campo de login.');
      return;
    }
    if (!logPassword) {
      setError('Por favor, preencha sua senha.');
      return;
    }

    const accounts = getAccounts();
    const account = accounts.find(acc => (acc.login === cleanLogin || acc.email.toLowerCase() === cleanLogin) && acc.password === logPassword);

    if (!account) {
      setError('Login ou senha incorretos.');
      return;
    }

    setSuccessMsg(`Bem-vindo de volta, ${account.fullName}!`);
    setTimeout(() => {
      onComplete(account);
    }, 1000);
  };"""

new_func = """  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanLogin = logLogin.trim().toLowerCase();
    if (!cleanLogin) {
      setError('Por favor, preencha o campo de login.');
      return;
    }
    if (!logPassword) {
      setError('Por favor, preencha sua senha.');
      return;
    }

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
      
      const account: UserAccount = {
        login: data.user.login,
        email: data.user.email || '',
        password: '',
        fullName: data.user.fullName || '',
        profile: data.user.profile,
        progress: data.user.progress || [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        role: data.user.role || 'user'
      };
      
      setSuccessMsg(`Bem-vindo de volta, ${account.fullName}!`);
      setTimeout(() => {
        onComplete(account);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Erro de conexão ao processar o login.');
    }
  };"""

content = content.replace(old_func, new_func)

with open('src/components/ProfileSetup.tsx', 'w') as f:
    f.write(content)
