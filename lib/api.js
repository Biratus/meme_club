import {
  fullAttachments,
  PY_BEFORE,
  PY_NOW,
  users,
} from '../fetch.js';

// Add function in here to add process during history loading (cf : loadMessages )
const processors = [addUtilFunctions, loadAttachments, loadParticipantsAdded];

function loadAttachments(history) {
  history.filter((m) => m.isAttachment).forEach((a) => fullAttachments.push(a));
}

function loadParticipantsAdded(history) {
  for (let m of history.filter((m) => m.eventType == 'add_participants')) {
    // console.log("added", m);
    let [userId] = m.eventData.participantsAdded;

    if (userId == PY_NOW) continue;
    else if (userId == PY_BEFORE) userId = PY_NOW;
    if (!users[userId]) {
      console.log('No stats for ' + userId, m);
      continue;
    }
    users[userId].dateAdded = new Date(parseInt(m.timestamp));
  }
}

export function runProcessors(history) {
  processors.forEach((p) => p(history));
}

function addUtilFunctions(history) {
  for (let message of history) {
    message.isAttachment = isAttachment(message);
    if (message.isAttachment) {
      message.hasReaction = hasReaction;
      message.reactionMap = makeReactionMap(message);
      message.reactionNb = message.messageReactions.length;
    }
  }
}
const attachmentsType = ['photo', 'video', 'animated_image', 'audio'];

function isAttachment(message) {
  return (
    message.attachments &&
    message.attachments.length != 0 &&
    message.attachments.some((a) => attachmentsType.includes(a.type))
  );
}

function hasReaction(type) {
  return this.reactionMap.hasOwnProperty(type);
}

function makeReactionMap(message) {
  const map = {};
  for (let { reaction } of message.messageReactions) {
    if (!map.hasOwnProperty(reaction)) map[reaction] = 0;
    map[reaction] = map[reaction] + 1;
  }
  return map;
}
