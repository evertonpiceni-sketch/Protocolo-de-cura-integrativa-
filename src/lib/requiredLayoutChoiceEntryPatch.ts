import { OFFICIAL_LAYOUTS, normalizeLayoutId } from '../config/layouts';

const SESSION_KEY = 'cura_layout_confirmed_this_entry_v1';
const OVERLAY_ID = 'required-layout-choice-entry';
const PENDING_LAYOUT = 'layout-choice-pending';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch] || ch));

function previewMarkup(layout: (typeof OFFICIAL_LAYOUTS)[number]) {
  const [canvas, accent, gold, surface] = layout.swatches;
  const natural = layout.id === 'natural-sereno';
  const foreground = layout.tone === 'dark' ? '#F4F1EB' : '#2A2420';
  const muted = layout.tone === 'dark' ? 'rgba(244,241,235,.58)' : 'rgba(42,36,32,.34)';
  const card = natural ? 'rgba(255,255,255,.80)' : `${accent}22`;
  const action = natural ? `linear-gradient(135deg,${gold},#A87E37)` : layout.id === 'mistico-moderno' ? `linear-gradient(135deg,${gold},#E2B96B)` : `linear-gradient(135deg,${gold},${accent})`;
  // Natural Sereno's fourth swatch is a natural green accent, not a surface color.
  // Keep the preview itself cream/ivory and use green only as a small organic detail.
  const previewSurface = natural ? '#F3EDE4' : surface;
  const naturalAccent = natural ? surface : accent;
  return `<div aria-hidden="true" style="margin-top:13px;overflow:hidden;border-radius:14px;border:1px solid rgba(42,36,33,.09);background:linear-gradient(145deg,${canvas},${previewSurface});color:${foreground}">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 9px;border-bottom:1px solid rgba(42,36,33,.07)"><i style="display:block;width:46px;height:4px;border-radius:99px;background:${gold};opacity:.8"></i><i style="display:block;width:13px;height:13px;border-radius:50%;background:${natural ? naturalAccent : accent};border:1px solid rgba(42,36,33,.10);opacity:${natural ? '.72' : '1'}"></i></div>
    <div style="padding:9px"><div style="padding:10px;border-radius:10px;background:${card};border:1px solid rgba(42,36,33,.06);box-shadow:0 4px 12px rgba(42,36,33,.05)"><i style="display:block;width:54px;height:4px;border-radius:99px;background:${gold}"></i><i style="display:block;width:72%;height:7px;margin-top:7px;border-radius:99px;background:${foreground};opacity:.82"></i><i style="display:block;width:48%;height:5px;margin-top:5px;border-radius:99px;background:${muted}"></i>${natural ? `<i style="display:block;width:100%;height:72px;margin-top:9px;border-radius:7px;background:linear-gradient(180deg,rgba(250,247,242,.06),rgba(42,36,33,.14)),url(&quot;/brand/natural-sereno/vale-amanhecer.webp&quot;) center 55% / cover no-repeat;background-color:${previewSurface};border:1px solid #E8E0D5"></i>` : ''}<i style="display:block;width:70px;height:20px;margin-top:9px;border-radius:99px;background:${action};box-shadow:0 4px 10px rgba(42,36,33,.08)"></i></div></div>
  </div>`;
}

