// Functions
import generateId from '../Other/id';
// Types
import ElementInfoBase from '../../types/ElementInfoBase';
import ElementInfoTable from '../../types/ElementInfoTable';

// function to analyse what class is a p html tag
const detectClassP = (elem: string) => {
  if (elem.indexOf('class=') !== -1) {
    const cStart = elem.indexOf('class=') + 6;
    if (elem.indexOf(' ', cStart) === -1) {
      const cEnd = elem.indexOf('>', cStart);
      return elem.substr(cStart, cEnd - cStart);
    }
    const cEnd = Math.min(elem.indexOf(' ', cStart), elem.indexOf('>', cStart));
    return elem.substr(cStart, cEnd - cStart);
  }
  return null;
};

// function to analyse what is inside a p html tag
const detectInsideP = (
  className: string,
  element: string,
  titleLevel: boolean
) => {
  const elem = element.trim();
  if (elem.substr(0, 4) === '<img') {
    // multiple image in the p tag
    let start = 0;
    const content: ElementInfoBase[] = [];
    while (elem.indexOf('<img', start) !== -1) {
      const srcStart = elem.indexOf('src=', start) + 5;
      const srcEnd = elem.indexOf('"', srcStart);
      start = srcEnd;
      content.push({
        id: generateId(),
        element: 'img',
        content: `${elem.substr(srcStart, srcEnd - srcStart)}`,
        click: true,
      });
    }
    return { element: 'img', content };
  }
  switch (className) {
    // title h1
    case 'EHead0':
      return { id: generateId(), element: 'h1', content: elem };
    case 'EHead0Sub':
      return { id: generateId(), element: 'h1', content: elem };
    // title h2
    case 'E1Level':
      return { id: generateId(), element: 'h2', content: elem, number: true };
    case 'EHead1':
      return { id: generateId(), element: 'h2', content: elem, number: false };
    // title h3
    case 'E2Level':
      return { id: generateId(), element: 'h3', content: elem, number: true };
    case 'EHead2':
      if (titleLevel)
        return { id: generateId(), element: 'list', content: elem };
      return { id: generateId(), element: 'h3', content: elem, number: true };
    // title h4
    case 'E3Level':
      return { id: generateId(), element: 'h4', content: elem, number: true };
    case 'EHead3':
      if (titleLevel)
        return { id: generateId(), element: 'list', content: elem };
      return { id: generateId(), element: 'h4', content: elem, number: true };
    // p
    case 'E4Level':
      return { id: generateId(), element: 'p', content: elem };
    case 'E5Level':
      return { id: generateId(), element: 'p', content: elem };
    case 'EHead4':
      if (titleLevel)
        return { id: generateId(), element: 'list', content: elem };
      return { id: generateId(), element: 'p', content: elem };
    // p or img
    case 'MsoNormal':
      return { id: generateId(), element: 'p', content: elem };
    case 'MsoCaption':
      // figure caption
      return { id: generateId(), element: 'fig-caption', content: elem };
    case 'MsoCommentText':
      // figure caption
      return { id: generateId(), element: 'fig-caption', content: elem };
    case 'MsoListParagraph':
      // list
      return { id: generateId(), element: 'list', content: elem };
    case 'MsoFootnoteText':
      // footnote
      return { id: generateId(), element: 'footnote', content: elem };
    case 'MsoTocHeading':
      // table of content
      return { element: null };
    case 'MsoToc1':
      // element of the table of content
      return { element: null };
    case 'MsoToc2':
      // element of the table of content
      return { element: null };
    case 'MsoToc3':
      // element of the table of content
      return { element: null };
    default:
      return { element: null };
  }
};

// function that understand p tag
const detectP = (elem: string, titleLevel: boolean) => {
  const inside = elem.substr(elem.indexOf('>') + 1, elem.length).trim();
  if (inside !== '') {
    const className = detectClassP(elem);
    if (className != null) {
      const result = detectInsideP(className, inside, titleLevel);
      if (result.element !== null && result.content !== '') {
        return result;
      }
    }
  }
  return null;
};

