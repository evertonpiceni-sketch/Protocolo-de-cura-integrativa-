import { OFFICIAL_LAYOUTS, normalizeLayoutId } from '../config/layouts';

const SESSION_KEY = 'cura_layout_confirmed_this_entry_v1';
const OVERLAY_ID = 'required-layout-choice-entry';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch] || ch));

async function mountRequiredLayoutChoice() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (sessionStorage.getItem(SESSION_KEY) === '1' || document.getElementById(OVERLAY_ID)) return;

  let account: any;
  try {
    const response = await fetch('/api/auth/me', { credentials: 'same-origin' });
    if (!response.ok) return;
    const data = await response.json();
    account = data?.user;
  } catch {
    return;
  }

  const profile = account?.profile;
  if (!profile?.visualLayout) return; // Existing React modal owns first-time selection.

  let selected = normalizeLayoutId(profile.visualLayout);
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Escolha a atmosfera visual');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(42,36,33,.56);backdrop-filter:blur(8px);display:grid;place-items:center;padding:20px;';

  const render = () => {
    overlay.innerHTML = `<section style="width:min(920px,100%);max-height:92vh;overflow:auto;background:#FAF7F2;border:1px solid #E8E0D5;border-radius:28px;padding:clamp(22px,4vw,38px);box-shadow:0 28px 80px rgba(42,36,33,.22);font-family:inherit;color:#2A2421">
      <div style="text-align:center;max-width:680px;margin:0 auto 24px"><p style="margin:0 0 7px;color:#A87E37;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Sua experiência visual</p><h2 style="margin:0;font-size:clamp(24px,4vw,36px);line-height:1.15">Escolha como você quer entrar hoje</h2><p style="margin:12px 0 0;color:#6B625B;line-height:1.6">Sua preferência anterior aparece pré-selecionada, mas nenhum estilo será aplicado automaticamente sem sua confirmação.</p></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px">${OFFICIAL_LAYOUTS.map(layout => {
        const active = layout.id === selected;
        return `<button type="button" data-layout-id="${escapeHtml(layout.id)}" aria-pressed="${active}" style="appearance:none;text-align:left;min-height:154px;padding:18px;border-radius:20px;border:${active ? '2px solid #B88736' : '1px solid #E8E0D5'};background:${active ? '#FFFDF8' : 'rgba(255,255,255,.72)'};box-shadow:${active ? '0 10px 28px rgba(67,52,39,.10)' : 'none'};cursor:pointer;color:#2A2421"><strong style="display:block;font-size:15px;margin-bottom:9px">${escapeHtml(layout.name)}</strong><span style="display:flex;gap:5px;margin-bottom:11px">${layout.swatches.map(color => `<i aria-hidden="true" style="display:block;width:18px;height:18px;border-radius:999px;background:${escapeHtml(color)};border:1px solid rgba(0,0,0,.08)"></i>`).join('')}</span><span style="display:block;color:#6B625B;font-size:12px;line-height:1.5">${escapeHtml(layout.description)}</span></button>`;
      }).join('')}</div>
      <div style="display:flex;justify-content:center;margin-top:24px"><button type="button" id="required-layout-confirm" style="appearance:none;border:1px solid #A87E37;border-radius:14px;background:linear-gradient(145deg,#C89D52,#A87E37);color:#FFFDF8;padding:13px 24px;font-weight:700;cursor:pointer;box-shadow:0 10px 24px rgba(67,52,39,.14)">Confirmar estilo</button></div>
    </section>`;

    overlay.querySelectorAll<HTMLButtonElement>('[data-layout-id]').forEach(button => {
      button.addEventListener('click', () => {
        selected = normalizeLayoutId(button.dataset.layoutId);
        render();
      });
    });
    overlay.querySelector<HTMLButtonElement>('#required-layout-confirm')?.addEventListener('click', async () => {
      const updatedProfile = { ...profile, visualLayout: selected };
      try {
        const response = await fetch('/api/user/sync', {
          method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: updatedProfile, progress: account.progress || [] })
        });
        if (!response.ok) throw new Error('sync failed');
        document.documentElement.dataset.layout = selected;
        sessionStorage.setItem(SESSION_KEY, '1');
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
