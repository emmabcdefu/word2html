import styleImage from './website_src/image-viewer-css';
import scriptImage from './website_src/image-viewer-js';
import styleProgressBar from './website_src/reading-progress-bar-css';
import scriptProgressBar from './website_src/reading-progress-bar-js';

const myStyle = `
<style>.container {
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

.container h2 {
  font-size: 24px;
  line-height: 30px;
  padding-top: 0.25em;
  border-top: 4px solid #80C342;
}

.container h2 span.chapter {
  position: absolute;
  left: -1.25em;
}

.container h3 {
  font-size: 18px;
  line-height: 24px;
}

.container h3 span.chapter {
  position: absolute;
  left: -2em;
}

.container h4 {
  font-size: 16px;
  line-height: 20px;
}

.container h4 span.chapter {
  position: absolute;
  left: -2.5em;
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

const simpleElem: (content: any, e: number, numbers: any) => string = (
  content: any,
  e: number,
  numbers: any
) => {
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
    return `<img class="center-image image-clickable" src="${content[e].content}">`;
  }
  if (tag === 'iframe') {
    return `<iframe class="center-image" width="${content[e].width}" height="${content[e].height}" src="${content[e].content}" frameborder="0" allowfullscreen="true"></iframe>`;
  }
  if (tag === 'fig-caption') {
    return `<p class="fig-caption">${content[e].content}</p>`;
  }
  if (tag === 'footnote') {
    return `${content[e].content}</br>`;
  }
  if (tag === 'h1') {
    return `<h1>${content[e].content}</h1>`;
  }
  if (tag === 'h2') {
    if (content[e].number)
      return `<h2 id="${numbers.h2}" class="number"><span class="chapter">${numbers.h2}. </span>${content[e].content}</h2>`;
    return `<h2>${content[e].content}</h2>`;
  }
  if (tag === 'h3') {
    return `<h3 id="${numbers.h2}.${numbers.h3}"><span class="chapter">${numbers.h2}.${numbers.h3}</span>${content[e].content}</h3>`;
  }
  if (tag === 'h4') {
    return `<h4 id="${numbers.h2}.${numbers.h3}.${numbers.h4}"><span class="chapter">${numbers.h2}.${numbers.h3}.${numbers.h4}</span>${content[e].content}</h4>`;
  }
  console.error(`The element ${tag} is not yet handle !`);
  return '';
};

const generate = (content: Array<any>) => {
  let html = '';

  const numbers = {
    h2: 0,
    h3: 0,
    h4: 0,
    footnote: 0,
  };

  for (let e = 0; e < content.length; e += 1) {
    const tag = content[e].element;

    if (tag === 'h2' && content[e].number) {
      if (numbers.h2 === 0) {
        html += '<section>';
      } else {
        html += '</section><section>';
      }
      numbers.h2 += 1;
      numbers.h3 = 0;
      numbers.h4 = 0;
    } else if (tag === 'h3') {
      numbers.h3 += 1;
      numbers.h4 = 0;
    } else if (tag === 'h4') {
      numbers.h4 += 1;
    } else if (tag === 'footnote') {
      if (numbers.footnote === 0) {
        html += '<p class="footnote">';
      }
      numbers.footnote += 1;
    }

    if (tag === 'row-images' || tag === 'div') {
      if (tag === 'row-images') {
        html += '<div class="row-images">';
      } else {
        html += '<div class="two-column">';
      }

      for (let ee = 0; ee < content[e].content.length; ee += 1) {
        html += '<div>';
        for (let eee = 0; eee < content[e].content[ee].length; eee += 1) {
          html += simpleElem(content[e].content[ee], eee, numbers);
        }
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += simpleElem(content, e, numbers);
    }
  }

  if (numbers.footnote !== 0) html += `</p>`;

  html += '</section>';
  return html;
};

const write = (content: Array<any>) => {
  return myStyle + generate(content);
};

const finalWrite = (content: Array<any>, style: string) => {
  const head = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8" />
    <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
    <title>ENTSOG</title>
  </head>`;

  const allStyle = `
  <style>
  ${style}
  ${styleProgressBar}
  ${styleImage}
  </style>`;

  const body = `
  <body>
    <div class='container'>
      <div class='report'>
        ${generate(content)}
      </div>
    </div>

    <div id="image-viewer">
        <span class="close">&times;</span>
        <img class="modal-content" id="full-image">
    </div>`;

  const script = `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
    ${scriptProgressBar}
    </script>
    <script>
    ${scriptImage}
    </script>
  </body>
  </html>`;

  return head + allStyle + body + script;
};

export { write, finalWrite };
