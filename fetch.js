import messages2022 from './data/messages2022.js';
import usersRaw from './data/users.js';
import { runProcessors } from './lib/api.js';

export const fullHistory = messages2022;
export const fullAttachments = [];
export const bestMemes = [];
export const users = usersRaw;
export const PY_BEFORE = '1484120813';
export const PY_NOW = '100076608136245';
export const MEME_CLUB = 1712178942225974;

runProcessors(fullHistory);
