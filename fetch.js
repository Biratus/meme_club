import messages2022 from './data/messages2022.js';
import usersRaw from './data/users.js';
import { runProcessors } from './lib/api.js';
import { runPostProcessors } from './lib/data.js';

export const fullHistory = messages2022;
export var fullAttachments = [];
export const bestMemes = [];
export const users = usersRaw;
export const PY_BEFORE = '1484120813';
export const PY_NOW = '100076608136245';
export const MEME_CLUB = 1712178942225974;

export default function init() {
  console.log('Processing data...');
  addBasicUserData();
  runProcessors(fullHistory);
  console.log(
    `Data processed: ${fullHistory.length} messages, ${fullAttachments.length} medias`
  );
  runPostProcessors();
}
function addBasicUserData() {
  for (let uId in users) {
    let u = users[uId];
    u.nbMeme = 0;
    u.nbReaction = 0;
    u.nbNotMeme = 0;
    u.nbMessage = 0;
  }
}
