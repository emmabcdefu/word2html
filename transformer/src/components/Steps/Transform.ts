class Information {
  htm: string; json: any;

  constructor(htm: string) {
    this.htm = htm;
    this.json = {};
  }

  analyse() {
    // Collect the title
    const titleStart = this.htm.indexOf('<title>');
    const tittleEnd = this.htm.indexOf('</title>');
    this.json.title = this.htm.substr(titleStart + 7, tittleEnd - titleStart - 7);

    // Collect only the body part
    const bodyStart = this.htm.indexOf('<body');
    const bodyEnd = this.htm.indexOf('</body>');
    const body = this.htm.substr(bodyStart, bodyEnd - bodyStart + 7);

    // Detect sections
    const indexSection = [];
    let index = body.indexOf('<p class=E1Level', 0);
    while (index !== -1) {
      indexSection.push(index);
      index = body.indexOf('<p class=E1Level', indexSection[indexSection.length - 1] + 1);
    }
    this.json.sections = [];

    // Detect title of sections and element inside them
    for (const i in indexSection) {
      // Detect title
      const span = body.indexOf('><span', indexSection[i]);
      const index1 = body.indexOf('>', span + 1);
      const index2 = body.indexOf('<', index1);

      // Element inside detection
      const elem1 = body.indexOf('</p>', index2) + 5;
      let elem2 = 0;
      if (parseInt(i) !== indexSection.length - 1) {
        elem2 = indexSection[parseInt(i) + 1];
      } else {
        // In case of the last section
        let startLooking = elem1;
        let startFinding = elem1;
        let div = true;
        while (div) {
          elem2 = body.indexOf('</div>', startFinding);
          const endLooking = elem2;

          const str = body.substr(startLooking, endLooking - startLooking);
          // In case if there is multiple div in the section, we need to choose the right one
          if (str.indexOf('<div') !== -1) {
            startLooking = startLooking + str.indexOf('<div') + 1;
            startFinding = elem2 + 1;
          } else {
            div = false;
          }
        }
      }

      // Select the content
      let section = body.substr(elem1, elem2 - elem1);

      // Clean content
      section = section.trim();
      while (section.indexOf('<span') !== -1) {
        const cut1 = section.indexOf('<span');
        const cut2 = section.indexOf('>', cut1);
        section = section.substr(0, cut1) + section.substr(cut2 + 1, section.length);
      }
      while (section.indexOf('</span>') !== -1) {
        section = section.replace('</span>', '');
      }
      while (section.indexOf('&nbsp;') !== -1) {
        section = section.replace('&nbsp;', '');
      }
      while (section.indexOf('�') !== -1) {
        section = section.replace('�', '');
      }
      while (section.indexOf('&gt;') !== -1) {
        section = section.replace('&gt;', '');
      }
      while (section.indexOf('</i><i>') !== -1) {
        section = section.replace('</i><i>', '');
      }
      while (section.indexOf('<sup><sup>') !== -1) {
        section = section.replace('<sup><sup>', '<sup>');
      }
      while (section.indexOf('</sup></sup>') !== -1) {
        section = section.replace('</sup></sup>', '</sup>');
      }
      while (section.indexOf('<b></b>') !== -1) {
        section = section.replace('<b></b>', '');
      }
      while (section.indexOf('<b>') !== -1) {
        section = section.replace('<b>', '<strong>');
      }
      while (section.indexOf('</b>') !== -1) {
        section = section.replace('</b>', '</strong>');
      }

      // Detect what is inside the content

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
        console.error(`The element ${elem} has no class !`);
        return null;
      };

      // function to analyse what is inside a p html tag
      const detectInsideP = (className: string, elem: string) => {
        elem = elem.trim();
        if (elem.substr(0, 4) === '<img') {
          const srcStart = elem.indexOf('src=') + 5;
          const srcEnd = elem.indexOf("'", srcStart);
          return { element: 'img', src: elem.substr(srcStart, srcEnd - srcStart) };
        }
        if (className === 'MsoNormal') { // p or img
          return { element: 'p', content: elem };
        } else if (className === 'MsoCaption' || className === 'MsoCommentText') { // figure caption
          return { element: 'fig-caption', content: elem };
        } else if (className === 'MsoListParagraph') { // list
          return { element: 'list', content: elem };
        } else if (className === 'EHead2') { // title
          return { element: 'h2', content: elem };
        }
        console.error(`The element ${className} isn't recognize`);
        return { element: null };
      };

      // function that analyse
      const detectP = (elem: string) => {
        const inside = elem.substr(elem.indexOf('>') + 1, elem.length).trim();
        if (inside !== '') {
          const className = detectClassP(elem);
          if (className != null) {
            const result = detectInsideP(className, inside);
            if (result.element !== null) {
              return result;
            }
          }
        }
        return null;
      };

      let content: any;
      content = [];
      let end = 0;
      while (section.indexOf('<', end) !== -1) {
        const start = section.indexOf('<', end);

        if (section[start + 1] === 'p') {
          // p, img, list, title, figure caption

          end = section.indexOf('</p>', start);
          const elem = section.substr(start, end - start);
          const result = detectP(elem);
          if (result != null) content.push(result);
        } else if (section.substr(start + 1, 5) === 'table') {
          end = section.indexOf('</table>', start);
          const table = section.substr(start + 1, end - start - 1);

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
                const result = detectP(elem);
                if (result != null) content.push(result);
              }
            } else {
              
              let mainResult: any;
              mainResult = { element: nbTd === 2 ? 'div' : 'row-images' };

              let advence = 0;
              for (let j = 0; j < nbTd; j++) {
                mainResult[`content${j + 1}`] = [];

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
                  const result = detectP(elem);
                  if (result != null) mainResult[`content${j + 1}`].push(result);

                }
              }

              content.push(mainResult);
            }
          }
        } else {
          end += 1;
        }
      }

      this.json.sections.push({
        title: body.substr(index1 + 1, index2 - index1 - 1),
        content: content,
      });
    }

    console.log(this.json);
  }
}

export default Information;
