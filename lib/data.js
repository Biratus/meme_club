import { fullAttachments, PY_BEFORE, PY_NOW, users } from '../fetch.js';

export const REACTION = ['😆', '❤'];

// Tri par nombre de réaction
// nb: le nb à retourner (ex: 10 premier => TopMeme(10))
export function TopMeme(nb = 10) {
  const sortedAttachments = [...fullAttachments];
  sortByReactionNb(sortedAttachments);
  return firstX(sortedAttachments, nb);
}

function sortByReactionNb(attachments) {
  sortBy(attachments, (elt) => elt.nbReaction, false);
}

// Tri par nombre de réaction pour une réaction particulière
export function TopMemeByReaction(reaction, nb = 10) {
  const filtered = fullAttachments.filter((a) => a.hasReaction(reaction));
  sortByReactionTypeNb(filtered, reaction);
  return firstX(filtered, nb);
}
function sortByReactionTypeNb(attachments, type) {
  sortBy(attachments, (elt) => elt.reactionMap[type], false);
}

// Tri par nb de meme postés
export function TopPosteursDeMeme() {
  const usersCopy = [];
  for (let uId in users) {
    usersCopy.push(users[uId]);
  }
  sortByNbMeme(usersCopy);

  return usersCopy;
}
function sortByNbMeme(users) {
  sortBy(users, (u) => u.nbMeme, false);
}

// Utils for All
function firstX(arr, X) {
  return arr.filter((e, i) => i < X);
}
function sortBy(list, selector, asc) {
  list.sort((a, b) =>
    asc ? selector(a) - selector(b) : selector(b) - selector(a)
  );
}
