import { setStableText } from './stableDomText';

const HOME_PATCH_STYLE_ID = 'ep-natural-sereno-home-approved-model';

function addStyles() {
  if (document.getElementById(HOME_PATCH_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = HOME_PATCH_STYLE_ID;
  style.textContent = `
    :root[data-layout="natural-sereno"] .ns-app[data-ns-screen="home"] {
      background: #FAF7F2;
    }

    :root[data-layout="natural-sereno"] .ns-app[data-ns-screen="home"]::before {
      background: rgba(250,247,242,.28);
    }

    :root[data-layout="natural-sereno"] .ns-home-scene {
      position: relative;
      overflow: hidden;
    }

    :root[data-layout="natural-sereno"] .ns-home-scene > * {
      position: relative;
      z-index: 1;
    }



    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-home-scene > .ns-gold {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ns-home-content {
      position: relative;
      z-index: 4;
      padding: 0 16px 28px !important;
      background: linear-gradient(180deg,#FAF7F2 0%,#F3EDE4 70%,#FAF7F2 100%);
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-current-day {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card {
      margin: 0 0 18px !important;
      padding: 24px 22px 22px !important;
      border-radius: 28px !important;
      border: 1px solid rgba(200,157,82,.28) !important;
      background: rgba(255,253,248,.96) !important;
      box-shadow: 0 18px 42px rgba(67,52,39,.08) !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card > small {
      display: inline-block;
      margin-bottom: 7px;
      color: #8F631E !important;
      font-size: 10px !important;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card h2 {
      color: #2A2421 !important;
      font-size: 30px !important;
      line-height: 1.02 !important;
      margin: 0 0 12px !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card p {
      color: #6B625B !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      margin: 0 0 18px !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card .ns-gold {
      min-height: 56px !important;
      border-radius: 18px !important;
      background: linear-gradient(180deg,#E2B96B 0%,#C89D52 100%) !important;
      border: 1px solid rgba(168,126,55,.58) !important;
      color: #2A2421 !important;
      box-shadow: 0 9px 20px rgba(67,52,39,.10) !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day {
      position: relative;
      min-height: 220px !important;
      margin: 0 0 18px !important;
      padding: 22px !important;
      overflow: hidden;
      border-radius: 28px !important;
      border: 1px solid rgba(200,157,82,.30) !important;
      background: #FFFDF8 !important;
      box-shadow: 0 18px 44px rgba(67,52,39,.08) !important;
      color: #2A2421 !important;
      align-items: flex-start !important;
      flex-wrap: wrap;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day > img {
      width: 76px !important;
      height: 76px !important;
      border-radius: 50% !important;
      border: 2px solid rgba(200,157,82,.42);
      box-shadow: 0 8px 22px rgba(67,52,39,.10);
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day .ns-row-copy {
      color: #2A2421 !important;
      padding-right: 8px;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day .ns-row-copy small {
      color: #8F631E !important;
      font-size: 10px !important;
      text-transform: uppercase;
      letter-spacing: .12em;
      font-weight: 700;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day .ns-row-copy strong {
      color: #2A2421 !important;
      font-family: 'Cormorant Garamond',Georgia,serif;
      font-size: 27px !important;
      line-height: 1 !important;
      font-weight: 500 !important;
      margin-top: 6px;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day > svg {
      color: #6F7B55 !important;
      margin-left: auto;
      margin-top: 8px;
    }

    :root[data-layout="natural-sereno"] .ep-home-continue {
      flex-basis: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      margin-top: 14px;
      border-radius: 18px;
      color: #2A2421;
      font-family: 'Lora',Georgia,serif;
      font-size: 15px;
      background: linear-gradient(180deg,#E2B96B,#C89D52);
      border: 1px solid rgba(168,126,55,.58);
      box-shadow: 0 9px 20px rgba(67,52,39,.10);
    }

    :root[data-layout="natural-sereno"] .ep-home-moment-card {
      border-radius: 22px !important;
      padding: 16px !important;
      margin-bottom: 16px !important;
      background: rgba(255,253,248,.96) !important;
      border-color: rgba(182,139,54,.26) !important;
      box-shadow: 0 10px 26px rgba(70,54,25,.07) !important;
    }

    :root[data-layout="natural-sereno"] .ns-insight {
      position: relative;
      overflow: hidden;
      margin: 18px 0 !important;
      padding: 24px 20px 22px !important;
      border: 1px solid rgba(200,157,82,.24) !important;
      border-radius: 24px !important;
      background:
        linear-gradient(90deg,rgba(250,247,242,.92),rgba(250,247,242,.84)),
        var(--ns-valley) center 72% / cover no-repeat !important;
      box-shadow: 0 12px 30px rgba(67,52,39,.08) !important;
    }

    :root[data-layout="natural-sereno"] .ns-insight > small {
      color: #8F631E !important;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    :root[data-layout="natural-sereno"] .ns-insight h2 {
      display: none;
    }

    :root[data-layout="natural-sereno"] .ns-insight p {
      display: none;
    }

    :root[data-layout="natural-sereno"] .ns-insight blockquote {
      margin: 16px 0 0 !important;
      border: 0 !important;
      padding: 0 !important;
      text-align: center;
      color: #2A2421 !important;
      font-family: 'Cormorant Garamond',Georgia,serif;
      font-size: 24px !important;
      line-height: 1.22 !important;
      font-style: normal !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-quicklinks {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin: 18px 0 22px;
    }

    :root[data-layout="natural-sereno"] .ep-home-quicklinks button {
      min-height: 104px;
      padding: 14px 8px 12px;
      border: 1px solid rgba(200,157,82,.24);
      border-radius: 18px;
      background: rgba(255,253,248,.94);
      color: #2A2421;
      box-shadow: 0 8px 22px rgba(67,52,39,.06);
    }

    :root[data-layout="natural-sereno"] .ep-home-quicklinks button:disabled {
      opacity: .55;
      cursor: default;
    }

    :root[data-layout="natural-sereno"] .ep-home-quicklinks strong {
      display: block;
      font-size: 12px;
      line-height: 1.2;
      margin-bottom: 6px;
    }

    :root[data-layout="natural-sereno"] .ep-home-quicklinks small {
      display: block;
      color: #6B625B;
      font-size: 9px;
      line-height: 1.35;
    }

    :root[data-layout="natural-sereno"] .ep-home-closing {
      margin: 30px -16px 0 !important;
      padding: 34px 26px 40px !important;
      border: 0 !important;
      border-radius: 0 !important;
      text-align: center;
      background: linear-gradient(180deg,#FAF7F2 0%,#F3EDE4 100%) !important;
      box-shadow: none !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-closing h2 {
      color: #2A2421 !important;
      font-size: 27px !important;
      font-weight: 400 !important;
      margin: 0 0 8px !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-closing p {
      color: #8F631E !important;
      font-family: 'Cormorant Garamond',Georgia,serif;
      font-size: 27px !important;
      line-height: 1.1 !important;
      margin: 0 !important;
    }

    :root[data-layout="natural-sereno"] [data-ep-home-secondary="true"] {
      display: none !important;
    }

    @media (max-width: 390px) {
      :root[data-layout="natural-sereno"] .ep-home-quicklinks { grid-template-columns: repeat(2, minmax(0,1fr)); }
      :root[data-layout="natural-sereno"] .ep-home-quicklinks button { min-height: 88px; }
    }
  `;
  // Restore the approved Natural Sereno visual while retaining current journey gates.
  style.textContent += `
    :root[data-layout="natural-sereno"] .ns-home-scene {
      min-height: clamp(520px,72vh,700px) !important;
      padding: 25px 18px 17px !important;
      background: linear-gradient(180deg, rgba(250,247,242,.96), rgba(250,247,242,.78) 30%, transparent 60%), var(--ns-valley) center 35% / cover no-repeat !important;
      color: #2A2421;
    }
    @media (max-width: 767px) {
      :root[data-layout="natural-sereno"] .ns-home-scene {
        background-position: center, center 38% !important;
      }
    }
    :root[data-layout="natural-sereno"] .ns-home-scene::after { display: none; }
    :root[data-layout="natural-sereno"] .ns-home-menu {
      position: absolute !important;
      z-index: 2 !important;
      top: 11px;
      right: 12px;
      left: auto;
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      color: #6B4E2E !important;
      background: rgba(250,247,242,.88) !important;
      border: 1px solid rgba(200,157,82,.30) !important;
      box-shadow: 0 8px 22px rgba(67,52,39,.08);
      backdrop-filter: blur(8px);
    }
    :root[data-layout="natural-sereno"] .ns-greeting { max-width: 350px !important; padding-top: 0; text-shadow: none; }
    :root[data-layout="natural-sereno"] .ns-greeting h1 { color: #2A2421 !important; font-size: 35px !important; font-weight: 700 !important; line-height: 1.15 !important; margin-bottom: 7px !important; letter-spacing: normal !important; }
    :root[data-layout="natural-sereno"] .ns-greeting p {
      color: #2A2421 !important;
      font-family: 'Lora',Georgia,serif;
      font-size: 15px !important;
      line-height: 1.55 !important;
      margin: 3px 0 !important;
    }
    :root[data-layout="natural-sereno"] .ns-home-message { display: block !important; color: #2A2421; }
    :root[data-layout="natural-sereno"] .ns-home-message span { font-family: 'Lora', Georgia, serif; }
    :root[data-layout="natural-sereno"] .ns-home-scene > .ns-gold {
      margin-top: 0;
      width: 100% !important;
      align-self: center;
      min-height: 70px !important;
      font-size: 20px;
      border-radius: 18px !important;
      background: linear-gradient(180deg,#E2B96B 0%,#C89D52 100%) !important;
      color: #2A2421 !important;
      border: 1px solid rgba(168,126,55,.58) !important;
      box-shadow: 0 9px 20px rgba(67,52,39,.10) !important;
    }
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-home-content,
    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-home-content { margin-top: 0 !important; padding-top: 13px !important; }
    @media (min-width: 768px) {
      :root[data-layout="natural-sereno"] .ns-home-scene { min-height: clamp(480px,62vh,680px) !important; padding: 24px !important; }
      :root[data-layout="natural-sereno"] .ns-home-scene > .ns-gold { min-height: 52px !important; font-size: 17px; }
    }
    @media (max-height: 700px) and (max-width: 767px) {
      :root[data-layout="natural-sereno"] .ns-home-scene { min-height: 560px !important; }
    }
  `;
  document.head.appendChild(style);
}

function textOf(element: Element | null) {
  return (element?.textContent || '').replace(/\s+/g, ' ').trim();
}

function clickByText(root: ParentNode, text: string) {
  const button = Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(item => textOf(item).includes(text));
  button?.click();
}

function openProfile(root: HTMLElement) {
  const menuButton = root.querySelector<HTMLButtonElement>('.ns-home-menu');
  menuButton?.click();
  window.setTimeout(() => {
    const activeRoot = document.querySelector<HTMLElement>('.ns-app');
    if (activeRoot) clickByText(activeRoot, 'Meu Perfil');
  }, 0);
}

function addQuickLinks(root: HTMLElement, hasAnamnesis: boolean) {
  const content = root.querySelector<HTMLElement>('.ns-home-content');
  if (!content) return;
  let quick = content.querySelector<HTMLElement>('.ep-home-quicklinks');
  if (!quick) {
    quick = document.createElement('nav');
    quick.className = 'ep-home-quicklinks';
    quick.setAttribute('aria-label', 'Acessos rápidos');
    quick.innerHTML = `
      <button type="button" data-ep-quick="journey"><strong>Jornada</strong><small>Meu progresso do dia a dia</small></button>
      <button type="button" data-ep-quick="community"><strong>Comunidade</strong><small>Troque experiências com segurança</small></button>
      <button type="button" data-ep-quick="space"><strong>Meu Espaço</strong><small>Diário e acompanhamento</small></button>
      <button type="button" data-ep-quick="contact"><strong>Fale conosco</strong><small>Estamos aqui por você</small></button>`;

    quick.querySelector<HTMLButtonElement>('[data-ep-quick="journey"]')?.addEventListener('click', () => {
      if (!root.classList.contains('ep-home-has-anamnesis')) return;
      const dock = document.querySelector<HTMLElement>('.ns-dock');
      if (dock) clickByText(dock, 'Jornada');
    });
    quick.querySelector<HTMLButtonElement>('[data-ep-quick="community"]')?.addEventListener('click', () => {
      const dock = document.querySelector<HTMLElement>('.ns-dock');
      if (dock) clickByText(dock, 'Comunidade');
    });
    quick.querySelector<HTMLButtonElement>('[data-ep-quick="space"]')?.addEventListener('click', () => openProfile(root));
    quick.querySelector<HTMLButtonElement>('[data-ep-quick="contact"]')?.addEventListener('click', () => {
      const hiddenContact = Array.from(content.querySelectorAll<HTMLButtonElement>('button')).find(item => textOf(item).includes('Fale conosco'));
      hiddenContact?.click();
    });

    const closing = Array.from(content.querySelectorAll<HTMLElement>('.ns-editorial-card')).find(card => textOf(card.querySelector('h2')).includes('Você já fez muito por você'));
    if (closing) content.insertBefore(quick, closing);
    else content.appendChild(quick);
  }


}

function applyHomeModel() {
  const root = document.querySelector<HTMLElement>('.ns-app[data-ns-screen="home"]');
  if (!root) return;

  addStyles();

  const anamnesisCard = Array.from(root.querySelectorAll<HTMLElement>('.ns-editorial-card')).find(card => textOf(card.querySelector('h2')).includes('Como você está de verdade'));
  const hasAnamnesis = !anamnesisCard;
  root.classList.toggle('ep-home-has-anamnesis', hasAnamnesis);
  root.classList.toggle('ep-home-needs-anamnesis', !hasAnamnesis);

  // Journey-state patch owns contextual greeting copy.

  const heroCta = root.querySelector<HTMLButtonElement>('.ns-home-scene > .ns-gold');
  if (heroCta && hasAnamnesis) {
    for (const node of Array.from(heroCta.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) setStableText(node, 'Continuar minha jornada ');
    }
  }

  if (anamnesisCard) {
    anamnesisCard.classList.add('ep-home-anamnesis-card');
    const small = anamnesisCard.querySelector('small');
    const paragraph = anamnesisCard.querySelector('p');
    if (small) setStableText(small, 'Anamnese Energética');
    if (paragraph) setStableText(paragraph, 'Responda algumas perguntas para entendermos seu momento e indicar o melhor caminho para você.');
  }

  const currentDay = root.querySelector<HTMLElement>('.ns-current-day');
  if (currentDay && hasAnamnesis && !currentDay.querySelector('.ep-home-continue')) {
    const continueLabel = document.createElement('span');
    continueLabel.className = 'ep-home-continue';
    continueLabel.textContent = 'Continuar minha jornada';
    currentDay.appendChild(continueLabel);
  }

  if (hasAnamnesis) {
    const content = root.querySelector<HTMLElement>('.ns-home-content');
    const rows = content ? Array.from(content.querySelectorAll<HTMLElement>(':scope > .ns-row')) : [];
    const momentCard = rows.find(row => !row.classList.contains('ns-current-day') && !textOf(row).includes('Menu') && !textOf(row).includes('Fale conosco'));
    momentCard?.classList.add('ep-home-moment-card');
  }

  const closing = Array.from(root.querySelectorAll<HTMLElement>('.ns-editorial-card')).find(card => textOf(card.querySelector('h2')).includes('Você já fez muito por você'));
  closing?.classList.add('ep-home-closing');

  for (const button of Array.from(root.querySelectorAll<HTMLButtonElement>('.ns-home-content > button.ns-row'))) {
    const label = textOf(button);
    if (label.startsWith('Menu') || label.startsWith('Fale conosco')) button.setAttribute('data-ep-home-secondary', 'true');
  }

  addQuickLinks(root, hasAnamnesis);
}

let queued = false;
function queueApply() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    applyHomeModel();
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queueApply, { once: true });
  else queueApply();

  new MutationObserver(queueApply).observe(document.documentElement, { childList: true, subtree: true });
}
