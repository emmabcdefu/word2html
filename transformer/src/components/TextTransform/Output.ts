const simpleElem: any = (content: any, tag: string, e: number, s: number) => {
  if (tag === 'p') {
    return `<p>${content[e].content}</p>`;
  }
  if (tag === 'list') {
    let txt = ``;
    if (e === 0 || content[e - 1].element !== 'list') {
      txt += `<ul>`;
    }
    txt += `<li>${content[e].content}</li>`;
    if (e === content.length - 1 || content[e + 1].element !== 'list') {
      txt += `</ul>`;
    }
    return txt;
  }
  if (tag === 'img') {
    const src = content[e].src;
    return `<img class="center-image image-clickable" src="${src.substr(src.indexOf('/')+1, src.length)}">`;
  }
  if (tag === 'fig-caption') {
    return `<p class="fig-caption">${content[e].content}</p>`;
  }
  if (tag === 'h2') {
    let ss = 1;
    for (let i = 0; i < e; i++) {
      if (content[i].element === 'h2') {
        ss++;
      }
    }
    return `<h4 id="${s}.${ss}"><span class="chapter">${s}.${ss}</span>${content[e].content}</h4>`;
  }
  return ``;
};

export default function write(json: any) {
  let html = `<h1>${json.title}</h1>`;

  for (let s = 0; s < json.sections.length; s++) {
    const section = json.sections[s];
    html += `<section>`;
    html += `<h3 id="${s}"><span class="chapter">${s}. </span>${section.title}</h3>`;

    for (let e = 0; e < section.content.length; e++) {
      const tag = section.content[e].element;

      if (tag === 'div') {
        html += '<div class="two-column"><div>';
        for (let ee = 0; ee < section.content[e].content1.length; ee++) {
          const etag = section.content[e].content1[ee].element;
          html += simpleElem(section.content[e].content1, etag, ee, s);
        }
        html += '</div><div>';
        for (let ee = 0; ee < section.content[e].content2.length; ee++) {
          const etag = section.content[e].content2[ee].element;
          html += simpleElem(section.content[e].content2, etag, ee, s);
        }
        html += '</div></div>';
      } else if (tag === 'row-images') {
        html += '<div class="row-images">';
        let ee = 1;
        while (Object.prototype.hasOwnProperty.call(section.content[e], `content${ee}`)) {
          html += '<div>';
          for (let eee = 0; eee < section.content[e][`content${ee}`].length; eee++) {
            const etag = section.content[e][`content${ee}`][eee].element;
            html += simpleElem(section.content[e][`content${ee}`], etag, eee, s)
          }
          html += '</div>';
          ee++;
        }
        html += '</div>';
      } else {
        html += simpleElem(section.content, tag, e, s);
      }
    }

    if (section.footnote.length !== 0) {
      html += `<p class="footnote">`;
      for (let f = 0; f < section.footnote.length; f++) {
        const nb = section.footnote[f];
        const txt = json.footnote[nb - 1].info;
        html += `<sup id="footnote${nb}">${nb}</sup> ${txt}</br>`;
      }
      html += `</p>`;
    }

    html += `</section>`;
  }

  return html;
}
