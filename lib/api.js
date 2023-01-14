import { parseISO } from 'date-fns';
import {
  fullAttachments,
  fullHistory,
  MEME_CLUB,
  PY_BEFORE,
  PY_NOW,
  users,
} from '../fetch.js';

// Add function in here to add process during history loading (cf : loadMessages )
const processors = [addUtilFunctions, loadAttachments, loadParticipantsAdded];

export function makeUsers(threadInfo) {
  const stats = {};
  threadInfo.userInfo.forEach(({ id, name, nickname }) => {
    stats[id] = {
      id,
      name,
      nickname,
      nb_meme: 0,
      reactions: {},
      nb_reac: 0,
      total_reac: 0,
    };
  });
  return stats;
}

let timestamp = undefined;
export async function loadAllHistory(api) {
  // messages = JSON.parse(fs.readFileSync('messages.json','utf-8'));
  // onLoaded(api);
  console.log('. ' + timestamp);
  const history = await api.getThreadHistory(MEME_CLUB, 500, timestamp);
  if (timestamp != undefined) history.pop();
  history.forEach((h) => fullHistory.push(h));

  processors.forEach((p) => p(history));

  if (history.length > 10) {
    timestamp = history[0].timestamp;
    return loadAllHistory(api);
  } else return;
}

export async function loadYearHistory(api, year) {
  timestamp = new Date(`${year}-12-31T23:59:59`).getTime();
  return await loadHistoryForYear(api, year);
}

async function loadHistoryForYear(api, year) {
  try {
    console.log(year + '. ' + timestamp);
    const history = await api.getThreadHistory(MEME_CLUB, 500, timestamp);
    if (timestamp != undefined) history.pop();

    history
      .filter((m) => new Date(parseInt(m.timestamp)).getFullYear() == year)
      .forEach((h) => fullHistory.push(h));
    runProcessors(history);
    if (history.length > 10 && new Date(timestamp).getFullYear() == year) {
      // Si pas le mm nb = on a passé une année
      timestamp = parseInt(history[0].timestamp);
      return loadHistoryForYear(api, year);
    }
  } catch (e) {
    console.error('Error');
    console.log(e);
  }
}
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
