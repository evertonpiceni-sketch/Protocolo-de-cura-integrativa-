const installNaturalSerenoPublicCatalogGuard = () => {
  if (typeof document === 'undefined') return;

  const cleanPublicCatalog = () => {
    const root = document.querySelector<HTMLElement>('.ns-app');
    if (!root) return;

    for (const element of Array.from(root.querySelectorAll<HTMLElement>('button, a, .ns-row'))) {
      const text = (element.textContent || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');

      // A Biblioteca Integrativa é acervo privado do Everton e nunca deve aparecer na experiência pública.
      // Proteção e Presença / Jornada de São Miguel é uma rota antiga e não faz parte do catálogo canônico atual.
      if (text.includes('biblioteca integrativa') || text.startsWith('proteção e presença')) {
        element.remove();
      }
    }
  };

  cleanPublicCatalog();

  const observer = new MutationObserver(() => cleanPublicCatalog());
  observer.observe(document.documentElement, { childList: true, subtree: true });
};

installNaturalSerenoPublicCatalogGuard();

export {};
