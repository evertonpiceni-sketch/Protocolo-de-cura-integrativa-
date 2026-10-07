import React, { useEffect, useState } from 'react';
import { Heart, Users } from 'lucide-react';

type Post = { id: string; initials: string; text: string; createdAt: string; mine: boolean; status: string; likes: number; liked: boolean; reports?: string[] };
async function request(path = '', method = 'GET', body?: unknown) {
  const response = await fetch(`/api/community${path}`, { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json().catch(() => ({ error: 'Não foi possível acessar a comunidade agora.' }));
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir esta ação.');
  return data;
}
export default function NaturalSerenoCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [canModerate, setCanModerate] = useState(false);
  const [text, setText] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Recentes');
  const [reportId, setReportId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  async function load() {
    const data = await request();
    setPosts(data.posts);
    setCanModerate(data.canModerate);
  }
  useEffect(() => {
    let live = true;
    request().then(data => { if (live) { setPosts(data.posts); setCanModerate(data.canModerate); } })
      .catch(err => { if (live) setError(err.message); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, []);
  async function act(callback: () => Promise<unknown>, success: string) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try { await callback(); await load(); setNotice(success); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível concluir esta ação.'); }
    finally { setBusy(false); }
  }
  const shown = posts.filter(post => tab !== 'Minhas experiências' || post.mine).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return <>
    <form className="ns-community-composer" onSubmit={event => {
      event.preventDefault();
      void act(async () => { await request('', 'POST', { text, consent }); setText(''); setConsent(false); }, 'Experiência enviada. Ela ficará visível após a revisão.');
    }}>
      <label htmlFor="community-experience">Como foi seu momento?</label>
      <textarea id="community-experience" value={text} onChange={event => setText(event.target.value)} minLength={3} maxLength={2000} rows={4} required placeholder="Escreva sua experiência, sem nomes, contatos ou dados de outras pessoas." />
      <p>Seu diário permanece privado. Aqui usamos somente iniciais geradas pelo sistema, sem nome ou foto. As publicações passam por revisão.</p>
      <label className="ns-community-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required />Quero compartilhar este texto com a comunidade.</label>
      <button className="ns-gold" disabled={busy || !consent || text.trim().length < 3}>{busy ? 'Aguarde…' : 'Compartilhar experiência'}</button>
    </form>
    {error && <p role="alert" className="ns-community-notice">{error} <button disabled={busy} onClick={() => void act(load, 'Comunidade atualizada.')}>Tentar novamente</button></p>}
    {notice && <p role="status" className="ns-community-notice">{notice}</p>}
    <div className="ns-filter" aria-label="Publicações da comunidade">{['Recentes', 'Minhas experiências'].map(label => <button key={label} aria-pressed={tab === label} onClick={() => setTab(label)}>{label}</button>)}</div>
    {loading ? <p role="status">Carregando experiências…</p> : !shown.length && !error ? <div className="ns-community-empty" role="status"><Users size={38} strokeWidth={1.2} aria-hidden="true" /><h2>Entre Nós</h2><p>{tab === 'Minhas experiências' ? 'Suas experiências compartilhadas aparecerão aqui.' : 'Ainda não há publicações para exibir.'}</p><p>Aqui, a experiência pode ser compartilhada. A identidade não precisa ser.</p></div> : null}
    {shown.map(post => <article key={post.id} className="ns-community-post">
      <header><strong>{post.initials}</strong><time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</time></header>
      {post.status !== 'approved' && <p className="ns-community-status">{post.status === 'rejected' ? 'Não publicada após revisão.' : 'Em revisão — visível somente para você e a moderação.'}</p>}
      <p className="ns-community-text">{post.text}</p>
      <footer>
        {post.status === 'approved' && <button disabled={busy} aria-pressed={post.liked} aria-label={`Acolher experiência, ${post.likes} acolhimentos`} onClick={() => void act(() => request(`/${post.id}/like`, 'POST', { liked: !post.liked }), 'Acolhimento atualizado.')}><Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />{post.likes}</button>}
        {!post.mine && <button disabled={busy} onClick={() => { setReportId(post.id); setReason(''); }}>Denunciar</button>}
        {post.mine && <button disabled={busy} onClick={() => void act(() => request(`/${post.id}`, 'DELETE'), 'Sua publicação foi excluída.')}>Excluir minha publicação</button>}
      </footer>
      {reportId === post.id && <form onSubmit={event => { event.preventDefault(); void act(async () => { await request(`/${post.id}/report`, 'POST', { reason }); setReportId(null); }, 'Denúncia recebida. A publicação será revisada.'); }}><label htmlFor={`report-${post.id}`}>Motivo da denúncia</label><textarea id={`report-${post.id}`} rows={2} value={reason} onChange={event => setReason(event.target.value)} minLength={3} maxLength={500} required /><div className="ns-community-actions"><button className="ns-secondary" type="button" onClick={() => setReportId(null)}>Cancelar</button><button className="ns-gold" disabled={busy}>Enviar denúncia</button></div></form>}
      {canModerate && <div className="ns-community-moderation"><p>Revisão: confira privacidade, identificação e respeito antes de aprovar.</p>{post.reports?.map((report, i) => <p key={i}>Denúncia: {report}</p>)}<div className="ns-community-actions"><button disabled={busy} className="ns-secondary" onClick={() => void act(() => request(`/${post.id}/moderate`, 'POST', { status: 'rejected' }), 'Publicação retirada.')}>Não publicar</button><button disabled={busy} className="ns-gold" onClick={() => void act(() => request(`/${post.id}/moderate`, 'POST', { status: 'approved' }), 'Publicação aprovada.')}>Aprovar publicação</button></div></div>}
    </article>)}
  </>;
}