async function mountRequiredLayoutChoice() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (sessionStorage.getItem(SESSION_KEY) === '1' || document.getElementById(OVERLAY_ID)) return;

  // Persisted preference is only a preselection. No theme is applied behind the chooser.
  document.documentElement.dataset.layout = PENDING_LAYOUT;
  let guardingLayout = true;
  const layoutGuard = new MutationObserver(() => {
    if (!guardingLayout) return;
    if (document.documentElement.dataset.layout !== PENDING_LAYOUT) document.documentElement.dataset.layout = PENDING_LAYOUT;
  });
  layoutGuard.observe(document.documentElement, { attributes: true, attributeFilter: ['data-layout'] });

  const releaseGuard = () => { guardingLayout = false; layoutGuard.disconnect(); };
  const releasePendingLayout = () => {
    releaseGuard();
    if (document.documentElement.dataset.layout === PENDING_LAYOUT) delete document.documentElement.dataset.layout;
  };

  let account: any;
  try {
    const response = await fetch('/api/auth/me', { credentials: 'same-origin' });
    if (!response.ok) { releasePendingLayout(); return; }
    const data = await response.json();
    account = data?.user;
  } catch {
    releasePendingLayout();
    return;
  }

  const profile = account?.profile;
  if (!profile?.visualLayout) {
    releasePendingLayout();
    return;
  }

  let selected: (typeof OFFICIAL_LAYOUTS)[number]['id'] | null = null;
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Escolha a atmosfera visual');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(42,36,33,.56);backdrop-filter:blur(8px);display:grid;place-items:center;padding:14px;';

  const render = () => {
    overlay.innerHTML = `<section style="width:min(960px,100%);max-height:94vh;overflow:auto;background:#FAF7F2;border:1px solid #E8E0D5;border-radius:28px;padding:clamp(20px,4vw,36px);box-shadow:0 28px 80px rgba(42,36,33,.22);font-family:inherit;color:#2A2421">
      <div style="text-align:center;max-width:680px;margin:0 auto 22px"><p style="margin:0 0 7px;color:#A87E37;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">4 estilos, uma mesma essência</p><h2 style="margin:0;font-size:clamp(24px,4vw,36px);line-height:1.15">Escolha como você quer entrar hoje</h2><p style="margin:12px 0 0;color:#6B625B;line-height:1.6">Selecione uma das quatro atmosferas e confirme. Nenhum estilo será aplicado automaticamente.</p></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px">${OFFICIAL_LAYOUTS.map(layout => {
        const active = selected !== null && layout.id === selected;
        return `<button type="button" data-layout-id="${escapeHtml(layout.id)}" aria-pressed="${active}" style="appearance:none;text-align:left;min-height:260px;padding:16px;border-radius:20px;border:${active ? '2px solid #B88736' : '1px solid #E8E0D5'};background:${active ? '#FFFDF8' : 'rgba(255,255,255,.72)'};box-shadow:${active ? '0 10px 28px rgba(67,52,39,.10)' : 'none'};cursor:pointer;color:#2A2421"><strong style="display:block;font-size:15px;margin-bottom:7px">${escapeHtml(layout.name)}</strong><span style="display:block;color:#6B625B;font-size:12px;line-height:1.45;min-height:35px">${escapeHtml(layout.description)}</span>${previewMarkup(layout)}<span style="display:flex;gap:5px;margin-top:11px">${layout.swatches.map(color => `<i aria-hidden="true" style="display:block;flex:1;height:9px;border-radius:999px;background:${escapeHtml(color)};border:1px solid rgba(0,0,0,.08)"></i>`).join('')}</span></button>`;
      }).join('')}</div>
      <div style="display:flex;justify-content:center;margin-top:22px"><button type="button" id="required-layout-confirm" ${selected === null ? 'disabled aria-disabled="true"' : ''} style="appearance:none;border:1px solid #A87E37;border-radius:14px;background:linear-gradient(145deg,#C89D52,#A87E37);color:#2A2420;padding:13px 24px;font-weight:700;cursor:${selected === null ? 'not-allowed' : 'pointer'};opacity:${selected === null ? '.5' : '1'};box-shadow:0 10px 24px rgba(67,52,39,.14)">Confirmar ${escapeHtml(OFFICIAL_LAYOUTS.find(layout => layout.id === selected)?.name || 'estilo')}</button></div>
    </section>`;

    overlay.querySelectorAll<HTMLButtonElement>('[data-layout-id]').forEach(button => {
      button.addEventListener('click', () => { selected = normalizeLayoutId(button.dataset.layoutId); render(); });
    });
    overlay.querySelector<HTMLButtonElement>('#required-layout-confirm')?.addEventListener('click', async () => {
      if (selected === null) return;
      const updatedProfile = { ...profile, visualLayout: selected };
      try {
        const response = await fetch('/api/user/sync', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile: updatedProfile, progress: account.progress || [] }) });
        if (!response.ok) throw new Error('sync failed');
        sessionStorage.setItem(SESSION_KEY, '1');
        releaseGuard();
        document.documentElement.dataset.layout = selected;
        overlay.remove();
        window.location.reload();
      } catch {
        const confirm = overlay.querySelector<HTMLButtonElement>('#required-layout-confirm');
        if (confirm) { confirm.textContent = 'Não foi possível salvar. Tentar novamente'; confirm.focus(); }
      }
    });
  };

  render();
  document.body.appendChild(overlay);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void mountRequiredLayoutChoice(), { once: true });
else void mountRequiredLayoutChoice();