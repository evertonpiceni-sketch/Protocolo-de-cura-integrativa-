const FORBIDDEN_DECORATIVE = /[★☆⭐✨🌟💫🔥💚💛💜💙❤️♥️🧡🌈🙏🔮🌀☀️🌙🌿🍃🌸🌺💎🕊️🪽]/gu;

function sanitizeTextNode(node: Text) {
  const parent = node.parentElement;
  if (!parent) return;
  if (parent.closest('[aria-hidden="true"],svg,script,style,code,pre')) return;
  const next = node.nodeValue?.replace(FORBIDDEN_DECORATIVE, '').replace(/\s{2,}/g, ' ');
  if (typeof next === 'string' && next !== node.nodeValue) node.nodeValue = next;
}

function sanitizeTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    sanitizeTextNode(root as Text);
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current: Node | null;
  while ((current = walker.nextNode())) sanitizeTextNode(current as Text);
}

if (typeof document !== 'undefined') {
  const start = () => {
    sanitizeTree(document.body);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') sanitizeTree(record.target);
        record.addedNodes.forEach(sanitizeTree);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}

export {};
