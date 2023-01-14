import { fullAttachments, PY_BEFORE, PY_NOW } from '../fetch.js';

export const REACTION = ['😆', '❤'];
// Tri par nombre de réaction
// nb: le nb à retourner (ex: 10 premier => TopMeme(10))
export function TopMeme(nb = 10) {
  const sortedAttachments = [...fullAttachments];
  sortByReactionNb(sortedAttachments);
  return firstX(sortedAttachments, nb);
}

// Tri par nombre de réaction pour une réaction particulière
export function TopMemeByReaction(reaction, nb = 10) {
  const filtered = fullAttachments.filter((a) => a.hasReaction(reaction));
  console.log('hasReaction ' + filtered.length);
  sortByReactionTypeNb(filtered, reaction);
  return firstX(filtered, nb);
}

function firstX(arr, X) {
  return arr.filter((e, i) => i < X);
}
function sortByReactionNb(attachments) {
  sortBy(attachments, (elt) => elt.reactionNb, false);
}
function sortByReactionTypeNb(attachments, type) {
  sortBy(attachments, (elt) => elt.reactionMap[type], false);
}

function sortBy(list, selector, asc) {
  list.sort((a, b) =>
    asc ? selector(a) - selector(b) : selector(b) - selector(a)
  );
}
