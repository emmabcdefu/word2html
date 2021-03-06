// Types
import ElementInfo from '../../types/ElementInfo';
import ElementInfoBase from '../../types/ElementInfoBase';

const img2base64 = (src: string) => {
  // Get the image
  const img = new Image();
  img.src = src;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  ctx!.drawImage(img, 0, 0);

  return canvas.toDataURL('image/png');
};

const simpleElem = (
  content: ElementInfo[],
  e: number,
  numbers: Numbers,
  output: boolean,
  path: string,
  img: boolean
) => {
  switch (content[e].element) {
    case 'p':
      return `<p ${content[e].small ? 'class="small"' : ''}>${
        content[e].content
      }</p>`;
    case 'list':
      return `${
        e === 0 || content[e - 1].element !== 'list' ? '<ul>' : ''
      } <li ${content[e].small ? 'class="small"' : ''}>${
        content[e].content
      }</li> ${
        e === content.length - 1 || content[e + 1].element !== 'list'
          ? '</ul>'
          : ''
      }`;
    case 'img':
      if (output)
        return `<img class="center-image${
          img && content[e].click ? ' image-clickable' : ''
        }" src="${img2base64(`${path}/${content[e].content}`)}">`;
      return `<img class="center-image${
        img && content[e].click ? ' image-clickable' : ''
      }" src="${path}/${content[e].content}">`;
    case 'iframe':
      return `<iframe class="center-image" width="${
        Object.prototype.hasOwnProperty.call(content[e], 'width')
          ? content[e].width
          : '800'
      }" height="${
        Object.prototype.hasOwnProperty.call(content[e], 'height')
          ? content[e].height
          : '600'
      }" src="${
        content[e].content
      }" frameborder="0" allowfullscreen="true"></iframe>`;
    case 'fig-caption':
      return `<p class="fig-caption">${content[e].content}</p>`;
    case 'footnote':
      return `${content[e].content}</br>`;
    case 'h1':
      return `<h1>${content[e].content}</h1>`;
    case 'h2':
      if (content[e].number)
        return `<h2 id="${numbers.h2}" class="number"><span class="chapter">${numbers.h2}. </span>${content[e].content}</h2>`;
      return `<h2>${content[e].content}</h2>`;
    case 'h3':
      if (content[e].number)
        return `<h3 id="${numbers.h2}.${numbers.h3}" class="number"><span class="chapter">${numbers.h2}.${numbers.h3}</span>${content[e].content}</h3>`;
      return `<h3>${content[e].content}</h3>`;
    case 'h4':
      if (content[e].number)
        return `<h4 id="${numbers.h2}.${numbers.h3}.${numbers.h4}" class="number"><span class="chapter">${numbers.h2}.${numbers.h3}.${numbers.h4}</span>${content[e].content}</h4>`;
      return `<h4>${content[e].content}</h4>`;
    default:
      console.error(`The element ${content[e].element} is not yet handle !`);
      return '';
  }
};
interface Numbers {
  h2: number;
  h3: number;
  h4: number;
  footnote: number;
}

const generate = (
  content: ElementInfo[],
  path: string,
  output: boolean,
  img: boolean
) => {
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
          const myContent = content[e].content[ee] as ElementInfoBase[];
          html += simpleElem(myContent, eee, numbers, output, path, img);
        }
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += simpleElem(content, e, numbers, output, path, img);
    }
  }

  if (numbers.footnote !== 0) html += '</p>';

  html += '</section>';
  return html;
};

export default generate;
