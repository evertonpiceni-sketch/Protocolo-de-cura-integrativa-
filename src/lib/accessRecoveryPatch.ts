const SUPPORT_NUMBER = '5551982215296';
const SUPPORT_TEXT = encodeURIComponent('Olá, Éverton. Preciso de ajuda para acessar minha conta no Protocolo da Transformação.');

function patchAccessHelp() {
  if (typeof document === 'undefined') return;

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const forgotButton = Array.from(loginForm.querySelectorAll('button')).find(button =>
      button.textContent?.trim() === 'Esqueci minha senha' || button.textContent?.trim() === 'Ajuda para acessar'
    );
    if (forgotButton && forgotButton.textContent?.trim() !== 'Ajuda para acessar') {
      forgotButton.textContent = 'Ajuda para acessar';
      forgotButton.setAttribute('aria-label', 'Ajuda para acessar sua conta');
    }
  }

  const headings = Array.from(document.querySelectorAll('h3'));
  const recoveryHeading = headings.find(heading =>
    heading.textContent?.trim() === 'Recuperação de Senha' || heading.textContent?.trim() === 'Ajuda para acessar'
  );
  const panel = recoveryHeading?.parentElement;
  if (!panel) return;

  recoveryHeading!.textContent = 'Ajuda para acessar';
  const description = panel.querySelector('p');
  if (description) {
    description.textContent = 'A recuperação automática de senha ainda não está disponível. Para recuperar o acesso com segurança, fale diretamente com o suporte.';
  }

  if (!panel.querySelector('[data-access-support-link="true"]')) {
    const link = document.createElement('a');
    link.dataset.accessSupportLink = 'true';
    link.href = `https://wa.me/${SUPPORT_NUMBER}?text=${SUPPORT_TEXT}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Falar com o suporte no WhatsApp';
    link.className = 'inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#B88736] px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#8F631E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35';
    panel.appendChild(link);
  }
}

if (typeof document !== 'undefined') {
  const observer = new MutationObserver(patchAccessHelp);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patchAccessHelp, { once: true });
  else patchAccessHelp();
}
