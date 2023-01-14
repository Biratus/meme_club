import { parseISO } from "date-fns";
import {
  fullAttachments,
  fullHistory,
  MEME_CLUB,
  PY_BEFORE,
  PY_NOW,
  users,
} from "../fetch.js";

// Add function in here to add process during history loading (cf : loadMessages )
const processors = [addUtilFunctions, loadAttachment, addUserData];

export function makeUsers(threadInfo) {
  const stats = {};
  threadInfo.userInfo.forEach(({ id, name, nickname }) => {
    stats[id] = {
      id,
      name,
      nickname,
    };
  });
  return stats;
}

let timestamp = undefined;
export async function loadAllHistory(api) {
  // messages = JSON.parse(fs.readFileSync('messages.json','utf-8'));
  // onLoaded(api);
  console.log(". " + timestamp);
  const history = await api.getThreadHistory(MEME_CLUB, 500, timestamp);
  if (timestamp != undefined) history.pop();

  history.forEach((h) => fullHistory.push(h));
  runProcessors(history);

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
    console.log(year + ". " + timestamp);
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
    console.error("Error");
    console.log(e);
  }
}

/*
    ---- Processors ----
*/
export function runProcessors(history) {
  history.forEach((h) => processors.forEach((p) => p(h)));
}

function loadAttachment(m) {
  if (!m.isAttachment) return;
  fullAttachments.push(m);
}

// Ajout donnée utilisateur
function addUserData(m) {
  const { senderID } = m;
  participantAdded(m);
  if (!users.hasOwnProperty(senderID)) {
    console.error("No data for " + senderID);
    if (senderID) {
      console.log("All users", users);
    }
    return;
  }
  users[senderID].nbMessage++;

  if (m.isAttachment) {
    // C'est un meme
    users[senderID].nbMeme++;
    users[senderID].nbReaction += m.nbReaction;
  } else {
    // C'est pas un meme :/
    users[senderID].nbNotMeme++;
  }
}

// Date d'ajout d'un participant
function participantAdded(m) {
  if (m.eventType != "add_participants") return;
  let [userId] = m.eventData.participantsAdded;

  // Double compte
  if (userId == PY_NOW) return;
  else if (userId == PY_BEFORE) userId = PY_NOW;

  // Utilisateur inconnu: A posté un jour et est parti du Meme Club :(
  if (!users[userId]) {
    console.log("No stats for " + userId, m);
    return;
  }
  users[userId].dateAdded = new Date(parseInt(m.timestamp));
}

// Variable & Fonctions à ajouter sur l'objet direct
function addUtilFunctions(message) {
  message.isAttachment = isAttachment(message);
  if (message.isAttachment) {
    message.hasReaction = hasReaction;
    message.reactionMap = makeReactionMap(message);
    message.nbReaction = message.messageReactions.length;
  }
}
const attachmentsType = ["photo", "video", "animated_image", "audio"];
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
