/** Avoid creating child-list mutations when an observer reapplies unchanged text. */
export function setStableText(node: Node | null | undefined, value: string) {
  if (node && node.textContent !== value) node.textContent = value;
}
