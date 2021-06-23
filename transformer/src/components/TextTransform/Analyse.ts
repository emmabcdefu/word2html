// function to analyse what class is a p html tag
const detectClassP: any = (elem: string) => {
  if (elem.indexOf('class=') !== -1) {
    const cStart = elem.indexOf('class=') + 6;
    if (elem.indexOf(' ', cStart) === -1) {
      const cEnd = elem.indexOf('>', cStart);
      return elem.substr(cStart, cEnd - cStart);
    }
    const cEnd = Math.min(
      elem.indexOf(' ', cStart),
      elem.indexOf('>', cStart)
    );
    return elem.substr(cStart, cEnd - cStart);
  }
  console.error(`The element ${elem} has no class !`);
  return null;
};

// function to analyse what is inside a p html tag
const detectInsideP: any = (className: string, element: string, path: string, titleLevel:boolean) => {
  const elem = element.trim();
  if (elem.substr(0, 4) === '<img') {
    // multiple image in the p tag
    let start = 0;
    const content: Array<any> = [];
    while (elem.indexOf('<img', start) !== -1) {
      const srcStart = elem.indexOf('src=', start) + 5;
      const srcEnd = elem.indexOf('"', srcStart);
      start = srcEnd;
      content.push({
        element: 'img',
        content: path + '\\' + elem.substr(srcStart, srcEnd - srcStart).split('/')[1],
      });
    }
    return { element: 'img', content: content };
  }
  switch (className) {
    // title h1
    case 'EHead0':
      return { element: 'h1', content: elem };
    case 'EHead0Sub':
      return { element: 'h1', content: elem };
    // title h2
    case 'E1Level':
      return { element: 'h2', number: true, content: elem };
    case 'EHead1':
      return { element: 'h2', number: false, content: elem };
    // title h3
    case 'E2Level':
      return { element: 'h3', content: elem };
    case 'EHead2':
      if (titleLevel) return { element: 'list', content: elem };
      return { element: 'h3', content: elem };
    // title h4
    case 'E3Level':
      return { element: 'h4', content: elem };
    case 'EHead3':
      if (titleLevel) return { element: 'list', content: elem };
      return { element: 'h4', content: elem };
    // p
    case 'E4Level':
      return { element: 'p', content: elem };
    case 'E5Level':
      return { element: 'p', content: elem };
    case 'EHead4':
      if (titleLevel) return { element: 'list', content: elem };
      return { element: 'p', content: elem };
    // p or img
    case 'MsoNormal':
      return { element: 'p', content: elem };
    case 'MsoCaption':
      // figure caption
      return { element: 'fig-caption', content: elem };
    case 'MsoCommentText':
      // figure caption
      return { element: 'fig-caption', content: elem };
    case 'MsoListParagraph':
      // list
      return { element: 'list', content: elem };
    case 'MsoFootnoteText':
      // footnote
      return { element: 'footnote', content: elem };
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
      console.error(`The element ${className} isn't recognize`);
      return { element: null };
  }
};

// function that understand p tag
const detectP: any = (elem: string, path: string, titleLevel:boolean) => {
  const inside = elem.substr(elem.indexOf('>') + 1, elem.length).trim();
  if (inside !== '') {
    const className = detectClassP(elem);
    if (className != null) {
      const result = detectInsideP(className, inside, path, titleLevel);
      if (result.element !== null && result.content !== '') {
        return result;
      }
    }
  }
  return null;
};

export default function analyse(htm: string, path: string) {

  // Collect only the body part
  const bodyStart = htm.indexOf('<body');
  const bodyEnd = htm.indexOf('</body>');
  let body = htm.substr(bodyStart, bodyEnd - bodyStart + 7);

  const titleLevel = body.indexOf('E1Level') !== -1;

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
    body = body.substr(0, beforeA) + body.substr(beforeA2, afterA - beforeA2) + body.substr(afterA + 4, body.length);
  }
  body = body.replace(/( title="")/gm, '');
  body = body.replace(/(<\/span>|&nbsp;|�|&gt;)/gm, '');
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

  const content = [];
  // Analyse every p component
  let end = 0;
  while (body.indexOf('<', end) !== -1) {
    const start = body.indexOf('<', end);

    if (body[start + 1] === 'p') {
      // p, img, list, title, figure caption

      end = body.indexOf('</p>', start);
      const elem = body.substr(start, end - start);
      const result = detectP(elem, path, titleLevel);
      if (result != null) {
        if (result.element === 'img') {
          for (const out in result.content) {
            content.push(result.content[parseInt(out, 10)]);
          }
        } else {
          content.push(result);
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
            const result = detectP(elem, path, titleLevel);
            if (result != null) {
              if (result.element === 'img') {
                for (const out in result.content) {
                  content.push(result.content[parseInt(out, 10)]);
                }
              } else {
                content.push(result);
              }
            }
          }
        } else {
          const mainResult: any = { element: nbTd === 2 ? 'div' : 'row-images', content: [] };

          let advence = 0;
          for (let j = 0; j < nbTd; j++) {
            let jcontent = [];

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
              const result = detectP(elem, path, titleLevel);
              if (result != null) {
                if (result.element === 'img') {
                  for (const out in result.content) {
                    jcontent.push(result.content[parseInt(out, 10)]);
                  }
                } else {
                  jcontent.push(result);
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
