import { fullAttachments } from '../fetch.js';

export function Top10BestMemes2022() {
  const sortedAttachments = [...fullAttachments];
  sortByReaction(sortedAttachments);

  return firstX(sortedAttachments, 10);
}

function firstX(arr, X) {
  return arr.filter((e, i) => i < 10);
}
function sortByReaction(attachments) {
  attachments.sort(
    (a, b) => b.messageReactions.length - a.messageReactions.length
  );
}
