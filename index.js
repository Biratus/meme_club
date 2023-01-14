import './style.css';
import $ from 'jquery';
import { fullHistory } from './lib/fetch.js';
import { Top10BestMemes2022 } from './lib/data.js';

function init() {
  let top10 = Top10BestMemes2022();
  console.log(top10);
  for (let i = 0; i < top10.length; i++) {
    let div = $('<div>');
    div.append(`<h3>---- ${i + 1} ---- </h3>`);
    for (let a of top10[i].attachments) {
      let img = new Image();
      console.log(a.previewUrl);
      img.src = a.url;
      img.width = a.width;
      img.height = a.height;
      img.alt = 'Impossible de charge [' + a.type + ']';
      div.append(img);
    }
    for (let reac in top10[i].reactionMap) {
      div.append(`<div>${top10[i].reactionMap[reac]} ${reac}</div>`);
    }
    $('#app').append(div);
    $('#app').append('<hr>');
  }
}



init();
