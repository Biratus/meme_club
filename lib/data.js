import {
  fullHistory,
  fullAttachments,
  users,
} from '../fetch.js';

export const REACTION = ['😆', '❤'];
const second = 1000;

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
  sortBy(attachments, (elt) => elt.reactionMap()[type], false);
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

// Cause possible de la réaction à ce message
const surroundingCauseTime = 11 * second;
export function getPossibleReactionCause(message) {
  const surroundings = [...prevOf(message), ...nextOf(message)];
  // sortBy(surroundings,(elt) => timeDiff(elt,message),true);
  return surroundings;
}

export function prevOf(media) {
  let currentMedia = media.prev();
  let prevs = [];

  while (
    currentMedia &&
    currentMedia.senderID == media.senderID &&
    timeDiff(media, currentMedia) < surroundingCauseTime
  ) {
    prevs.push(currentMedia);
    currentMedia = currentMedia.prev();
  }
  sortBy(prevs, (elt) => parseInt(elt.timestamp), true);
  return prevs;
}
export function nextOf(media) {
  let currentMedia = media.next();
  let nexts = [];

  while (
    currentMedia &&
    currentMedia.senderID == media.senderID &&
    timeDiff(media, currentMedia) < surroundingCauseTime
  ) {
    nexts.push(currentMedia);
    currentMedia = currentMedia.next();
  }
  sortBy(nexts, (elt) => parseInt(elt.timestamp), true);
  return nexts;
}

// Utils for All
export function firstX(arr, X) {
  return arr.filter((e, i) => i < X);
}
export function sortBy(list, selector, asc) {
  list.sort((a, b) =>
    asc ? selector(a) - selector(b) : selector(b) - selector(a)
  );
}
export function timeDiff(m1, m2) {
  return Math.abs(parseInt(m1.timestamp) - parseInt(m2.timestamp));
}

// Post Processors
const postProcessors = [surroundingMessages];
export function runPostProcessors() {
  postProcessors.forEach((p) => p());
}

function surroundingMessages() {
  // Add next/prev
  fullHistory[0].prev = () => undefined;
  fullHistory[fullHistory.length - 1].next = () => undefined;

  for (let i = 1; i < fullHistory.length; i++) {
    // All except first and last
    fullHistory[i - 1].next = () => fullHistory[i];
    fullHistory[i].prev = () => fullHistory[i - 1];
  }
}