export default function analyse(htm: string) {
  // Collect only the body part
  const bodyStart = htm.indexOf('<body');
  const bodyEnd = htm.indexOf('</body>');
  let body = htm.substr(bodyStart, bodyEnd - bodyStart + 7);

  // Clean the body
  body = body.replace(/(\r\n|\n|\r)/gm, ' ');

  while (body.indexOf('<span') !== -1) {
    const cut1 = body.indexOf('<span');
    const cut2 = body.indexOf('>', cut1);
    body = body.substr(0, cut1) + body.substr(cut2 + 1, body.length);
  }
  while (body.indexOf('<br') !== -1) {
    const cut1 = body.indexOf('<br');
    const cut2 = body.indexOf('>', cut1);
    body = body.substr(0, cut1) + body.substr(cut2 + 1, body.length);
  }
  while (body.indexOf('<a name') !== -1) {
    const beforeA = body.indexOf('<a name');
    const beforeA2 = body.indexOf('>', beforeA) + 1;
    const afterA = body.indexOf('</a>', beforeA2);
    body =
      body.substr(0, beforeA) +
      body.substr(beforeA2, afterA - beforeA2) +
      body.substr(afterA + 4, body.length);
  }
  body = body.replace(/( title="")/gm, '');
  body = body.replace(/(<\/span>|&nbsp;|???|&gt;)/gm, '');
  let newbody = body;
  do {
    body = newbody;
    newbody = newbody.replace(/(<\/i><i>)/gm, '');
    newbody = newbody.replace(/(<i><\/i>)/gm, '');
    newbody = newbody.replace(/(<\/b><b>)/gm, '');
    newbody = newbody.replace(/(<b><\/b>)/gm, '');
  } while (body !== newbody);
  body = body.replace(/(<sup><sup>)/gm, '<sup>');
  body = body.replace(/(<\/sup><\/sup>)/gm, '</sup>');
  body = body.replace(/(b>)/gm, 'strong>');
  body = body.replace(/( {2})/gm, ' ');

  const titleLevel = body.indexOf('E2Level') !== -1;

  const content = [];
  // Analyse every p component
  let end = 0;
  while (body.indexOf('<', end) !== -1) {
    const start = body.indexOf('<', end);

    if (body[start + 1] === 'p') {
      // p, img, list, title, figure caption

      end = body.indexOf('</p>', start);
      const elem = body.substr(start, end - start);
      const result = detectP(elem, titleLevel);
      if (result != null) {
        if (result.element === 'img') {
          Object.values(result.content).forEach((out) =>
            content.push(out as ElementInfoBase)
          );
        } else {
          content.push(result as ElementInfoBase);
        }
      }
    } else if (body.substr(start + 1, 5) === 'table') {
      end = body.indexOf('</table>', start);
      const table = body.substr(start + 1, end - start - 1);

      let trEnd = 0;
      while (table.indexOf('<tr', trEnd) !== -1) {
        const trStart = table.indexOf('>', table.indexOf('<tr', trEnd)) + 1;
        trEnd = table.indexOf('</tr>', trStart);
        const trInside = table.substr(trStart, trEnd - trStart).trim();

        const nbTd = trInside.split('</td>').length - 1;
        if (nbTd === 1) {
          const tdStart = trInside.indexOf('>') + 1;
          const tdEnd = trInside.indexOf('</td>', tdStart);
          const tdInside = trInside.substr(tdStart, tdEnd - tdStart).trim();

          let pEnd = 0;
          while (tdInside.indexOf('<p', pEnd) !== -1) {
            const pStart = tdInside.indexOf('<p', pEnd);
            pEnd = tdInside.indexOf('</p>', pStart);

            // No table inside a table
            const elem = tdInside.substr(pStart, pEnd - pStart);
            const result = detectP(elem, titleLevel);
            if (result != null) {
              if (result.element === 'img') {
                Object.values(result.content).forEach((out) =>
                  content.push(out as ElementInfoBase)
                );
              } else {
                content.push(result as ElementInfoBase);
              }
            }
          }
        } else {
          const mainResult: ElementInfoTable = {
            element: nbTd === 2 ? 'div' : 'row-images',
            content: [],
            id: generateId(),
          };

          let advence = 0;
          for (let j = 0; j < nbTd; j += 1) {
            const jcontent = [];

            const tdStart = trInside.indexOf('>', advence) + 1;
            const tdEnd = trInside.indexOf('</td>', tdStart);
            advence = trInside.indexOf('<td', tdEnd);
            const tdInside = trInside.substr(tdStart, tdEnd - tdStart).trim();

            let pEnd = 0;
            while (tdInside.indexOf('<p', pEnd) !== -1) {
              const pStart = tdInside.indexOf('<p', pEnd);
              pEnd = tdInside.indexOf('</p>', pStart);

              // No table inside a table
              const elem = tdInside.substr(pStart, pEnd - pStart);
              const result = detectP(elem, titleLevel);
              if (result != null) {
                if (result.element === 'img') {
                  Object.values(result.content).forEach((out) =>
                    jcontent.push(out as ElementInfoBase)
                  );
                } else {
                  jcontent.push(result as ElementInfoBase);
                }
              }
            }
            if (jcontent.length !== 0) {
              mainResult.content.push(jcontent);
            }
          }
          if (mainResult.content.length !== 0) {
            content.push(mainResult);
          }
        }
      }
    } else {
      end += 1;
    }
  }

  return content;
}
