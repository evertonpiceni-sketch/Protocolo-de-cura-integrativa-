import { Router, type RequestHandler } from 'express';
import crypto from 'node:crypto';
import { communityHash, communitySet, communityDelete } from './communityStore.js';
import { communityInitials, communityTextError, type CommunityPost } from './communityPolicy.js';

export function communityRoutes(authenticate: RequestHandler, limiter: RequestHandler) {
  const router = Router();
  router.use(authenticate, limiter);
  const action = (fn: (req: any, res: any) => Promise<unknown>): RequestHandler => (req, res) => {
    Promise.resolve(fn(req, res)).catch(() => res.status(503).json({ error: 'Não foi possível acessar a comunidade agora. Tente novamente.' }));
  };
  async function readPost(id: string) {
    const posts = await communityHash('posts');
    return posts[id] ? JSON.parse(posts[id]) as CommunityPost : null;
  }
  router.get('/', action(async (req, res) => {
    const [posts, statuses, likes, reports] = await Promise.all(['posts', 'statuses', 'likes', 'reports'].map(communityHash));
    const canModerate = req.user.role === 'admin';
    const entries = Object.values(posts).map(value => JSON.parse(value) as CommunityPost)
      .filter(post => statuses[post.id] === 'approved' || post.authorId === req.userId || canModerate)
      .map(post => ({ id: post.id, initials: post.initials, text: post.text, createdAt: post.createdAt, mine: post.authorId === req.userId,
        status: statuses[post.id] || 'pending', likes: Object.keys(likes).filter(key => key.startsWith(`${post.id}:`)).length,
        liked: Boolean(likes[`${post.id}:${req.userId}`]),
        ...(canModerate ? { reports: Object.entries(reports).filter(([key]) => key.startsWith(`${post.id}:`)).map(([, value]) => JSON.parse(value).reason) } : {}),
      })).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 100);
    return res.json({ posts: entries, canModerate });
  }));
  router.post('/', action(async (req, res) => {
    if (req.body.consent !== true) return res.status(400).json({ error: 'Confirme que deseja compartilhar esta experiência.' });
    const error = communityTextError(req.body.text);
    if (error) return res.status(400).json({ error });
    const post: CommunityPost = { id: crypto.randomUUID(), authorId: req.userId, initials: communityInitials(req.userId), text: req.body.text.trim(), createdAt: new Date().toISOString() };
    await communitySet('posts', post.id, JSON.stringify(post));
    // Every post is reviewed before public display, including identification not caught by filters.
    return res.status(201).json({ id: post.id, status: 'pending' });
  }));
  router.delete('/:id', action(async (req, res) => {
    const post = await readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicação não encontrada.' });
    if (post.authorId !== req.userId && req.user.role !== 'admin') return res.status(403).json({ error: 'Você pode excluir somente suas publicações.' });
    await communityDelete('posts', post.id);
    await communityDelete('statuses', post.id);
    return res.json({ success: true });
  }));
  router.post('/:id/like', action(async (req, res) => {
    const post = await readPost(req.params.id);
    const statuses = await communityHash('statuses');
    if (!post || statuses[post.id] !== 'approved') return res.status(404).json({ error: 'Publicação não disponível.' });
    if (req.body.liked === true) await communitySet('likes', `${post.id}:${req.userId}`, '1');
    else if (req.body.liked === false) await communityDelete('likes', `${post.id}:${req.userId}`);
    else return res.status(400).json({ error: 'Escolha de acolhimento inválida.' });
    return res.json({ success: true });
  }));
  router.post('/:id/report', action(async (req, res) => {
    const post = await readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicação não encontrada.' });
    if (typeof req.body.reason !== 'string' || req.body.reason.trim().length < 3 || req.body.reason.length > 500) return res.status(400).json({ error: 'Descreva o motivo em até 500 caracteres.' });
    await communitySet('reports', `${post.id}:${req.userId}`, JSON.stringify({ reason: req.body.reason.trim(), createdAt: new Date().toISOString() }));
    await communitySet('statuses', post.id, 'flagged');
    return res.json({ success: true });
  }));
  router.post('/:id/moderate', action(async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso administrativo negado.' });
    const post = await readPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicação não encontrada.' });
    if (!['approved', 'rejected'].includes(req.body.status)) return res.status(400).json({ error: 'Decisão inválida.' });
    if (req.body.status === 'approved' && communityTextError(post.text)) return res.status(400).json({ error: 'A publicação contém dados que precisam ser removidos.' });
    await communitySet('statuses', post.id, req.body.status);
    return res.json({ success: true });
  }));
  return router;
}
