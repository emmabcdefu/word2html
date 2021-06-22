const simpleElem: any = (content: any, e: number, numbers: any, path: string) => {
  const tag = content[e].element;
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
    const src = content[e].content;
    return `<img class="center-image image-clickable" src="${path + src.substr(src.indexOf('/'), src.length)}">`;
  }
  if (tag === 'fig-caption') {
    return `<p class="fig-caption">${content[e].content}</p>`;
  }
  if (tag === 'footnote') {
    return `${content[e].content}</br>`;
  }
  if (tag === 'h2') {
    return `<h3 id="${numbers.h2}"><span class="chapter">${numbers.h2}. </span>${content[e].content}</h4>`;
  }
  if (tag === 'h3') {
    return `<h4 id="${numbers.h2}.${numbers.h3}"><span class="chapter">${numbers.h2}.${numbers.h3}</span>${content[e].content}</h4>`;
  }
  console.error(`The element ${tag} is not yet handle !`);
  return '';
};

export default function write(json: any) {
  let html = `<h1>${json.title}</h1>`;

  const numbers = {
    h2: 0,
    h3: 0,
    footnote: 0,
  };

  for (let e = 0; e < json.content.length; e++) {
    const tag = json.content[e].element;

    if (tag === 'h2') {
      if (numbers.h2 === 0) {
        html += '<section>';
      } else {
        html += '</section><section>';
      }
      numbers.h2++;
      numbers.h3 = 0;
    } else if (tag === 'h3') {
      numbers.h3++;
    } else if (tag === 'footnote') {
      if (numbers.footnote === 0) {
        html += '<p class="footnote">';
      }
      numbers.footnote++;
    }

    if (tag === 'row-images' || tag === 'div') {
      if (tag === 'row-images') {
        html += '<div class="row-images">';
      } else {
        html += '<div class="two-column">';
      }

      for (let ee = 0; ee < json.content[e].content.length ; ee++) {
        html += '<div>';
        for (let eee = 0; eee < json.content[e].content[ee].length; eee++) {
          html += simpleElem(json.content[e].content[ee], eee, numbers, json.path)
        }
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += simpleElem(json.content, e, numbers, json.path);
    }
  }

  if (numbers.footnote !== 0) html += `</p>`;

  html += '</section>';
  return style + html;
}

const style = `<style>.container {
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
