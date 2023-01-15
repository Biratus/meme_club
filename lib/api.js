import { fullAttachments, PY_BEFORE, PY_NOW, users } from '../fetch.js';

/*
    ---- Processors ----
*/
// Add function in here to add process during history loading (cf : loadMessages )
const processors = [
  addUtilFunctions,
  handleMissingUser,
  loadAttachment,
  participantAdded,
  addUserData,
];

export function runProcessors(history) {
  history.forEach((h) => processors.forEach((p) => p(h)));
}

function loadAttachment(m) {
  if (!m.isAttachment) return;
  fullAttachments.push(m);
}

// Gestion des utilisateurs inconnus
// Ont déjà postés dans le Meme Club mais sont parti :(
function handleMissingUser(m) {
  const { senderID } = m;

  if (!users.hasOwnProperty(senderID)) {
    // Première fois qu'on rencontre cet utilsateur inconnu
    console.error('No data for ' + senderID);
    users[senderID] = {
      id: senderID,
      name: 'utilisateur inconnu',
      messages: [m],
    };
  } else if (users[senderID].name == 'utilisateur inconnu') {
    // On connait cet utilisateur inconnu
    users[senderID].messages.push(m);
  }
}

// Ajout donnée utilisateur
function addUserData(m) {
  const { senderID } = m;
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
  if (m.eventType != 'add_participants') return;
  let [userId] = m.eventData.participantsAdded;

  // Double compte
  if (userId == PY_NOW) return;
  else if (userId == PY_BEFORE) userId = PY_NOW;

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
