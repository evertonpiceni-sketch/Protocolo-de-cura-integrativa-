# Conferência de produção — Layout 1

Site: https://protocolo-de-cura-integrativa.vercel.app/

Código publicado: `46661dd` (auditoria/correções) e `9173f4d` (descrição da assinatura). Envio normal ao main, sem force push. Assets finais correspondem ao build local: `index-MkxuPuBF.js` e `index-BRN1mmNx.css`, ambos disponíveis por HTTPS.

## Evidência

- Abertura real, sem fixture de autenticação: cadastro/login renderizou, carregamento terminou, nenhum erro JavaScript ou overflow. API de saúde: 200 / `{"status":"ok"}`. Requisição sem sessão a `/api/auth/me`: 401 esperado.
- Primeira conferência: 20 estados × 3 larguras = 60 verificações, com navegação real por toque, nomes acessíveis, foco/Tab/Escape e rolagem. Cobriu Home, menu, Configurações, anamnese, carregamento lento, clipboard negado, Astral, Sistêmicas, áudio, prática individual, cursos em preparação, painel analítico, três estados do diário, Pausa Consciente, reflexão 4, oração e documentos legais.
- A revisão visual encontrou a descrição anual sob um selo mensal. Foi corrigida; nova conferência do selo **e** descrição mensal/anual passou em 6 verificações. Total: 21 estados distintos e 66 verificações executadas em produção.
- Player publicado: animação ativa; WAV real sintético, resposta atrasada, seis etapas, seek, pausa/retomada, volume, roteiro, página oculta/transição em segundo plano, Media Session, saída e liberação do Wake Lock passaram. Nenhum erro JavaScript.

[Resultado inicial](production/results-initial.json) · [Assinaturas após a correção](production/subscription-final-results.json) · [Abertura real final](production/guest-final.json) · [Assets finais](production/assets-final.json) · [Player](production/player-checks.json)

[Home](production/home-390.png) · [Player](production/player-after-390.png) · [Diário em 320 px](production/daily-diary-intention-320.png) · [Plano mensal final](production/settings-final-390.png) · [Plano anual final](production/settings-annual-final-390.png)

Os estados autenticados usam perfil sintético e APIs interceptadas, inclusive no host publicado; nenhuma compra, mensagem ou alteração administrativa real foi enviada. A abertura de visitante e a saúde do servidor foram verificadas com respostas reais. Bloqueio de tela e teclado físicos continuam fora da capacidade deste ambiente.

## Ambiente reutilizável

Build, tipos, testes e navegador estão operacionais. As instruções de `start_skill` foram ampliadas no rascunho do ambiente para repetir a auditoria e usar as credenciais Git existentes de forma segura. Isso salva instruções para revisão; não equivale à publicação da configuração do ambiente pela interface do produto.
