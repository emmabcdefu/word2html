const simpleElem: any = (json:any, content: any, tag: string, e: number, s: number) => {
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
    return `<img class="center-image image-clickable" src="${json.path + src.substr(src.indexOf('/'), src.length)}">`;
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
          html += simpleElem(json, section.content[e].content1, etag, ee, s);
        }
        html += '</div><div>';
        for (let ee = 0; ee < section.content[e].content2.length; ee++) {
          const etag = section.content[e].content2[ee].element;
          html += simpleElem(json, section.content[e].content2, etag, ee, s);
        }
        html += '</div></div>';
      } else if (tag === 'row-images') {
        html += '<div class="row-images">';
        let ee = 1;
        while (Object.prototype.hasOwnProperty.call(section.content[e], `content${ee}`)) {
          html += '<div>';
          for (let eee = 0; eee < section.content[e][`content${ee}`].length; eee++) {
            const etag = section.content[e][`content${ee}`][eee].element;
            html += simpleElem(json, section.content[e][`content${ee}`], etag, eee, s)
          }
          html += '</div>';
          ee++;
        }
        html += '</div>';
      } else {
        html += simpleElem(json, section.content, tag, e, s);
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

  return style + html;
}

const style: string = `<style>.container {
  font-family: Lato;
}

.container .report {
  position: relative;
  background-color: #D6E1E5;
}

.container h1, .container h2, .container h3, .container h4, .container a, .container strong {
  color: #1f4484;
  font-weight: 700;
}

.container h1, .container h2, .container h3 {
  text-transform: uppercase;
  letter-spacing: 1px;
}

.container h1 {
  font-size: 48px;
  line-height: 60px;
}

.container h3 {
  font-size: 24px;
  line-height: 30px;
  padding-top: 0.25em;
  border-top: 4px solid #80C342;
}

.container h3 span.chapter {
  position: absolute;
  left: -1.25em;
}

.container h4 {
  font-size: 18px;
  line-height: 24px;
}

.container h4 span.chapter {
  position: absolute;
  left: -2em;
}

.container h6 {
  font-size: 24px;
  line-height: 30px;
}

.container p, .container li {
  text-align: justify;
  font-size: 15px;
  line-height: 24px;
}

.container .footnote {
  border-top: 1px solid #666666;
  font-size: 12.75px;
  line-height: 24px;
}

.container.footnote sup::before {
  display: block;
  content: " ";
  margin-top: -150px;
  height: 150px;
  visibility: hidden;
  pointer-events: none;
}

.container li {
  list-style-image: url(./lp-green.png);
}

.container img {
  max-width: 100%;
}

.container .center-image {
  margin: auto;
  display: block;
}

.container .fig-caption {
  padding-top: 0.5em;
  border-top: 1px solid #81d742;
  color: #1f4484;
  text-align: center;
}

.container .fig-caption-above {
  padding-bottom: 0.5em;
  border-bottom: 1px solid #81d742;
  color: #1f4484;
  text-align: center;
}

.container .two-column {
  display: flex;
}

.container .two-column div {
  width: calc(50% - 20px);
}

.container .two-column div:first-of-type {
  padding-right: 40px;
}

.container .row-images {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>`;
