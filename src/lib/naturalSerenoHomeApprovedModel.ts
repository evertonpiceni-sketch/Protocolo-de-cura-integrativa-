import { setStableText } from './stableDomText';

const HOME_PATCH_STYLE_ID = 'ep-natural-sereno-home-approved-model';

function addStyles() {
  if (document.getElementById(HOME_PATCH_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = HOME_PATCH_STYLE_ID;
  style.textContent = `
    :root[data-layout="natural-sereno"] .ns-app[data-ns-screen="home"] {
      background: #fff9e8;
    }

    :root[data-layout="natural-sereno"] .ns-app[data-ns-screen="home"]::before {
      background: rgba(255,249,232,.30);
    }

    :root[data-layout="natural-sereno"] .ns-home-scene {
      min-height: 430px !important;
      padding: 26px 22px 24px !important;
      background:
        linear-gradient(180deg, rgba(7,59,43,.16) 0%, rgba(7,59,43,.06) 42%, rgba(7,59,43,.72) 100%),
        var(--ns-valley) center 56% / cover no-repeat !important;
      color: #fff9e8;
      position: relative;
      overflow: hidden;
    }

    :root[data-layout="natural-sereno"] .ns-home-scene::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 130px;
      background: linear-gradient(180deg, transparent, rgba(7,59,43,.78));
      pointer-events: none;
      z-index: 0;
    }

    :root[data-layout="natural-sereno"] .ns-home-scene > * {
      position: relative;
      z-index: 1;
    }

    :root[data-layout="natural-sereno"] .ns-home-menu {
      color: #f6df9a !important;
      border: 1px solid rgba(246,223,154,.34) !important;
      background: rgba(7,59,43,.62) !important;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 24px rgba(0,0,0,.14);
    }

    :root[data-layout="natural-sereno"] .ns-greeting {
      max-width: 78% !important;
      padding-top: 56px;
      text-shadow: 0 2px 12px rgba(0,0,0,.28);
    }

    :root[data-layout="natural-sereno"] .ns-greeting h1 {
      color: #fff9e8 !important;
      font-size: clamp(36px, 10vw, 52px) !important;
      line-height: .98 !important;
      font-weight: 500 !important;
      letter-spacing: -.035em !important;
      margin-bottom: 14px !important;
    }

    :root[data-layout="natural-sereno"] .ns-greeting p {
      color: rgba(255,249,232,.94) !important;
      font-size: 15px !important;
      line-height: 1.55 !important;
      margin: 0 0 10px !important;
    }

    :root[data-layout="natural-sereno"] .ns-home-message {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ns-home-scene > .ns-gold {
      margin-top: auto;
      width: min(100%, 330px) !important;
      align-self: center;
      min-height: 54px !important;
      border-radius: 999px !important;
      color: #fff9e8 !important;
      background: #073b2b !important;
      border: 1px solid rgba(246,223,154,.58) !important;
      box-shadow: 0 14px 30px rgba(3,31,22,.28), inset 0 1px rgba(255,255,255,.10) !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-home-scene > .ns-gold {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ns-home-content {
      position: relative;
      z-index: 4;
      padding: 0 16px 28px !important;
      background: linear-gradient(180deg, #fff9e8 0%, #fbf4e5 70%, #fff9e8 100%);
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-home-content,
    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-home-content {
      margin-top: -34px;
      padding-top: 0 !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-current-day {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card {
      margin: 0 0 18px !important;
      padding: 24px 22px 22px !important;
      border-radius: 28px !important;
      border: 1px solid rgba(182,139,54,.28) !important;
      background: rgba(255,250,238,.96) !important;
      box-shadow: 0 18px 42px rgba(82,60,22,.12) !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card > small {
      display: inline-block;
      margin-bottom: 7px;
      color: #9c7429 !important;
      font-size: 10px !important;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card h2 {
      color: #26372a !important;
      font-size: 30px !important;
      line-height: 1.02 !important;
      margin: 0 0 12px !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card p {
      color: #5f6857 !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      margin: 0 0 18px !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card .ns-gold {
      min-height: 56px !important;
      border-radius: 999px !important;
      background: #073b2b !important;
      border-color: #073b2b !important;
      color: #fff9e8 !important;
      box-shadow: 0 10px 24px rgba(7,59,43,.18) !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day {
      position: relative;
      min-height: 220px !important;
      margin: 0 0 18px !important;
      padding: 22px !important;
      overflow: hidden;
      border-radius: 28px !important;
      border: 1px solid rgba(246,223,154,.32) !important;
      background: linear-gradient(145deg, #0a4a35, #073b2b 58%, #052d21) !important;
      box-shadow: 0 18px 44px rgba(7,59,43,.20) !important;
      color: #fff9e8 !important;
      align-items: flex-start !important;
      flex-wrap: wrap;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day > img {
      width: 76px !important;
      height: 76px !important;
      border-radius: 50% !important;
      border: 2px solid rgba(246,223,154,.55);
      box-shadow: 0 8px 22px rgba(0,0,0,.20);
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day .ns-row-copy {
      color: #fff9e8 !important;
      padding-right: 8px;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day .ns-row-copy small {
      color: #d9bd72 !important;
      font-size: 10px !important;
      text-transform: uppercase;
      letter-spacing: .12em;
      font-weight: 700;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day .ns-row-copy strong {
      color: #fff9e8 !important;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 27px !important;
      line-height: 1 !important;
      font-weight: 500 !important;
      margin-top: 6px;
    }

    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-current-day > svg {
      color: #f2d88f !important;
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
      border-radius: 999px;
      color: #073b2b;
      font-family: 'Lora', Georgia, serif;
      font-size: 15px;
      background: linear-gradient(180deg, #f7e5aa, #d8b867);
      box-shadow: inset 0 1px rgba(255,255,255,.72), 0 8px 22px rgba(0,0,0,.12);
    }

    :root[data-layout="natural-sereno"] .ep-home-moment-card {
      border-radius: 22px !important;
      padding: 16px !important;
      margin-bottom: 16px !important;
      background: rgba(255,250,238,.96) !important;
      border-color: rgba(182,139,54,.26) !important;
      box-shadow: 0 10px 26px rgba(70,54,25,.07) !important;
    }

    :root[data-layout="natural-sereno"] .ns-insight {
      position: relative;
      overflow: hidden;
      margin: 18px 0 !important;
      padding: 24px 20px 22px !important;
      border: 1px solid rgba(182,139,54,.20) !important;
      border-radius: 24px !important;
      background:
        linear-gradient(90deg, rgba(255,249,232,.92), rgba(255,249,232,.80)),
        var(--ns-valley) center 72% / cover no-repeat !important;
      box-shadow: 0 12px 30px rgba(72,57,28,.08) !important;
    }

    :root[data-layout="natural-sereno"] .ns-insight > small {
      color: #9a742d !important;
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
      color: #26372a !important;
      font-family: 'Cormorant Garamond', Georgia, serif;
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
      border: 1px solid rgba(182,139,54,.22);
      border-radius: 18px;
      background: rgba(255,250,238,.94);
      color: #26372a;
      box-shadow: 0 8px 22px rgba(69,53,24,.05);
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
      color: #6a725f;
      font-size: 9px;
      line-height: 1.35;
    }

    :root[data-layout="natural-sereno"] .ep-home-closing {
      margin: 30px -16px 0 !important;
      padding: 34px 26px 40px !important;
      border: 0 !important;
      border-radius: 0 !important;
      text-align: center;
      background: linear-gradient(180deg, rgba(7,59,43,.96), #052f22) !important;
      box-shadow: none !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-closing h2 {
      color: #fff9e8 !important;
      font-size: 27px !important;
      font-weight: 400 !important;
      margin: 0 0 8px !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-closing p {
      color: #d7b75d !important;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 27px !important;
      line-height: 1.1 !important;
      margin: 0 !important;
    }

    :root[data-layout="natural-sereno"] [data-ep-home-secondary="true"] {
      display: none !important;
    }

    @media (max-width: 390px) {
      :root[data-layout="natural-sereno"] .ns-home-scene { min-height: 405px !important; }
      :root[data-layout="natural-sereno"] .ns-greeting { max-width: 84% !important; padding-top: 48px; }
      :root[data-layout="natural-sereno"] .ns-greeting h1 { font-size: 38px !important; }
      :root[data-layout="natural-sereno"] .ep-home-quicklinks { grid-template-columns: repeat(2, minmax(0,1fr)); }
      :root[data-layout="natural-sereno"] .ep-home-quicklinks button { min-height: 88px; }
    }
  `;
  // Restore the approved Natural Sereno visual while retaining current journey gates.
  style.textContent += `
    :root[data-layout="natural-sereno"] .ns-home-scene {
      min-height: 700px !important;
      padding: 25px 18px 17px !important;
      background: linear-gradient(180deg, rgba(255,249,232,.96), rgba(255,249,232,.7) 30%, transparent 60%), var(--ns-valley) center / cover no-repeat !important;
      color: #26372a;
    }
    :root[data-layout="natural-sereno"] .ns-home-scene::after { display: none; }
    :root[data-layout="natural-sereno"] .ns-home-menu {
      position: absolute !important; z-index: 2 !important; top: 11px; right: 12px; left: auto; width: 44px; height: 44px; display: grid; place-items: center;
      color: #073b2b !important; background: rgba(255,250,231,.7) !important;
      border: 0 !important; box-shadow: none; backdrop-filter: none;
    }
    :root[data-layout="natural-sereno"] .ns-greeting { max-width: 350px !important; padding-top: 0; text-shadow: none; }
    :root[data-layout="natural-sereno"] .ns-greeting h1 { color: #26372a !important; font-size: 35px !important; font-weight: 700 !important; line-height: 1.15 !important; margin-bottom: 7px !important; letter-spacing: normal !important; }
    :root[data-layout="natural-sereno"] .ns-greeting p { color: #26372a !important; font-family: 'Lora', Georgia, serif; font-size: 15px !important; margin: 3px 0 !important; }
    :root[data-layout="natural-sereno"] .ns-home-message { display: block !important; color: #26372a; }
    :root[data-layout="natural-sereno"] .ns-home-message span { font-family: 'Lora', Georgia, serif; }
    :root[data-layout="natural-sereno"] .ns-home-scene > .ns-gold {
      margin-top: 0; width: 100% !important; min-height: 70px !important; font-size: 20px;
      background: linear-gradient(180deg, #ead394 0%, #c49b42 25%, #aa7d25 58%, #98701f 78%, #d7b55e 100%) !important;
      color: #fff9e8 !important; box-shadow: inset 0 2px 5px rgba(255,247,203,.85), inset 0 -2px 4px rgba(92,61,12,.4), 0 0 0 2px rgba(236,207,135,.17), 0 3px 12px rgba(86,64,16,.28) !important;
    }
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-home-content,
    :root[data-layout="natural-sereno"] .ep-home-has-anamnesis .ns-home-content { margin-top: 0 !important; padding-top: 13px !important; }
    @media (min-width: 768px) {
      :root[data-layout="natural-sereno"] .ns-home-scene { min-height: 540px !important; padding: 24px !important; }
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
