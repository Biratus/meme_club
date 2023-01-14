import $ from 'jquery';
import { fullHistory } from '../lib/fetch.js';
import {
  TopMeme,
  TopMemeByReaction,
  TopPosteursDeMeme,
  REACTION,
} from '../lib/data.js';

// Fonction qui marche:
//    TopMeme
//    TopMemeByReaction
//    TopPosteursDeMeme

function init() {
  // let top10 = TopMeme();
  let top10 = TopMemeByReaction(REACTION[0]);
  console.log('top10', top10);
  for (let i = 0; i < top10.length; i++) {
    let div = $('<div>');
    div.append(`<h3>---- ${i + 1} ---- </h3>`);
    for (let a of top10[i].attachments) {
      let elementToAdd;
      switch (a.type) {
        case 'photo':
          elementToAdd = imageFromAttachment(a);
          break;
        case 'video':
          elementToAdd = videoFromAttachment(a);
          break;
        default:
          elementToAdd = `<span>Type ${a.type} non pris en charge<span>`;
      }

      div.append(elementToAdd);
    }
    for (let reac in top10[i].reactionMap) {
      div.append(`<div>${top10[i].reactionMap[reac]} ${reac}</div>`);
    }
    $('#app').append(div);
    $('#app').append('<hr>');
  }
}

function videoFromAttachment({ previewUrl, previewWidth, previewHeight }) {
  let div = $('<div>');
  div.append('<span>Vidéos non supportées pour le moment...</span>');
  div.append(
    imageFromAttachment({
      url: previewUrl,
      width: previewWidth,
      height: previewHeight,
    })
  );
  return div;
}

function imageFromAttachment({ url, width, height }) {
  let img = new Image(width, height);
  img.src = url;
  img.alt = 'Impossible de charger [' + url + ']';
  return img;
}

export default init;
